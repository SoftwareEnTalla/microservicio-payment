import { randomUUID } from 'crypto';
import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { LogExecutionTime } from '../../common/logger/loggers.functions';
import { Payment } from '../payment/entities/payment.entity';
import { PaymentCustomerGatewayEligibility } from '../payment-customer-gateway-eligibility/entities/payment-customer-gateway-eligibility.entity';
import { PaymentMerchantGatewayEligibility } from '../payment-merchant-gateway-eligibility/entities/payment-merchant-gateway-eligibility.entity';
import { PaymentCustomerWallet } from './payment-customer-wallet.entity';
import { PaymentPayoutRequest } from './payment-payout-request.entity';
import { PaymentWalletMovement } from './payment-wallet-movement.entity';

interface LoyaltySummaryTotals {
  totalWallets: number;
  walletsWithCashback: number;
  walletsWithWithdrawable: number;
  totalCashbackBalance: number;
  totalWithdrawableBalance: number;
  totalEarnedCashback: number;
  totalEarnedReferral: number;
  totalMovements: number;
}

interface LoyaltySettlementPayload {
  beneficiaryCustomerId?: string;
  level?: number;
  referenceCode?: string;
}

interface MultilevelReferralBeneficiaryPayload {
  beneficiaryCustomerId?: string;
  level?: number;
  referenceCode?: string;
  sharePercent?: number;
  amount?: number;
}

interface MultilevelReferralSettlementPayload {
  beneficiaries?: MultilevelReferralBeneficiaryPayload[];
  platformResidualCustomerId?: string;
  platformReferenceCode?: string;
}

interface NormalizedReferralAllocation {
  beneficiaryCustomerId: string;
  level: number;
  referenceCode: string | null;
  amount: number;
}

interface LoyaltyWalletRow {
  id: string;
  customerId: string;
  cashbackBalance: number;
  withdrawableBalance: number;
  totalEarnedCashback: number;
  totalEarnedReferral: number;
  lastMovementAt: Date | null;
}

interface LoyaltyProfileRow {
  customerId: string;
  referralCode: string;
  loyaltyRank: string;
  withdrawalEligible: boolean;
  totalReferralMovements: number;
  totalReferralAmount: number;
  totalCashbackAmount: number;
  maxReferralLevel: number;
  withdrawableBalance: number;
  totalEarnedReferral: number;
  totalEarnedCashback: number;
  lastMovementAt: Date | null;
}

interface LoyaltyProfileAggregate {
  customerId: string;
  totalReferralMovements: number;
  totalReferralAmount: number;
  totalCashbackAmount: number;
  maxReferralLevel: number;
  lastMovementAt: Date | null;
}

interface ReferralLevelRow {
  level: number;
  totalMovements: number;
  totalAmount: number;
  distinctBeneficiaries: number;
}

interface MultilevelEligibilityTotals {
  candidatePayments: number;
  eligiblePayments: number;
  blockedPayments: number;
  missingCustomerEligibility: number;
  customerRequiresRevalidation: number;
  customerExpiredEligibility: number;
  missingMerchantEligibility: number;
  merchantInactiveEligibility: number;
}

interface MultilevelEligibilityRow {
  paymentId: string;
  paymentCode: string;
  customerId: string;
  merchantId: string;
  gatewayId: string;
  currency: string;
  selectedPaymentMethodType: string;
  referralAmount: number;
  paymentStatus: string;
  accountingStatus: string;
  customerEligibilityStatus: string | null;
  merchantEligibilityStatus: string | null;
  eligible: boolean;
  blockers: string[];
  createdAt: Date;
}

interface PayoutSummaryTotals {
  totalRequests: number;
  pendingRequests: number;
  approvedRequests: number;
  processedRequests: number;
  rejectedRequests: number;
  totalRequestedAmount: number;
  merchantsInvolved: number;
  customersInvolved: number;
  latestRequestedAt?: Date | null;
}

interface PayoutRequestRow {
  id: string;
  walletId: string;
  customerId: string;
  merchantId: string;
  merchantGatewayEligibilityId?: string | null;
  paymentId?: string | null;
  orderId?: string | null;
  requestReference: string;
  status: string;
  amount: number;
  currencyCode: string;
  invoiceId?: string | null;
  preferredCollectionMethod?: string | null;
  settlementMode?: string | null;
  notes?: string | null;
  merchantDebtAppliedAmount: number;
  merchantNetAmount: number;
  settlementReference?: string | null;
  requestedAt?: Date | null;
  processedAt?: Date | null;
  createdAt: Date;
}

interface CreatePayoutRequestPayload {
  customerId?: string;
  merchantId?: string;
  amount?: number;
  currencyCode?: string;
  preferredCollectionMethod?: string;
  notes?: string;
  paymentId?: string;
  orderId?: string;
}

interface ApprovePayoutRequestPayload {
  note?: string;
  merchantDebtAmount?: number;
  invoiceId?: string;
}

interface RejectPayoutRequestPayload {
  reason?: string;
}

interface SettlePayoutRequestPayload {
  merchantDebtAmount?: number;
  settlementReference?: string;
  note?: string;
  invoiceId?: string;
}

@Injectable()
export class PaymentLoyaltyService {
  constructor(
    @InjectRepository(Payment)
    private readonly paymentRepository: Repository<Payment>,
    @InjectRepository(PaymentCustomerGatewayEligibility)
    private readonly customerEligibilityRepository: Repository<PaymentCustomerGatewayEligibility>,
    @InjectRepository(PaymentCustomerWallet)
    private readonly walletRepository: Repository<PaymentCustomerWallet>,
    @InjectRepository(PaymentWalletMovement)
    private readonly movementRepository: Repository<PaymentWalletMovement>,
    @InjectRepository(PaymentPayoutRequest)
    private readonly payoutRequestRepository: Repository<PaymentPayoutRequest>,
    @InjectRepository(PaymentMerchantGatewayEligibility)
    private readonly merchantEligibilityRepository: Repository<PaymentMerchantGatewayEligibility>,
  ) {}

  async getSummary(limit = 8): Promise<Record<string, unknown>> {
    const safeLimit = Number.isFinite(limit) && limit > 0 ? Math.min(limit, 20) : 8;
    const [walletTotalsRaw, movementTotalsRaw, latestMovements, latestWallets, profileAggregatesRaw] = await Promise.all([
      this.walletRepository
        .createQueryBuilder('wallet')
        .select('COUNT(*)', 'totalWallets')
        .addSelect('COUNT(*) FILTER (WHERE COALESCE(wallet."cashbackBalance", 0) > 0)', 'walletsWithCashback')
        .addSelect('COUNT(*) FILTER (WHERE COALESCE(wallet."withdrawableBalance", 0) > 0)', 'walletsWithWithdrawable')
        .addSelect('COALESCE(SUM(COALESCE(wallet."cashbackBalance", 0)), 0)', 'totalCashbackBalance')
        .addSelect('COALESCE(SUM(COALESCE(wallet."withdrawableBalance", 0)), 0)', 'totalWithdrawableBalance')
        .addSelect('COALESCE(SUM(COALESCE(wallet."totalEarnedCashback", 0)), 0)', 'totalEarnedCashback')
        .addSelect('COALESCE(SUM(COALESCE(wallet."totalEarnedReferral", 0)), 0)', 'totalEarnedReferral')
        .getRawOne<Record<string, string | number> | undefined>(),
      this.movementRepository
        .createQueryBuilder('movement')
        .select('COUNT(*)', 'totalMovements')
        .getRawOne<Record<string, string | number> | undefined>(),
      this.movementRepository.find({
        order: { createdAt: 'DESC' },
        take: safeLimit,
      }),
      this.walletRepository.find({
        order: { lastMovementAt: 'DESC', createdAt: 'DESC' },
        take: safeLimit,
      }),
      this.movementRepository
        .createQueryBuilder('movement')
        .select('movement."customerId"', 'customerId')
        .addSelect(
          "COUNT(*) FILTER (WHERE movement.\"movementType\" = 'REFERRAL_COMMISSION_EARNED')",
          'totalReferralMovements',
        )
        .addSelect(
          "COALESCE(SUM(CASE WHEN movement.\"movementType\" = 'REFERRAL_COMMISSION_EARNED' THEN COALESCE(movement.amount, 0) ELSE 0 END), 0)",
          'totalReferralAmount',
        )
        .addSelect(
          "COALESCE(SUM(CASE WHEN movement.\"movementType\" = 'CASHBACK_EARNED' THEN COALESCE(movement.amount, 0) ELSE 0 END), 0)",
          'totalCashbackAmount',
        )
        .addSelect(
          "COALESCE(MAX(CASE WHEN movement.\"movementType\" = 'REFERRAL_COMMISSION_EARNED' THEN COALESCE(NULLIF(movement.metadata ->> 'level', ''), '0')::int ELSE 0 END), 0)",
          'maxReferralLevel',
        )
        .addSelect('MAX(movement."createdAt")', 'lastMovementAt')
        .groupBy('movement."customerId"')
        .getRawMany<Record<string, string | number | Date | null>>(),
      ]);

    const totals: LoyaltySummaryTotals = {
      totalWallets: Number(walletTotalsRaw?.totalWallets ?? 0),
      walletsWithCashback: Number(walletTotalsRaw?.walletsWithCashback ?? 0),
      walletsWithWithdrawable: Number(walletTotalsRaw?.walletsWithWithdrawable ?? 0),
      totalCashbackBalance: Number(walletTotalsRaw?.totalCashbackBalance ?? 0),
      totalWithdrawableBalance: Number(walletTotalsRaw?.totalWithdrawableBalance ?? 0),
      totalEarnedCashback: Number(walletTotalsRaw?.totalEarnedCashback ?? 0),
      totalEarnedReferral: Number(walletTotalsRaw?.totalEarnedReferral ?? 0),
      totalMovements: Number(movementTotalsRaw?.totalMovements ?? 0),
    };

    const profileAggregates = new Map<string, LoyaltyProfileAggregate>(
      profileAggregatesRaw.map((row) => [
        String(row.customerId ?? ''),
        {
          customerId: String(row.customerId ?? ''),
          totalReferralMovements: Number(row.totalReferralMovements ?? 0),
          totalReferralAmount: Number(row.totalReferralAmount ?? 0),
          totalCashbackAmount: Number(row.totalCashbackAmount ?? 0),
          maxReferralLevel: Number(row.maxReferralLevel ?? 0),
          lastMovementAt: (row.lastMovementAt as Date | null | undefined) ?? null,
        },
      ]),
    );

    const profiles = latestWallets.map((wallet): LoyaltyProfileRow => {
      const aggregate = profileAggregates.get(wallet.customerId) ?? {
        customerId: wallet.customerId,
        totalReferralMovements: 0,
        totalReferralAmount: 0,
        totalCashbackAmount: 0,
        maxReferralLevel: 0,
        lastMovementAt: wallet.lastMovementAt ?? null,
      };

      const totalEarnedReferral = Number(wallet.totalEarnedReferral ?? 0);
      const totalEarnedCashback = Number(wallet.totalEarnedCashback ?? 0);
      const withdrawableBalance = Number(wallet.withdrawableBalance ?? 0);

      return {
        customerId: wallet.customerId,
        referralCode: this.buildReferralCode(wallet.customerId),
        loyaltyRank: this.resolveLoyaltyRank({
          totalEarnedReferral,
          totalEarnedCashback,
          totalReferralMovements: aggregate.totalReferralMovements,
          maxReferralLevel: aggregate.maxReferralLevel,
        }),
        withdrawalEligible: withdrawableBalance >= 0.25,
        totalReferralMovements: aggregate.totalReferralMovements,
        totalReferralAmount: aggregate.totalReferralAmount,
        totalCashbackAmount: aggregate.totalCashbackAmount,
        maxReferralLevel: aggregate.maxReferralLevel,
        withdrawableBalance,
        totalEarnedReferral,
        totalEarnedCashback,
        lastMovementAt: aggregate.lastMovementAt ?? wallet.lastMovementAt ?? null,
      };
    });

    return {
      ok: true,
      message: 'Resumen táctico de wallet, cashback y referrals obtenido con éxito.',
      data: {
        totals,
        profiles,
        latest: latestMovements.map((movement) => ({
          id: movement.id,
          walletId: movement.walletId,
          customerId: movement.customerId,
          paymentId: movement.paymentId,
          orderId: movement.orderId,
          movementType: movement.movementType,
          balanceBucket: movement.balanceBucket,
          status: movement.status,
          amount: Number(movement.amount ?? 0),
          description: movement.description,
          createdAt: movement.createdAt,
        })),
      },
      count: latestMovements.length,
    };
  }

  async getWallet(customerId: string, limit = 10): Promise<Record<string, unknown>> {
    const wallet = await this.walletRepository.findOne({ where: { customerId } });
    const movements = await this.movementRepository.find({
      where: { customerId },
      order: { createdAt: 'DESC' },
      take: Number.isFinite(limit) && limit > 0 ? limit : 10,
    });

    return {
      ok: true,
      message: 'Wallet del customer obtenido con éxito.',
      data: {
        wallet: wallet
          ? {
              id: wallet.id,
              customerId: wallet.customerId,
              cashbackBalance: Number(wallet.cashbackBalance ?? 0),
              withdrawableBalance: Number(wallet.withdrawableBalance ?? 0),
              totalEarnedCashback: Number(wallet.totalEarnedCashback ?? 0),
              totalEarnedReferral: Number(wallet.totalEarnedReferral ?? 0),
              lastMovementAt: wallet.lastMovementAt,
            }
          : null,
        latest: movements.map((movement) => ({
          id: movement.id,
          paymentId: movement.paymentId,
          orderId: movement.orderId,
          movementType: movement.movementType,
          balanceBucket: movement.balanceBucket,
          status: movement.status,
          amount: Number(movement.amount ?? 0),
          description: movement.description,
          createdAt: movement.createdAt,
        })),
      },
      count: movements.length,
    };
  }

  async listWallets(limit = 10): Promise<Record<string, unknown>> {
    const safeLimit = Number.isFinite(limit) && limit > 0 ? Math.min(limit, 20) : 10;
    const wallets = await this.walletRepository.find({
      order: { lastMovementAt: 'DESC', createdAt: 'DESC' },
      take: safeLimit,
    });

    return {
      ok: true,
      message: 'Wallets loyalty obtenidos con éxito.',
      data: {
        latest: wallets.map((wallet): LoyaltyWalletRow => ({
          id: wallet.id,
          customerId: wallet.customerId,
          cashbackBalance: Number(wallet.cashbackBalance ?? 0),
          withdrawableBalance: Number(wallet.withdrawableBalance ?? 0),
          totalEarnedCashback: Number(wallet.totalEarnedCashback ?? 0),
          totalEarnedReferral: Number(wallet.totalEarnedReferral ?? 0),
          lastMovementAt: wallet.lastMovementAt ?? null,
        })),
      },
      count: wallets.length,
    };
  }

  async getReferralSummary(limit = 8): Promise<Record<string, unknown>> {
    const safeLimit = Number.isFinite(limit) && limit > 0 ? Math.min(limit, 20) : 8;
    const [totalsRaw, levelsRaw, latestReferralMovements] = await Promise.all([
      this.movementRepository
        .createQueryBuilder('movement')
        .select('COUNT(*)', 'totalReferralMovements')
        .addSelect('COALESCE(SUM(COALESCE(movement.amount, 0)), 0)', 'totalReferralAmount')
        .addSelect('COUNT(DISTINCT movement."customerId")', 'distinctBeneficiaries')
        .addSelect('MAX(movement."createdAt")', 'latestReferralAt')
        .where('movement.movementType = :movementType', { movementType: 'REFERRAL_COMMISSION_EARNED' })
        .getRawOne<Record<string, string | number | null> | undefined>(),
      this.movementRepository
        .createQueryBuilder('movement')
        .select("COALESCE(NULLIF(movement.metadata ->> 'level', ''), '1')", 'level')
        .addSelect('COUNT(*)', 'totalMovements')
        .addSelect('COALESCE(SUM(COALESCE(movement.amount, 0)), 0)', 'totalAmount')
        .addSelect('COUNT(DISTINCT movement."customerId")', 'distinctBeneficiaries')
        .where('movement.movementType = :movementType', { movementType: 'REFERRAL_COMMISSION_EARNED' })
        .groupBy("COALESCE(NULLIF(movement.metadata ->> 'level', ''), '1')")
        .orderBy('level', 'ASC')
        .getRawMany<Record<string, string | number>>(),
      this.movementRepository.find({
        where: { movementType: 'REFERRAL_COMMISSION_EARNED' },
        order: { createdAt: 'DESC' },
        take: safeLimit,
      }),
    ]);

    const byLevel: ReferralLevelRow[] = levelsRaw.map((row) => ({
      level: Number(row.level ?? 1),
      totalMovements: Number(row.totalMovements ?? 0),
      totalAmount: Number(row.totalAmount ?? 0),
      distinctBeneficiaries: Number(row.distinctBeneficiaries ?? 0),
    }));

    return {
      ok: true,
      message: 'Resumen táctico de referral network obtenido con éxito.',
      data: {
        totals: {
          totalReferralMovements: Number(totalsRaw?.totalReferralMovements ?? 0),
          totalReferralAmount: Number(totalsRaw?.totalReferralAmount ?? 0),
          distinctBeneficiaries: Number(totalsRaw?.distinctBeneficiaries ?? 0),
          levelsTracked: byLevel.length,
          latestReferralAt: totalsRaw?.latestReferralAt ?? null,
        },
        byLevel,
        latest: latestReferralMovements.map((movement) => ({
          id: movement.id,
          customerId: movement.customerId,
          paymentId: movement.paymentId,
          orderId: movement.orderId,
          amount: Number(movement.amount ?? 0),
          level: Number((movement.metadata?.level as number | string | undefined) ?? 1),
          referenceCode: (movement.metadata?.referenceCode as string | null | undefined) ?? null,
          description: movement.description,
          createdAt: movement.createdAt,
        })),
      },
      count: latestReferralMovements.length,
    };
  }

  async getMultilevelEligibilitySummary(limit = 8): Promise<Record<string, unknown>> {
    const safeLimit = Number.isFinite(limit) && limit > 0 ? Math.min(limit, 20) : 8;
    const candidatePayments = await this.paymentRepository
      .createQueryBuilder('payment')
      .where('COALESCE(payment."referralAmount", 0) > 0')
      .orderBy('payment."createdAt"', 'DESC')
      .getMany();

    const latestCandidates = candidatePayments.slice(0, safeLimit);
    const rows = await this.buildMultilevelEligibilityRows(latestCandidates);
    const allRows = latestCandidates.length === candidatePayments.length
      ? rows
      : await this.buildMultilevelEligibilityRows(candidatePayments);

    const totals = allRows.reduce<MultilevelEligibilityTotals>(
      (aggregate, row) => {
        aggregate.candidatePayments += 1;
        if (row.eligible) {
          aggregate.eligiblePayments += 1;
        } else {
          aggregate.blockedPayments += 1;
        }
        if (row.blockers.includes('missing_customer_eligibility')) {
          aggregate.missingCustomerEligibility += 1;
        }
        if (row.blockers.includes('customer_requires_revalidation')) {
          aggregate.customerRequiresRevalidation += 1;
        }
        if (row.blockers.includes('customer_eligibility_expired')) {
          aggregate.customerExpiredEligibility += 1;
        }
        if (row.blockers.includes('missing_merchant_eligibility')) {
          aggregate.missingMerchantEligibility += 1;
        }
        if (row.blockers.includes('merchant_eligibility_inactive')) {
          aggregate.merchantInactiveEligibility += 1;
        }
        return aggregate;
      },
      {
        candidatePayments: 0,
        eligiblePayments: 0,
        blockedPayments: 0,
        missingCustomerEligibility: 0,
        customerRequiresRevalidation: 0,
        customerExpiredEligibility: 0,
        missingMerchantEligibility: 0,
        merchantInactiveEligibility: 0,
      },
    );

    return {
      ok: true,
      message: 'Resumen táctico de elegibilidad multinivel obtenido con éxito.',
      data: {
        totals,
        latest: rows,
      },
      count: rows.length,
    };
  }

  async getPayoutSummary(limit = 8): Promise<Record<string, unknown>> {
    const safeLimit = Number.isFinite(limit) && limit > 0 ? Math.min(limit, 20) : 8;
    const [totalsRaw, latestRequests] = await Promise.all([
      this.payoutRequestRepository
        .createQueryBuilder('request')
        .select('COUNT(*)', 'totalRequests')
        .addSelect("COUNT(*) FILTER (WHERE request.status = 'REQUESTED')", 'pendingRequests')
        .addSelect("COUNT(*) FILTER (WHERE request.status = 'APPROVED')", 'approvedRequests')
        .addSelect("COUNT(*) FILTER (WHERE request.status = 'SETTLED')", 'processedRequests')
        .addSelect("COUNT(*) FILTER (WHERE request.status = 'REJECTED')", 'rejectedRequests')
        .addSelect('COALESCE(SUM(COALESCE(request.amount, 0)), 0)', 'totalRequestedAmount')
        .addSelect('COUNT(DISTINCT request."merchantId")', 'merchantsInvolved')
        .addSelect('COUNT(DISTINCT request."customerId")', 'customersInvolved')
        .addSelect('MAX(COALESCE(request."requestedAt", request."createdAt"))', 'latestRequestedAt')
        .getRawOne<Record<string, string | number | null> | undefined>(),
      this.payoutRequestRepository.find({
        order: { createdAt: 'DESC' },
        take: safeLimit,
      }),
    ]);

    const totals: PayoutSummaryTotals = {
      totalRequests: Number(totalsRaw?.totalRequests ?? 0),
      pendingRequests: Number(totalsRaw?.pendingRequests ?? 0),
      approvedRequests: Number(totalsRaw?.approvedRequests ?? 0),
      processedRequests: Number(totalsRaw?.processedRequests ?? 0),
      rejectedRequests: Number(totalsRaw?.rejectedRequests ?? 0),
      totalRequestedAmount: Number(totalsRaw?.totalRequestedAmount ?? 0),
      merchantsInvolved: Number(totalsRaw?.merchantsInvolved ?? 0),
      customersInvolved: Number(totalsRaw?.customersInvolved ?? 0),
      latestRequestedAt: (totalsRaw?.latestRequestedAt as Date | null | undefined) ?? null,
    };

    return {
      ok: true,
      message: 'Resumen táctico de payout requests obtenido con éxito.',
      data: {
        totals,
        latest: latestRequests.map((request): PayoutRequestRow => this.mapPayoutRequest(request)),
      },
      count: latestRequests.length,
    };
  }

  async listPayoutRequests(limit = 10): Promise<Record<string, unknown>> {
    const safeLimit = Number.isFinite(limit) && limit > 0 ? Math.min(limit, 30) : 10;
    const requests = await this.payoutRequestRepository.find({
      order: { createdAt: 'DESC' },
      take: safeLimit,
    });

    return {
      ok: true,
      message: 'Payout requests obtenidos con éxito.',
      data: {
        latest: requests.map((request): PayoutRequestRow => this.mapPayoutRequest(request)),
      },
      count: requests.length,
    };
  }

  @LogExecutionTime({ layer: 'application', client: undefined })
  async createPayoutRequest(payload: CreatePayoutRequestPayload): Promise<Record<string, unknown>> {
    const customerId = String(payload.customerId || '').trim();
    const merchantId = String(payload.merchantId || '').trim();
    const amount = Number(payload.amount ?? 0);
    const currencyCode = String(payload.currencyCode || 'USD').trim().toUpperCase();
    const preferredCollectionMethod = String(payload.preferredCollectionMethod || '').trim() || null;
    const notes = String(payload.notes || '').trim() || null;

    if (!customerId) {
      throw new BadRequestException('customerId es obligatorio para crear un payout request');
    }
    if (!merchantId) {
      throw new BadRequestException('merchantId es obligatorio para crear un payout request');
    }
    if (!Number.isFinite(amount) || amount <= 0) {
      throw new BadRequestException('amount debe ser un número positivo');
    }

    const eligibility = await this.merchantEligibilityRepository.findOne({
      where: { merchantId, isActive: true, status: 'ACTIVE' },
      order: { creationDate: 'DESC' },
    });
    if (!eligibility) {
      throw new BadRequestException('El merchant no tiene una elegibilidad activa en payment para procesar payouts');
    }

    const result = await this.walletRepository.manager.transaction(async (manager) => {
      const walletRepository = manager.getRepository(PaymentCustomerWallet);
      const movementRepository = manager.getRepository(PaymentWalletMovement);
      const payoutRequestRepository = manager.getRepository(PaymentPayoutRequest);

      const wallet = await this.getOrCreateWalletWithRepository(walletRepository, customerId);
      const currentWithdrawable = Number(wallet.withdrawableBalance ?? 0);
      if (currentWithdrawable < amount) {
        throw new BadRequestException(
          `Saldo withdrawable insuficiente. Disponible ${currentWithdrawable.toFixed(2)}, solicitado ${amount.toFixed(2)}`,
        );
      }

      wallet.withdrawableBalance = currentWithdrawable - amount;
      wallet.lastMovementAt = new Date();
      await walletRepository.save(wallet);

      const requestReference = `payout:${merchantId}:${customerId}:${randomUUID()}`;
      const payoutRequest = await payoutRequestRepository.save(
        payoutRequestRepository.create({
          walletId: wallet.id,
          customerId,
          merchantId,
          merchantGatewayEligibilityId: eligibility.id,
          paymentId: payload.paymentId || null,
          orderId: payload.orderId || null,
          requestReference,
          status: 'REQUESTED',
          amount,
          currencyCode,
          preferredCollectionMethod,
          settlementMode: eligibility.settlementMode || 'AUTOMATIC',
          notes,
          merchantDebtAppliedAmount: 0,
          merchantNetAmount: amount,
          settlementReference: null,
          requestedAt: new Date(),
          metadata: {
            gatewayId: eligibility.gatewayId,
            eligibilityStatus: eligibility.status,
            settlementMode: eligibility.settlementMode || 'AUTOMATIC',
            acceptedPaymentMethodTypes: eligibility.acceptedPaymentMethodTypes || {},
            source: 'payment-loyalty',
          },
        }),
      );

      const movement = await movementRepository.save(
        movementRepository.create({
          walletId: wallet.id,
          customerId,
          paymentId: payload.paymentId || null,
          orderId: payload.orderId || null,
          movementKey: `payout-request:${payoutRequest.id}`,
          movementType: 'PAYOUT_REQUESTED',
          balanceBucket: 'WITHDRAWABLE',
          status: 'RESERVED',
          amount: -amount,
          description: `Payout request ${requestReference} reservado para merchant ${merchantId}`,
          metadata: {
            payoutRequestId: payoutRequest.id,
            payoutRequestReference: requestReference,
            merchantId,
            settlementMode: payoutRequest.settlementMode,
            preferredCollectionMethod,
            source: 'payment-loyalty',
          },
        }),
      );

      return {
        wallet,
        payoutRequest,
        movement,
      };
    });

    return {
      ok: true,
      message: 'Payout request creado con éxito y saldo withdrawable reservado.',
      data: {
        wallet: {
          id: result.wallet.id,
          customerId: result.wallet.customerId,
          cashbackBalance: Number(result.wallet.cashbackBalance ?? 0),
          withdrawableBalance: Number(result.wallet.withdrawableBalance ?? 0),
          totalEarnedCashback: Number(result.wallet.totalEarnedCashback ?? 0),
          totalEarnedReferral: Number(result.wallet.totalEarnedReferral ?? 0),
          lastMovementAt: result.wallet.lastMovementAt,
        },
        payoutRequest: this.mapPayoutRequest(result.payoutRequest),
        movement: {
          id: result.movement.id,
          walletId: result.movement.walletId,
          customerId: result.movement.customerId,
          paymentId: result.movement.paymentId,
          orderId: result.movement.orderId,
          movementType: result.movement.movementType,
          balanceBucket: result.movement.balanceBucket,
          status: result.movement.status,
          amount: Number(result.movement.amount ?? 0),
          description: result.movement.description,
          createdAt: result.movement.createdAt,
        },
      },
    };
  }

  @LogExecutionTime({ layer: 'application', client: undefined })
  async approvePayoutRequest(payoutRequestId: string, payload: ApprovePayoutRequestPayload): Promise<Record<string, unknown>> {
    const payoutRequest = await this.payoutRequestRepository.findOne({ where: { id: payoutRequestId } });
    if (!payoutRequest) {
      throw new NotFoundException(`No existe payoutRequest ${payoutRequestId}`);
    }
    if (payoutRequest.status !== 'REQUESTED') {
      throw new BadRequestException(`Sólo se pueden aprobar payout requests en estado REQUESTED. Estado actual: ${payoutRequest.status}`);
    }

    const merchantDebtAppliedAmount = this.normalizeDebt(payload.merchantDebtAmount, payoutRequest.amount);
    payoutRequest.status = 'APPROVED';
    payoutRequest.merchantDebtAppliedAmount = merchantDebtAppliedAmount;
    payoutRequest.merchantNetAmount = Math.max(Number(payoutRequest.amount ?? 0) - merchantDebtAppliedAmount, 0);
    payoutRequest.notes = payload.note?.trim() || payoutRequest.notes || null;
    payoutRequest.metadata = {
      ...(payoutRequest.metadata || {}),
      invoiceId: payload.invoiceId || (payoutRequest.metadata?.invoiceId as string | undefined) || null,
      commercialApprovalAt: new Date().toISOString(),
      merchantDebtAppliedAmount,
      merchantNetAmount: payoutRequest.merchantNetAmount,
    };
    await this.payoutRequestRepository.save(payoutRequest);

    return {
      ok: true,
      message: 'Payout request aprobado con éxito.',
      data: {
        payoutRequest: this.mapPayoutRequest(payoutRequest),
      },
    };
  }

  @LogExecutionTime({ layer: 'application', client: undefined })
  async rejectPayoutRequest(payoutRequestId: string, payload: RejectPayoutRequestPayload): Promise<Record<string, unknown>> {
    const payoutRequest = await this.payoutRequestRepository.findOne({ where: { id: payoutRequestId } });
    if (!payoutRequest) {
      throw new NotFoundException(`No existe payoutRequest ${payoutRequestId}`);
    }
    if (!['REQUESTED', 'APPROVED'].includes(payoutRequest.status)) {
      throw new BadRequestException(`Sólo se pueden rechazar payout requests en estado REQUESTED o APPROVED. Estado actual: ${payoutRequest.status}`);
    }

    const result = await this.walletRepository.manager.transaction(async (manager) => {
      const walletRepository = manager.getRepository(PaymentCustomerWallet);
      const movementRepository = manager.getRepository(PaymentWalletMovement);
      const payoutRequestRepository = manager.getRepository(PaymentPayoutRequest);

      const wallet = await walletRepository.findOne({ where: { id: payoutRequest.walletId } });
      if (!wallet) {
        throw new NotFoundException(`No existe wallet ${payoutRequest.walletId}`);
      }

      wallet.withdrawableBalance = Number(wallet.withdrawableBalance ?? 0) + Number(payoutRequest.amount ?? 0);
      wallet.lastMovementAt = new Date();
      await walletRepository.save(wallet);

      payoutRequest.status = 'REJECTED';
      payoutRequest.processedAt = new Date();
      payoutRequest.notes = payload.reason?.trim() || payoutRequest.notes || null;
      payoutRequest.metadata = {
        ...(payoutRequest.metadata || {}),
        rejectionReason: payload.reason?.trim() || null,
        rejectedAt: payoutRequest.processedAt.toISOString(),
        reversedToWallet: true,
      };
      await payoutRequestRepository.save(payoutRequest);

      const reversalMovement = await movementRepository.save(
        movementRepository.create({
          walletId: wallet.id,
          customerId: wallet.customerId,
          paymentId: payoutRequest.paymentId ?? null,
          orderId: payoutRequest.orderId ?? null,
          movementKey: `payout-reversal:${payoutRequest.id}`,
          movementType: 'PAYOUT_REVERSED',
          balanceBucket: 'WITHDRAWABLE',
          status: 'APPLIED',
          amount: Number(payoutRequest.amount ?? 0),
          description: `Payout request ${payoutRequest.requestReference} revertido al wallet`,
          metadata: {
            payoutRequestId: payoutRequest.id,
            payoutRequestReference: payoutRequest.requestReference,
            merchantId: payoutRequest.merchantId,
            rejectionReason: payload.reason?.trim() || null,
            source: 'payment-loyalty',
          },
        }),
      );

      return { wallet, reversalMovement };
    });

    return {
      ok: true,
      message: 'Payout request rechazado y saldo withdrawable devuelto con éxito.',
      data: {
        payoutRequest: this.mapPayoutRequest(payoutRequest),
        wallet: {
          id: result.wallet.id,
          customerId: result.wallet.customerId,
          withdrawableBalance: Number(result.wallet.withdrawableBalance ?? 0),
          lastMovementAt: result.wallet.lastMovementAt,
        },
        movement: {
          id: result.reversalMovement.id,
          movementType: result.reversalMovement.movementType,
          status: result.reversalMovement.status,
          amount: Number(result.reversalMovement.amount ?? 0),
        },
      },
    };
  }

  @LogExecutionTime({ layer: 'application', client: undefined })
  async settlePayoutRequest(payoutRequestId: string, payload: SettlePayoutRequestPayload): Promise<Record<string, unknown>> {
    const payoutRequest = await this.payoutRequestRepository.findOne({ where: { id: payoutRequestId } });
    if (!payoutRequest) {
      throw new NotFoundException(`No existe payoutRequest ${payoutRequestId}`);
    }
    if (!['REQUESTED', 'APPROVED'].includes(payoutRequest.status)) {
      throw new BadRequestException(`Sólo se pueden liquidar payout requests en estado REQUESTED o APPROVED. Estado actual: ${payoutRequest.status}`);
    }

    const merchantDebtAppliedAmount = this.normalizeDebt(
      payload.merchantDebtAmount ?? payoutRequest.merchantDebtAppliedAmount,
      payoutRequest.amount,
    );
    const merchantNetAmount = Math.max(Number(payoutRequest.amount ?? 0) - merchantDebtAppliedAmount, 0);
    const settlementReference = String(payload.settlementReference || payoutRequest.settlementReference || randomUUID()).trim();

    const result = await this.walletRepository.manager.transaction(async (manager) => {
      const movementRepository = manager.getRepository(PaymentWalletMovement);
      const payoutRequestRepository = manager.getRepository(PaymentPayoutRequest);

      payoutRequest.status = 'SETTLED';
      payoutRequest.processedAt = new Date();
      payoutRequest.merchantDebtAppliedAmount = merchantDebtAppliedAmount;
      payoutRequest.merchantNetAmount = merchantNetAmount;
      payoutRequest.settlementReference = settlementReference;
      payoutRequest.notes = payload.note?.trim() || payoutRequest.notes || null;
      payoutRequest.metadata = {
        ...(payoutRequest.metadata || {}),
        invoiceId: payload.invoiceId || (payoutRequest.metadata?.invoiceId as string | undefined) || null,
        settlementReference,
        settledAt: payoutRequest.processedAt.toISOString(),
        merchantDebtAppliedAmount,
        merchantNetAmount,
      };
      await payoutRequestRepository.save(payoutRequest);

      const settlementMovement = await movementRepository.save(
        movementRepository.create({
          walletId: payoutRequest.walletId,
          customerId: payoutRequest.customerId,
          paymentId: payoutRequest.paymentId ?? null,
          orderId: payoutRequest.orderId ?? null,
          movementKey: `payout-settlement:${payoutRequest.id}`,
          movementType: 'PAYOUT_SETTLED',
          balanceBucket: 'WITHDRAWABLE',
          status: 'SETTLED',
          amount: 0,
          description: `Payout request ${payoutRequest.requestReference} liquidado para merchant ${payoutRequest.merchantId}`,
          metadata: {
            payoutRequestId: payoutRequest.id,
            payoutRequestReference: payoutRequest.requestReference,
            merchantId: payoutRequest.merchantId,
            settlementReference,
            merchantDebtAppliedAmount,
            merchantNetAmount,
            invoiceId: payload.invoiceId || null,
            source: 'payment-loyalty',
          },
        }),
      );

      return { settlementMovement };
    });

    return {
      ok: true,
      message: 'Payout request liquidado con éxito.',
      data: {
        payoutRequest: this.mapPayoutRequest(payoutRequest),
        movement: {
          id: result.settlementMovement.id,
          movementType: result.settlementMovement.movementType,
          status: result.settlementMovement.status,
          amount: Number(result.settlementMovement.amount ?? 0),
        },
      },
    };
  }

  async settleCashback(paymentId: string): Promise<Record<string, unknown>> {
    const payment = await this.paymentRepository.findOne({ where: { id: paymentId } });
    if (!payment) {
      throw new NotFoundException(`No existe payment ${paymentId}`);
    }

    const amount = Number(payment.cashbackAmount ?? 0);
    if (amount <= 0) {
      throw new BadRequestException('El payment no tiene cashbackAmount pendiente de acreditar');
    }

    const wallet = await this.getOrCreateWallet(payment.customerId);
    const movementKey = `cashback:${payment.id}`;
    const existingMovement = await this.movementRepository.findOne({ where: { movementKey } });
    if (existingMovement) {
      return {
        ok: true,
        message: 'Cashback ya acreditado previamente.',
        data: {
          wallet,
          movement: existingMovement,
          applied: false,
        },
      };
    }

    wallet.cashbackBalance = Number(wallet.cashbackBalance ?? 0) + amount;
    wallet.totalEarnedCashback = Number(wallet.totalEarnedCashback ?? 0) + amount;
    wallet.lastMovementAt = new Date();
    await this.walletRepository.save(wallet);

    const movement = await this.movementRepository.save(
      this.movementRepository.create({
        walletId: wallet.id,
        customerId: wallet.customerId,
        paymentId: payment.id,
        orderId: payment.orderId ?? null,
        movementKey,
        movementType: 'CASHBACK_EARNED',
        balanceBucket: 'CASHBACK',
        status: 'APPLIED',
        amount,
        description: `Cashback acreditado desde payment ${payment.code}`,
        metadata: {
          accountingStatusBefore: payment.accountingStatus,
          source: 'payment-loyalty',
        },
      }),
    );

    payment.accountingStatus = this.mergeAccountingStatus(payment.accountingStatus, 'CASHBACK_SETTLED');
    await this.paymentRepository.save(payment);

    return {
      ok: true,
      message: 'Cashback acreditado en wallet con éxito.',
      data: {
        wallet,
        movement,
        applied: true,
      },
    };
  }

  async settleReferral(paymentId: string, payload: LoyaltySettlementPayload): Promise<Record<string, unknown>> {
    const payment = await this.paymentRepository.findOne({ where: { id: paymentId } });
    if (!payment) {
      throw new NotFoundException(`No existe payment ${paymentId}`);
    }

    const amount = Number(payment.referralAmount ?? 0);
    if (amount <= 0) {
      throw new BadRequestException('El payment no tiene referralAmount pendiente de distribuir');
    }

    const beneficiaryCustomerId = String(
      payload.beneficiaryCustomerId || (payment.metadata?.referralBeneficiaryCustomerId as string) || '',
    ).trim();
    if (!beneficiaryCustomerId) {
      throw new BadRequestException('beneficiaryCustomerId es obligatorio para distribuir referralAmount');
    }

    const level = Number(payload.level ?? 1);
    const wallet = await this.getOrCreateWallet(beneficiaryCustomerId);
    const movementKey = `referral:${payment.id}:${beneficiaryCustomerId}:${level}`;
    const existingMovement = await this.movementRepository.findOne({ where: { movementKey } });
    if (existingMovement) {
      return {
        ok: true,
        message: 'Referral ya distribuido previamente.',
        data: {
          wallet,
          movement: existingMovement,
          applied: false,
        },
      };
    }

    wallet.withdrawableBalance = Number(wallet.withdrawableBalance ?? 0) + amount;
    wallet.totalEarnedReferral = Number(wallet.totalEarnedReferral ?? 0) + amount;
    wallet.lastMovementAt = new Date();
    await this.walletRepository.save(wallet);

    const movement = await this.movementRepository.save(
      this.movementRepository.create({
        walletId: wallet.id,
        customerId: wallet.customerId,
        paymentId: payment.id,
        orderId: payment.orderId ?? null,
        movementKey,
        movementType: 'REFERRAL_COMMISSION_EARNED',
        balanceBucket: 'WITHDRAWABLE',
        status: 'APPLIED',
        amount,
        description: `Referral acreditado desde payment ${payment.code}`,
        metadata: {
          level,
          referenceCode: payload.referenceCode || null,
          accountingStatusBefore: payment.accountingStatus,
          source: 'payment-loyalty',
        },
      }),
    );

    payment.accountingStatus = this.mergeAccountingStatus(payment.accountingStatus, 'REFERRAL_SETTLED');
    await this.paymentRepository.save(payment);

    return {
      ok: true,
      message: 'Referral distribuido a wallet withdrawable con éxito.',
      data: {
        wallet,
        movement,
        applied: true,
      },
    };
  }

  async settleReferralMultilevel(
    paymentId: string,
    payload: MultilevelReferralSettlementPayload,
  ): Promise<Record<string, unknown>> {
    const payment = await this.paymentRepository.findOne({ where: { id: paymentId } });
    if (!payment) {
      throw new NotFoundException(`No existe payment ${paymentId}`);
    }

    const totalReferralAmount = Number(payment.referralAmount ?? 0);
    if (totalReferralAmount <= 0) {
      throw new BadRequestException('El payment no tiene referralAmount pendiente de distribuir');
    }

    const existingMovements = await this.movementRepository.find({
      where: { paymentId, movementType: 'REFERRAL_COMMISSION_EARNED' },
      order: { createdAt: 'ASC' },
    });
    if (existingMovements.length > 0) {
      return {
        ok: true,
        message: 'Referral multinivel ya distribuido previamente.',
        data: {
          paymentId,
          movements: existingMovements.map((movement) => ({
            id: movement.id,
            customerId: movement.customerId,
            amount: Number(movement.amount ?? 0),
            level: Number((movement.metadata?.level as number | string | undefined) ?? 0),
            referenceCode: (movement.metadata?.referenceCode as string | null | undefined) ?? null,
            status: movement.status,
          })),
          applied: false,
        },
      };
    }

    const allocations = this.normalizeReferralAllocations(totalReferralAmount, payload || {});
    const [eligibility] = await this.buildMultilevelEligibilityRows([payment]);
    if (!eligibility?.eligible) {
      throw new BadRequestException(
        `El payment no es elegible para liquidación multinivel: ${(eligibility?.blockers || []).join(', ')}`,
      );
    }

    const transactionResult = await this.walletRepository.manager.transaction(async (manager) => {
      const walletRepository = manager.getRepository(PaymentCustomerWallet);
      const movementRepository = manager.getRepository(PaymentWalletMovement);
      const walletSnapshots: LoyaltyWalletRow[] = [];
      const movements: PaymentWalletMovement[] = [];

      for (const allocation of allocations) {
        const wallet = await this.getOrCreateWalletWithRepository(walletRepository, allocation.beneficiaryCustomerId);
        wallet.withdrawableBalance = Number(wallet.withdrawableBalance ?? 0) + allocation.amount;
        wallet.totalEarnedReferral = Number(wallet.totalEarnedReferral ?? 0) + allocation.amount;
        wallet.lastMovementAt = new Date();
        await walletRepository.save(wallet);

        const movement = await movementRepository.save(
          movementRepository.create({
            walletId: wallet.id,
            customerId: wallet.customerId,
            paymentId: payment.id,
            orderId: payment.orderId ?? null,
            movementKey: `referral:${payment.id}:${allocation.beneficiaryCustomerId}:${allocation.level}`,
            movementType: 'REFERRAL_COMMISSION_EARNED',
            balanceBucket: 'WITHDRAWABLE',
            status: 'APPLIED',
            amount: allocation.amount,
            description: `Referral multinivel acreditado desde payment ${payment.code}`,
            metadata: {
              level: allocation.level,
              referenceCode: allocation.referenceCode,
              accountingStatusBefore: payment.accountingStatus,
              source: 'payment-loyalty',
              distributionMode: 'MULTILEVEL',
            },
          }),
        );

        walletSnapshots.push({
          id: wallet.id,
          customerId: wallet.customerId,
          cashbackBalance: Number(wallet.cashbackBalance ?? 0),
          withdrawableBalance: Number(wallet.withdrawableBalance ?? 0),
          totalEarnedCashback: Number(wallet.totalEarnedCashback ?? 0),
          totalEarnedReferral: Number(wallet.totalEarnedReferral ?? 0),
          lastMovementAt: wallet.lastMovementAt ?? null,
        });
        movements.push(movement);
      }

      payment.accountingStatus = this.mergeAccountingStatus(payment.accountingStatus, 'REFERRAL_SETTLED');
      await manager.getRepository(Payment).save(payment);

      return { walletSnapshots, movements };
    });

    return {
      ok: true,
      message: 'Referral multinivel distribuido a wallets withdrawable con éxito.',
      data: {
        paymentId,
        totalDistributedAmount: allocations.reduce((sum, allocation) => sum + allocation.amount, 0),
        eligibility,
        wallets: transactionResult.walletSnapshots,
        movements: transactionResult.movements.map((movement) => ({
          id: movement.id,
          customerId: movement.customerId,
          amount: Number(movement.amount ?? 0),
          level: Number((movement.metadata?.level as number | string | undefined) ?? 0),
          referenceCode: (movement.metadata?.referenceCode as string | null | undefined) ?? null,
          status: movement.status,
          createdAt: movement.createdAt,
        })),
        applied: true,
      },
    };
  }

  private async getOrCreateWallet(customerId: string): Promise<PaymentCustomerWallet> {
    return this.getOrCreateWalletWithRepository(this.walletRepository, customerId);
  }

  private mergeAccountingStatus(currentStatus: string | null | undefined, newFragment: string): string {
    const normalized = String(currentStatus || '').trim();
    if (!normalized || normalized === 'PENDING_ALLOCATION') {
      return newFragment;
    }
    if (normalized.includes(newFragment)) {
      return normalized;
    }
    return `${normalized}+${newFragment}`;
  }

  private normalizeReferralAllocations(
    totalReferralAmount: number,
    payload: MultilevelReferralSettlementPayload,
  ): NormalizedReferralAllocation[] {
    const rawBeneficiaries = Array.isArray(payload.beneficiaries) ? payload.beneficiaries : [];
    if (rawBeneficiaries.length === 0) {
      throw new BadRequestException('beneficiaries debe contener al menos un destinatario para distribución multinivel');
    }

    const allocations = rawBeneficiaries.map((beneficiary, index): NormalizedReferralAllocation => {
      const beneficiaryCustomerId = String(beneficiary.beneficiaryCustomerId || '').trim();
      const level = Number(beneficiary.level ?? index + 1);
      if (!beneficiaryCustomerId) {
        throw new BadRequestException(`beneficiaryCustomerId es obligatorio en beneficiaries[${index}]`);
      }
      if (!Number.isFinite(level) || level < 1) {
        throw new BadRequestException(`level debe ser un entero mayor o igual que 1 en beneficiaries[${index}]`);
      }

      const explicitAmount = beneficiary.amount === undefined ? Number.NaN : Number(beneficiary.amount);
      const sharePercent = beneficiary.sharePercent === undefined ? Number.NaN : Number(beneficiary.sharePercent);
      let amount = 0;

      if (Number.isFinite(explicitAmount)) {
        amount = explicitAmount;
      } else if (Number.isFinite(sharePercent)) {
        amount = (totalReferralAmount * sharePercent) / 100;
      }

      if (!Number.isFinite(amount) || amount < 0) {
        throw new BadRequestException(`amount/sharePercent inválido en beneficiaries[${index}]`);
      }

      return {
        beneficiaryCustomerId,
        level,
        referenceCode: String(beneficiary.referenceCode || '').trim() || null,
        amount: Number(amount.toFixed(2)),
      };
    });

    const duplicateKey = this.findDuplicateAllocationKey(allocations);
    if (duplicateKey) {
      throw new BadRequestException(`La combinación beneficiaryCustomerId+level está duplicada: ${duplicateKey}`);
    }

    const totalAllocated = Number(allocations.reduce((sum, allocation) => sum + allocation.amount, 0).toFixed(2));
    if (totalAllocated > Number(totalReferralAmount.toFixed(2))) {
      throw new BadRequestException('La suma de la distribución multinivel excede referralAmount del payment');
    }

    const residual = Number((Number(totalReferralAmount.toFixed(2)) - totalAllocated).toFixed(2));
    if (residual > 0) {
      const platformResidualCustomerId = String(payload.platformResidualCustomerId || '').trim();
      if (!platformResidualCustomerId) {
        throw new BadRequestException('platformResidualCustomerId es obligatorio cuando la suma distribuida no cubre referralAmount');
      }

      allocations.push({
        beneficiaryCustomerId: platformResidualCustomerId,
        level: 0,
        referenceCode: String(payload.platformReferenceCode || 'PLATFORM_RESIDUAL').trim(),
        amount: residual,
      });
    }

    return allocations.filter((allocation) => allocation.amount > 0);
  }

  private findDuplicateAllocationKey(allocations: NormalizedReferralAllocation[]): string | null {
    const seen = new Set<string>();
    for (const allocation of allocations) {
      const key = `${allocation.beneficiaryCustomerId}:${allocation.level}`;
      if (seen.has(key)) {
        return key;
      }
      seen.add(key);
    }
    return null;
  }

  private async buildMultilevelEligibilityRows(payments: Payment[]): Promise<MultilevelEligibilityRow[]> {
    if (!payments.length) {
      return [];
    }

    const customerIds = Array.from(new Set(payments.map((payment) => payment.customerId).filter(Boolean)));
    const merchantIds = Array.from(new Set(payments.map((payment) => payment.merchantId).filter(Boolean)));
    const gatewayIds = Array.from(new Set(payments.map((payment) => payment.gatewayId).filter(Boolean)));

    const [customerEligibilities, merchantEligibilities] = await Promise.all([
      this.customerEligibilityRepository.find({
        where: {
          customerId: In(customerIds),
          gatewayId: In(gatewayIds),
        },
        order: { modificationDate: 'DESC', creationDate: 'DESC' },
      }),
      this.merchantEligibilityRepository.find({
        where: {
          merchantId: In(merchantIds),
          gatewayId: In(gatewayIds),
        },
        order: { modificationDate: 'DESC', creationDate: 'DESC' },
      }),
    ]);

    const customerEligibilityMap = new Map<string, PaymentCustomerGatewayEligibility>();
    for (const eligibility of customerEligibilities) {
      const key = this.buildEligibilityKey(eligibility.customerId, eligibility.gatewayId);
      if (!customerEligibilityMap.has(key)) {
        customerEligibilityMap.set(key, eligibility);
      }
    }

    const merchantEligibilityMap = new Map<string, PaymentMerchantGatewayEligibility>();
    for (const eligibility of merchantEligibilities) {
      const key = this.buildEligibilityKey(eligibility.merchantId, eligibility.gatewayId);
      if (!merchantEligibilityMap.has(key)) {
        merchantEligibilityMap.set(key, eligibility);
      }
    }

    return payments.map((payment) => {
      const customerEligibility = customerEligibilityMap.get(this.buildEligibilityKey(payment.customerId, payment.gatewayId)) ?? null;
      const merchantEligibility = merchantEligibilityMap.get(this.buildEligibilityKey(payment.merchantId, payment.gatewayId)) ?? null;
      const blockers: string[] = [];

      if (!customerEligibility) {
        blockers.push('missing_customer_eligibility');
      } else {
        if (!this.isCustomerEligibilityApproved(customerEligibility)) {
          blockers.push('customer_requires_revalidation');
        }
        if (this.isCustomerEligibilityExpired(customerEligibility)) {
          blockers.push('customer_eligibility_expired');
        }
      }

      if (!merchantEligibility) {
        blockers.push('missing_merchant_eligibility');
      } else if (!this.isMerchantEligibilityActive(merchantEligibility)) {
        blockers.push('merchant_eligibility_inactive');
      }

      return {
        paymentId: payment.id,
        paymentCode: payment.code,
        customerId: payment.customerId,
        merchantId: payment.merchantId,
        gatewayId: payment.gatewayId,
        currency: payment.currency,
        selectedPaymentMethodType: payment.selectedPaymentMethodType,
        referralAmount: Number(payment.referralAmount ?? 0),
        paymentStatus: payment.status,
        accountingStatus: payment.accountingStatus,
        customerEligibilityStatus: customerEligibility?.status ?? null,
        merchantEligibilityStatus: merchantEligibility?.status ?? null,
        eligible: blockers.length === 0,
        blockers,
        createdAt: payment.creationDate,
      };
    });
  }

  private buildEligibilityKey(ownerId: string, gatewayId: string): string {
    return `${String(ownerId || '').trim()}:${String(gatewayId || '').trim()}`;
  }

  private isCustomerEligibilityApproved(eligibility: PaymentCustomerGatewayEligibility): boolean {
    const status = String(eligibility.status || '').trim().toUpperCase();
    return eligibility.isActive === true && ['APPROVED', 'ACTIVE'].includes(status) && eligibility.requiresRevalidation !== true;
  }

  private isCustomerEligibilityExpired(eligibility: PaymentCustomerGatewayEligibility): boolean {
    return !!eligibility.expiresAt && eligibility.expiresAt.getTime() < Date.now();
  }

  private isMerchantEligibilityActive(eligibility: PaymentMerchantGatewayEligibility): boolean {
    const status = String(eligibility.status || '').trim().toUpperCase();
    return eligibility.isActive === true && status === 'ACTIVE';
  }

  private buildReferralCode(customerId: string): string {
    return `REF-${String(customerId || '').replace(/-/g, '').slice(0, 8).toUpperCase()}`;
  }

  private resolveLoyaltyRank(input: {
    totalEarnedReferral: number;
    totalEarnedCashback: number;
    totalReferralMovements: number;
    maxReferralLevel: number;
  }): string {
    if (input.maxReferralLevel >= 2 || input.totalEarnedReferral >= 2 || input.totalReferralMovements >= 3) {
      return 'AMBASSADOR';
    }
    if (input.totalEarnedReferral > 0 || input.totalEarnedCashback >= 3 || input.totalReferralMovements > 0) {
      return 'ADVOCATE';
    }
    return 'MEMBER';
  }

  private normalizeDebt(rawDebt: number | undefined, amount: number): number {
    const normalized = Number(rawDebt ?? 0);
    if (!Number.isFinite(normalized) || normalized < 0) {
      throw new BadRequestException('merchantDebtAmount debe ser un número mayor o igual que cero');
    }
    return Math.min(normalized, Number(amount ?? 0));
  }

  private async getOrCreateWalletWithRepository(
    walletRepository: Repository<PaymentCustomerWallet>,
    customerId: string,
  ): Promise<PaymentCustomerWallet> {
    const existingWallet = await walletRepository.findOne({ where: { customerId } });
    if (existingWallet) {
      return existingWallet;
    }

    return walletRepository.save(
      walletRepository.create({
        customerId,
        cashbackBalance: 0,
        withdrawableBalance: 0,
        totalEarnedCashback: 0,
        totalEarnedReferral: 0,
        lastMovementAt: null,
        metadata: { source: 'payment-loyalty' },
      }),
    );
  }

  private mapPayoutRequest(request: PaymentPayoutRequest): PayoutRequestRow {
    return {
      id: request.id,
      walletId: request.walletId,
      customerId: request.customerId,
      merchantId: request.merchantId,
      merchantGatewayEligibilityId: request.merchantGatewayEligibilityId ?? null,
      paymentId: request.paymentId ?? null,
      orderId: request.orderId ?? null,
      requestReference: request.requestReference,
      status: request.status,
      amount: Number(request.amount ?? 0),
      currencyCode: request.currencyCode,
      invoiceId: (request.metadata?.invoiceId as string | undefined) ?? null,
      preferredCollectionMethod: request.preferredCollectionMethod ?? null,
      settlementMode: request.settlementMode ?? null,
      notes: request.notes ?? null,
      merchantDebtAppliedAmount: Number(request.merchantDebtAppliedAmount ?? 0),
      merchantNetAmount: Number(request.merchantNetAmount ?? 0),
      settlementReference: request.settlementReference ?? null,
      requestedAt: request.requestedAt ?? null,
      processedAt: request.processedAt ?? null,
      createdAt: request.createdAt,
    };
  }
}
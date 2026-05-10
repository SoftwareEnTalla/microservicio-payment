import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Payment } from '../payment/entities/payment.entity';
import { PaymentCustomerWallet } from './payment-customer-wallet.entity';
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

interface LoyaltyWalletRow {
  id: string;
  customerId: string;
  cashbackBalance: number;
  withdrawableBalance: number;
  totalEarnedCashback: number;
  totalEarnedReferral: number;
  lastMovementAt: Date | null;
}

interface ReferralLevelRow {
  level: number;
  totalMovements: number;
  totalAmount: number;
  distinctBeneficiaries: number;
}

@Injectable()
export class PaymentLoyaltyService {
  constructor(
    @InjectRepository(Payment)
    private readonly paymentRepository: Repository<Payment>,
    @InjectRepository(PaymentCustomerWallet)
    private readonly walletRepository: Repository<PaymentCustomerWallet>,
    @InjectRepository(PaymentWalletMovement)
    private readonly movementRepository: Repository<PaymentWalletMovement>,
  ) {}

  async getSummary(limit = 8): Promise<Record<string, unknown>> {
    const [walletTotalsRaw, movementTotalsRaw, latestMovements] = await Promise.all([
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
        take: Number.isFinite(limit) && limit > 0 ? limit : 8,
      }),
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

    return {
      ok: true,
      message: 'Resumen táctico de wallet, cashback y referrals obtenido con éxito.',
      data: {
        totals,
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

  private async getOrCreateWallet(customerId: string): Promise<PaymentCustomerWallet> {
    const existingWallet = await this.walletRepository.findOne({ where: { customerId } });
    if (existingWallet) {
      return existingWallet;
    }

    return this.walletRepository.save(
      this.walletRepository.create({
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
}
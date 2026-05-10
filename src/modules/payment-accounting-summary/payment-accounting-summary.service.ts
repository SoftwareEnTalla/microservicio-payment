import { Injectable, Optional } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';

type PaymentAccountingRow = {
  id: string;
  code: string | null;
  status: string | null;
  accountingStatus: string | null;
  orderId: string | null;
  amount: number;
  platformAmount: number;
  cashbackAmount: number;
  referralAmount: number;
  stripeFee: number;
  refundAmount: number;
  netIncome: number;
  currency: string | null;
  modificationDate: string | null;
  creationDate: string | null;
};

@Injectable()
export class PaymentAccountingSummaryService {
  constructor(@Optional() @InjectDataSource() private readonly dataSource: DataSource | undefined) {}

  async getSummary(limit: number = 6): Promise<Record<string, unknown>> {
    const dataSource = this.resolveDataSource();
    if (!dataSource) {
      return {
        ok: true,
        message: 'Resumen táctico del accounting de payment obtenido con éxito.',
        data: {
          totals: {
            totalPayments: 0,
            succeededPayments: 0,
            failedPayments: 0,
            accountedPayments: 0,
            pendingAccountingPayments: 0,
            totalAmount: 0,
            platformAmount: 0,
            cashbackAmount: 0,
            referralAmount: 0,
            stripeFee: 0,
            refundAmount: 0,
            netIncome: 0,
          },
          latest: [],
        },
      };
    }

    const safeLimit = Math.max(1, Math.min(limit, 20));

    const [totals] = await dataSource.query(
      `SELECT
         COUNT(*)::int AS "totalPayments",
         COUNT(*) FILTER (WHERE UPPER(COALESCE(status, '')) = 'SUCCEEDED')::int AS "succeededPayments",
         COUNT(*) FILTER (WHERE UPPER(COALESCE(status, '')) = 'FAILED')::int AS "failedPayments",
         COUNT(*) FILTER (WHERE UPPER(COALESCE("accountingStatus", 'PENDING_ALLOCATION')) IN ('ACCOUNTED', 'SETTLED', 'ALLOCATED'))::int AS "accountedPayments",
         COUNT(*) FILTER (WHERE UPPER(COALESCE("accountingStatus", 'PENDING_ALLOCATION')) NOT IN ('ACCOUNTED', 'SETTLED', 'ALLOCATED'))::int AS "pendingAccountingPayments",
         COALESCE(SUM(COALESCE(amount, 0)), 0)::float AS "totalAmount",
         COALESCE(SUM(COALESCE("platformAmount", 0)), 0)::float AS "platformAmount",
         COALESCE(SUM(COALESCE("cashbackAmount", 0)), 0)::float AS "cashbackAmount",
         COALESCE(SUM(COALESCE("referralAmount", 0)), 0)::float AS "referralAmount",
         COALESCE(SUM(COALESCE("stripeFee", 0)), 0)::float AS "stripeFee",
         COALESCE(SUM(COALESCE("refundAmount", 0)), 0)::float AS "refundAmount",
         COALESCE(SUM(COALESCE("netIncome", 0)), 0)::float AS "netIncome"
       FROM payment_base_entity
       WHERE COALESCE("isActive", true) = true AND type = 'payment'`,
    );

    const latest = await dataSource.query(
      `SELECT id, code, status, "accountingStatus", "orderId",
              COALESCE(amount, 0)::float AS amount,
              COALESCE("platformAmount", 0)::float AS "platformAmount",
              COALESCE("cashbackAmount", 0)::float AS "cashbackAmount",
              COALESCE("referralAmount", 0)::float AS "referralAmount",
              COALESCE("stripeFee", 0)::float AS "stripeFee",
              COALESCE("refundAmount", 0)::float AS "refundAmount",
              COALESCE("netIncome", 0)::float AS "netIncome",
              currency, "modificationDate", "creationDate"
       FROM payment_base_entity
       WHERE COALESCE("isActive", true) = true AND type = 'payment'
       ORDER BY COALESCE("modificationDate", "creationDate") DESC
       LIMIT $1`,
      [safeLimit],
    );

    return {
      ok: true,
      message: 'Resumen táctico del accounting de payment obtenido con éxito.',
      data: {
        totals: {
          totalPayments: Number(totals?.totalPayments ?? 0),
          succeededPayments: Number(totals?.succeededPayments ?? 0),
          failedPayments: Number(totals?.failedPayments ?? 0),
          accountedPayments: Number(totals?.accountedPayments ?? 0),
          pendingAccountingPayments: Number(totals?.pendingAccountingPayments ?? 0),
          totalAmount: Number(totals?.totalAmount ?? 0),
          platformAmount: Number(totals?.platformAmount ?? 0),
          cashbackAmount: Number(totals?.cashbackAmount ?? 0),
          referralAmount: Number(totals?.referralAmount ?? 0),
          stripeFee: Number(totals?.stripeFee ?? 0),
          refundAmount: Number(totals?.refundAmount ?? 0),
          netIncome: Number(totals?.netIncome ?? 0),
        },
        latest: latest as PaymentAccountingRow[],
      },
      count: Array.isArray(latest) ? latest.length : 0,
    };
  }

  private resolveDataSource(): DataSource | null {
    if (this.dataSource?.isInitialized) {
      return this.dataSource;
    }

    return null;
  }
}
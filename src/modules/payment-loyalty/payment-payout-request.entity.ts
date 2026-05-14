import { Column, CreateDateColumn, Entity, Index, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

@Entity('payment_payout_request')
@Index('idx_payment_payout_request_customer', ['customerId'])
@Index('idx_payment_payout_request_merchant', ['merchantId'])
@Index('idx_payment_payout_request_wallet', ['walletId'])
@Index('idx_payment_payout_request_status', ['status'])
@Index('idx_payment_payout_request_reference', ['requestReference'], { unique: true })
export class PaymentPayoutRequest {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'uuid', nullable: false })
  walletId!: string;

  @Column({ type: 'uuid', nullable: false })
  customerId!: string;

  @Column({ type: 'uuid', nullable: false })
  merchantId!: string;

  @Column({ type: 'uuid', nullable: true })
  merchantGatewayEligibilityId?: string | null;

  @Column({ type: 'uuid', nullable: true })
  paymentId?: string | null;

  @Column({ type: 'uuid', nullable: true })
  orderId?: string | null;

  @Column({ type: 'varchar', length: 120, nullable: false, unique: true })
  requestReference!: string;

  @Column({ type: 'varchar', length: 40, nullable: false, default: 'REQUESTED' })
  status!: string;

  @Column({ type: 'decimal', precision: 14, scale: 2, nullable: false, default: 0 })
  amount!: number;

  @Column({ type: 'varchar', length: 12, nullable: false, default: 'USD' })
  currencyCode!: string;

  @Column({ type: 'varchar', length: 60, nullable: true })
  preferredCollectionMethod?: string | null;

  @Column({ type: 'varchar', length: 60, nullable: true })
  settlementMode?: string | null;

  @Column({ type: 'varchar', length: 255, nullable: true })
  notes?: string | null;

  @Column({ type: 'decimal', precision: 14, scale: 2, nullable: false, default: 0 })
  merchantDebtAppliedAmount!: number;

  @Column({ type: 'decimal', precision: 14, scale: 2, nullable: false, default: 0 })
  merchantNetAmount!: number;

  @Column({ type: 'varchar', length: 120, nullable: true })
  settlementReference?: string | null;

  @Column({ type: 'timestamp', nullable: true })
  requestedAt?: Date | null;

  @Column({ type: 'timestamp', nullable: true })
  processedAt?: Date | null;

  @Column({ type: 'json', nullable: true })
  metadata?: Record<string, unknown> | null;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt!: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt!: Date;
}
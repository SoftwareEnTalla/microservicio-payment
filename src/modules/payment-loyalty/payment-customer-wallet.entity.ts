import { Column, CreateDateColumn, Entity, Index, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

@Entity('payment_customer_wallet')
@Index('idx_payment_customer_wallet_customer', ['customerId'], { unique: true })
export class PaymentCustomerWallet {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'uuid', nullable: false, unique: true })
  customerId!: string;

  @Column({ type: 'decimal', precision: 14, scale: 2, nullable: false, default: 0 })
  cashbackBalance!: number;

  @Column({ type: 'decimal', precision: 14, scale: 2, nullable: false, default: 0 })
  withdrawableBalance!: number;

  @Column({ type: 'decimal', precision: 14, scale: 2, nullable: false, default: 0 })
  totalEarnedCashback!: number;

  @Column({ type: 'decimal', precision: 14, scale: 2, nullable: false, default: 0 })
  totalEarnedReferral!: number;

  @Column({ type: 'timestamp', nullable: true })
  lastMovementAt?: Date | null;

  @Column({ type: 'json', nullable: true })
  metadata?: Record<string, unknown> | null;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt!: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt!: Date;
}
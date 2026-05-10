import { Column, CreateDateColumn, Entity, Index, PrimaryGeneratedColumn } from 'typeorm';

@Entity('payment_wallet_movement')
@Index('idx_payment_wallet_movement_wallet', ['walletId'])
@Index('idx_payment_wallet_movement_customer', ['customerId'])
@Index('idx_payment_wallet_movement_payment', ['paymentId'])
@Index('idx_payment_wallet_movement_key', ['movementKey'], { unique: true })
export class PaymentWalletMovement {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'uuid', nullable: false })
  walletId!: string;

  @Column({ type: 'uuid', nullable: false })
  customerId!: string;

  @Column({ type: 'uuid', nullable: true })
  paymentId?: string | null;

  @Column({ type: 'uuid', nullable: true })
  orderId?: string | null;

  @Column({ type: 'varchar', length: 160, nullable: false, unique: true })
  movementKey!: string;

  @Column({ type: 'varchar', length: 60, nullable: false })
  movementType!: string;

  @Column({ type: 'varchar', length: 40, nullable: false })
  balanceBucket!: string;

  @Column({ type: 'varchar', length: 40, nullable: false, default: 'APPLIED' })
  status!: string;

  @Column({ type: 'decimal', precision: 14, scale: 2, nullable: false, default: 0 })
  amount!: number;

  @Column({ type: 'varchar', length: 255, nullable: true })
  description?: string | null;

  @Column({ type: 'json', nullable: true })
  metadata?: Record<string, unknown> | null;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt!: Date;
}
import { Vendor } from '@vendor/auth/entities/vendor.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class Product {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column()
  name: string;

  @Column()
  stock: number;

  @Column()
  vendorId: number;

  @ManyToOne(() => Vendor, (vendor) => vendor.products)
  vendor: Vendor;
}

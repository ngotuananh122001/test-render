import { Entity, PrimaryGeneratedColumn, Column, BeforeInsert, BeforeUpdate, Index } from 'typeorm';

@Entity('users')
@Index('email', ['email'], { unique: true })
export class User {
  @PrimaryGeneratedColumn()
  public id: number;

  @Column({ unique: true })
  public email: string;

  @Column({ nullable: false })
  public password: string;

  @Column({ nullable: true })
  public fullName: string;

  @Column({ nullable: true })
  public contact: string;

  @Column({ nullable: true })
  public dob: Date;

  @Column({ nullable: true })
  public phone: string;

  @Column({ nullable: true })
  public address: string;

  @Column({ nullable: true })
  public avatarUrl: string;

  @Column({ type: "tinyint", nullable: true })
  public status: string;

  @Column({ name: 'roles', type: 'simple-array' })
  public roles: string[];

  @Column({ default: 0 })
  public score: number;

  @Column()
  public createdAt: Date;

  @Column()
  public updatedAt: Date;

  @BeforeInsert()
  public updateCreateDates() {
    this.createdAt = new Date();
    this.updatedAt = new Date();
  }

  @BeforeUpdate()
  public updateUpdateDates() {
    this.updatedAt = new Date();
  }
}

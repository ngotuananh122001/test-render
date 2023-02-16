import { BeforeInsert, BeforeUpdate, Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity('reset_passwords')
export class ResetPassword {
  @PrimaryGeneratedColumn({ name: 'id', type: 'int' })
  public id: number;

  @Column({ unique: true })
  public email: string;

  @Column()
  public token: string;

  @Column()
  public expiredAt: Date;

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
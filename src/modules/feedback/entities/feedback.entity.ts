import { AbstractEntity } from '@base/entities/base.entity';
import { Table } from '@constants';
import { User } from '@modules/user/entities/user.entity';
import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsNumber, Max, Min } from 'class-validator';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
@Entity(Table.Feedback)
export class Feedback extends AbstractEntity {
  @ApiProperty()
  @IsNumber()
  @Expose()
  @Column()
  @Min(1)
  @Max(5)
  star: number;

  @ApiProperty({ nullable: true })
  @Expose()
  @Column({ nullable: true })
  content?: string;

  @ApiProperty()
  @Expose()
  @Column()
  reviewerId: string;

  @ApiProperty()
  @Expose()
  @Column({ default: false })
  isActive: boolean;

  // Relations
  @ManyToOne(() => User, (user) => user.favoriteDocuments, {
    nullable: false,
  })
  @JoinColumn({ name: 'reviewer_id' })
  reviewer: User;
}

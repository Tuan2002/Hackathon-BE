import { AbstractEntity } from '@base/entities/base.entity';
import { Table } from '@constants';
import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsEnum, IsNumber, IsString, ValidateIf } from 'class-validator';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { PointAction } from '../enums/point-action.enum';
import { User } from './user.entity';

@Entity(Table.PointHistory)
export class PointHistory extends AbstractEntity {
  @ApiProperty()
  @IsNumber()
  @Expose()
  @Column()
  amount: number;

  @ApiProperty({ enum: PointAction, enumName: 'PointAction' })
  @IsEnum(PointAction)
  @Expose()
  @Column()
  pointAction: PointAction;

  @ApiProperty()
  @ValidateIf((o) => o.note !== undefined)
  @IsString()
  @Expose()
  @Column({ nullable: true })
  note: string;

  @ApiProperty()
  @IsString()
  @Expose()
  @Column()
  historyUserId: string;

  @ManyToOne(() => User, (user) => user.pointHistories, {
    nullable: false,
  })
  @JoinColumn({ name: 'history_user_id' })
  historyUser: User;
}

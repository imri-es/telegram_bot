// MonthlySalesModel.ts
import { prop, getModelForClass, modelOptions, Severity } from '@typegoose/typegoose';
import { Types } from 'mongoose';

@modelOptions({ options: { allowMixed: Severity.ALLOW } })
export class MonthlySales {
  @prop({ required: true })
  public year!: number; // 

  @prop({ required: true })
  public month!: number; // 
  
  @prop({ required: true })
  public uniqueCount!: number;

  @prop({ required: true })
  public total!: number;

  @prop({ required: true })
  public sum!: number;

  @prop({ required: true })
  public difference!: number;
}

export const MonthlySalesModel = getModelForClass(MonthlySales);

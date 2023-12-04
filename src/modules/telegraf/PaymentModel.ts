import { prop } from "@typegoose/typegoose";
import { Base, TimeStamps } from "@typegoose/typegoose/lib/defaultClasses";
import { Types } from "mongoose";
import { connectDB}  from './db'

export enum PaymentTypeEnum {
  "SUBSCRIPTION" = "SUBSCRIPTION",
  "VIP_NAHUI" = "VIP_NAHUI",
  "ANALYTICS" = "ANALYTICS",
  "EXPRESS_ANALYTICS" = "EXPRESS_ANALYTICS",
  "STORE_DAILY_PRODUCT_ANALYTICS" = "STORE_DAILY_PRODUCT_ANALYTICS"
}

export interface PaymentModel extends Base { }

export class PaymentModel extends TimeStamps {
  @prop({ type: () => Types.ObjectId, required: true })
  activatedUserId?: Types.ObjectId;

  @prop({ type: () => Types.ObjectId, required: true })
  userId?: Types.ObjectId;

  @prop({ type: () => Types.ObjectId, required: false, default: null })
  storeId?: Types.ObjectId;

  @prop({ type: () => Number, default: null, min: 0 })
  numberOfMonth?: number;

  @prop({ type: () => String, default: "KaspiQR" })
  paymentType?: string;

  @prop({ type: () => Number, required: true, min: 0 })
  price?: number;

  @prop({ type: () => Date, default: null })
  newExpireDate?: Date;

  @prop({ type: () => Boolean, default: false })
  isOldClientNewStore?: boolean;

  @prop({ type: () => Number, default: 999999999 })
  maxDempingProducts?: number;

  @prop({ type: () => Types.ObjectId, default: null })
  tariffId?: Types.ObjectId;

  @prop({ type: () => Boolean, default: false })
  isIndividual?: boolean;

  @prop({ type: () => Boolean, default: false })
  doubleSpeed?: boolean;

  @prop({
    type: () => String,
    enum: PaymentTypeEnum,
    default: PaymentTypeEnum.SUBSCRIPTION,
    required: true,
  })
  type?: PaymentTypeEnum;

  @prop({ type: () => Number, default: 0 })
  expressAnalyticsRequestCount?: number

  @prop({ type: () => Types.ObjectId, default: null })
  dailyProductAnalyticId?: Types.ObjectId | null
}


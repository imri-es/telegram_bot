"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentModel = exports.PaymentTypeEnum = void 0;
const typegoose_1 = require("@typegoose/typegoose");
const defaultClasses_1 = require("@typegoose/typegoose/lib/defaultClasses");
const mongoose_1 = require("mongoose");
var PaymentTypeEnum;
(function (PaymentTypeEnum) {
    PaymentTypeEnum["SUBSCRIPTION"] = "SUBSCRIPTION";
    PaymentTypeEnum["VIP_NAHUI"] = "VIP_NAHUI";
    PaymentTypeEnum["ANALYTICS"] = "ANALYTICS";
    PaymentTypeEnum["EXPRESS_ANALYTICS"] = "EXPRESS_ANALYTICS";
    PaymentTypeEnum["STORE_DAILY_PRODUCT_ANALYTICS"] = "STORE_DAILY_PRODUCT_ANALYTICS";
})(PaymentTypeEnum || (exports.PaymentTypeEnum = PaymentTypeEnum = {}));
class PaymentModel extends defaultClasses_1.TimeStamps {
}
exports.PaymentModel = PaymentModel;
__decorate([
    (0, typegoose_1.prop)({ type: () => mongoose_1.Types.ObjectId, required: true }),
    __metadata("design:type", mongoose_1.Types.ObjectId)
], PaymentModel.prototype, "activatedUserId", void 0);
__decorate([
    (0, typegoose_1.prop)({ type: () => mongoose_1.Types.ObjectId, required: true }),
    __metadata("design:type", mongoose_1.Types.ObjectId)
], PaymentModel.prototype, "userId", void 0);
__decorate([
    (0, typegoose_1.prop)({ type: () => mongoose_1.Types.ObjectId, required: false, default: null }),
    __metadata("design:type", mongoose_1.Types.ObjectId)
], PaymentModel.prototype, "storeId", void 0);
__decorate([
    (0, typegoose_1.prop)({ type: () => Number, default: null, min: 0 }),
    __metadata("design:type", Number)
], PaymentModel.prototype, "numberOfMonth", void 0);
__decorate([
    (0, typegoose_1.prop)({ type: () => String, default: "KaspiQR" }),
    __metadata("design:type", String)
], PaymentModel.prototype, "paymentType", void 0);
__decorate([
    (0, typegoose_1.prop)({ type: () => Number, required: true, min: 0 }),
    __metadata("design:type", Number)
], PaymentModel.prototype, "price", void 0);
__decorate([
    (0, typegoose_1.prop)({ type: () => Date, default: null }),
    __metadata("design:type", Date)
], PaymentModel.prototype, "newExpireDate", void 0);
__decorate([
    (0, typegoose_1.prop)({ type: () => Boolean, default: false }),
    __metadata("design:type", Boolean)
], PaymentModel.prototype, "isOldClientNewStore", void 0);
__decorate([
    (0, typegoose_1.prop)({ type: () => Number, default: 999999999 }),
    __metadata("design:type", Number)
], PaymentModel.prototype, "maxDempingProducts", void 0);
__decorate([
    (0, typegoose_1.prop)({ type: () => mongoose_1.Types.ObjectId, default: null }),
    __metadata("design:type", mongoose_1.Types.ObjectId)
], PaymentModel.prototype, "tariffId", void 0);
__decorate([
    (0, typegoose_1.prop)({ type: () => Boolean, default: false }),
    __metadata("design:type", Boolean)
], PaymentModel.prototype, "isIndividual", void 0);
__decorate([
    (0, typegoose_1.prop)({ type: () => Boolean, default: false }),
    __metadata("design:type", Boolean)
], PaymentModel.prototype, "doubleSpeed", void 0);
__decorate([
    (0, typegoose_1.prop)({
        type: () => String,
        enum: PaymentTypeEnum,
        default: PaymentTypeEnum.SUBSCRIPTION,
        required: true,
    }),
    __metadata("design:type", String)
], PaymentModel.prototype, "type", void 0);
__decorate([
    (0, typegoose_1.prop)({ type: () => Number, default: 0 }),
    __metadata("design:type", Number)
], PaymentModel.prototype, "expressAnalyticsRequestCount", void 0);
__decorate([
    (0, typegoose_1.prop)({ type: () => mongoose_1.Types.ObjectId, default: null }),
    __metadata("design:type", Object)
], PaymentModel.prototype, "dailyProductAnalyticId", void 0);
//# sourceMappingURL=PaymentModel.js.map
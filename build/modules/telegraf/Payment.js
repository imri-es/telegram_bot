"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const typegoose_1 = require("@typegoose/typegoose");
const mongoose_1 = __importDefault(require("mongoose"));
const PaymentModel_1 = require("./PaymentModel"); // Replace with your actual file path
// Convert the Typegoose class into a Mongoose model
const Payment = (0, typegoose_1.getModelForClass)(PaymentModel_1.PaymentModel);
// функция для рандомного выбора числа в бд
function getRandomInt(min, max, step = 1) {
    const range = (max - min) / step + 1;
    return Math.floor(Math.random() * range) * step + min;
}
// Function to generate a random date
function getRandomDate() {
    const start = new Date(2022, 0, 1); // Adjust start date as needed
    const end = new Date();
    return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
}
// Function to create and save a new document
async function createAndSavePayment() {
    try {
        // Create a new instance of the Payment model with necessary data
        const newPayment = new Payment({
            numberOfMonth: getRandomInt(1, 12),
            activatedUserId: new mongoose_1.default.Types.ObjectId(),
            userId: new mongoose_1.default.Types.ObjectId(),
            price: getRandomInt(10000, 1000000, 10000),
            type: PaymentModel_1.PaymentTypeEnum.SUBSCRIPTION,
            createdAt: getRandomDate(), //рандом
            // Set other fields as needed
        });
        // Save the document in MongoDB
        await newPayment.save();
        console.log('Payment saved!');
    }
    catch (error) {
        console.error('Error saving payment:', error);
    }
}
// Call the function to create and save data
for (let i = 0; i < 100; i++) {
    createAndSavePayment();
}
//# sourceMappingURL=Payment.js.map
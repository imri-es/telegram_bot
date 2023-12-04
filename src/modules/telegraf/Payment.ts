import { getModelForClass } from '@typegoose/typegoose';
import mongoose from 'mongoose';
import { PaymentModel, PaymentTypeEnum } from './PaymentModel'; // Replace with your actual file path
import { connectDB } from './db';


// Convert the Typegoose class into a Mongoose model
const Payment = getModelForClass(PaymentModel);

// функция для рандомного выбора числа в бд
function getRandomInt(min: number, max: number, step: number = 1): number {
    const range = (max - min) / step + 1;
    return Math.floor(Math.random() * range) * step + min;
}

// Function to generate a random date
function getRandomDate(): Date {
    const start = new Date(2022, 0, 1); // Adjust start date as needed
    const end = new Date();
    return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
  }

// Function to create and save a new document
async function createAndSavePayment(): Promise<void> {
  try {
    // Create a new instance of the Payment model with necessary data
    const newPayment = new Payment({
        numberOfMonth: getRandomInt(1, 12),
        activatedUserId: new mongoose.Types.ObjectId(),
        userId: new mongoose.Types.ObjectId(),
        price: getRandomInt(10000, 1000000, 10000),
        type: PaymentTypeEnum.SUBSCRIPTION,
        createdAt: getRandomDate(), //рандом
        // Set other fields as needed
      });

    // Save the document in MongoDB
    await newPayment.save();
    console.log('Payment saved!');
  } catch (error) {
    console.error('Error saving payment:', error);
  }
}

// Call the function to create and save data
for (let i = 0; i < 100; i ++){
    createAndSavePayment();
}


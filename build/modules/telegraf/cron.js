"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const typegoose_1 = require("@typegoose/typegoose");
const PaymentModel_1 = require("./PaymentModel"); // Replace with your actual file path
const db_1 = require("./db");
const MonthlySalesModel_1 = require("./MonthlySalesModel"); // Adjust the path as needed
// recalc prev month and curr month stat is here.
// recalc statistics for all data 
// Connect to the database
(0, db_1.connectDB)();
// Convert the Typegoose class into a Mongoose model
const Payment = (0, typegoose_1.getModelForClass)(PaymentModel_1.PaymentModel);
// Function to aggregate and calculate statistics
async function calculateMonthlySales() {
    try {
        const salesStats = await Payment.aggregate([
            {
                $group: {
                    _id: {
                        month: { $month: "$createdAt" },
                        year: { $year: "$createdAt" }
                    },
                    totalSales: { $sum: 1 },
                    totalAmount: { $sum: "$price" }
                }
            },
            { $sort: { "_id.year": 1, "_id.month": 1 } }
        ]);
        salesStats.forEach(stat => {
            const monthNames = ["January", "February", "March", "April", "May", "June",
                "July", "August", "September", "October", "November", "December"];
            const month = monthNames[stat._id.month - 1];
            const year = stat._id.year;
            const totalSales = stat.totalSales;
            const totalAmount = stat.totalAmount;
            console.log(`Дата: ${year}, ${month}\nКоличество продаж: ${totalSales}\nСумма: ${totalAmount}\n`);
        });
        for (const stat of salesStats) {
            const year = stat._id.year;
            const month = stat._id.month.toString().padStart(2, '0');
            const yearAndMonth = `${year}-${month}`;
            const salesCount = stat.totalSales;
            const sum = stat.totalAmount;
            // Check if a record for the year and month already exists, update it if it does, otherwise create a new one
            await MonthlySalesModel_1.MonthlySalesModel.findOneAndUpdate({ yearAndMonth }, {
                yearAndMonth,
                salesCount,
                sum,
            }, { upsert: true, new: true });
        }
    }
    catch (error) {
        console.error('Error calculating monthly sales:', error);
    }
}
// Call the function to calculate and print monthly sales
calculateMonthlySales();
//# sourceMappingURL=cron.js.map
import mongoose from 'mongoose';
import { getModelForClass } from '@typegoose/typegoose';
import { PaymentModel } from './PaymentModel'; // Adjust the path as needed
import { MonthlySalesModel } from './MonthlySalesModel'; // Adjust the path as needed
import { connectDB } from './db';


// Convert the Typegoose class into a Mongoose model
const Payment = getModelForClass(PaymentModel);

// async function calculateMonthlySales(isRecent: boolean) {
//   try {
//     const pipeline: any[] = []; 

//     if (isRecent) {
//       // Determine the start of the current and previous months
//       const now = new Date();
//       const startOfPreviousMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);

//       // Add match stage for recent months
//       pipeline.push({
//         $match: {
//           createdAt: {
//             $gte: startOfPreviousMonth
//           }
//         }
//       });
//     }

//     // Continue with the rest of your aggregation pipeline
//     pipeline.push({
//       $group: {
//         _id: {
//           month: { $month: "$createdAt" },
//           year: { $year: "$createdAt" }
//         },
//         totalSales: { $sum: 1 },
//         totalAmount: { $sum: "$price" }
//       }
//     });

//     pipeline.push({ $sort: { "_id.year": 1, "_id.month": 1 } });

//     const salesStats = await Payment.aggregate(pipeline);

//     for (const stat of salesStats) {
//       const monthNames = ["January", "February", "March", "April", "May", "June",
//                           "July", "August", "September", "October", "November", "December"];
//       const month = monthNames[stat._id.month - 1];
//       const year = stat._id.year;
//       const totalSales = stat.totalSales;
//       const totalAmount = stat.totalAmount;

//       // Update or create record in MonthlySales
//       await MonthlySalesModel.findOneAndUpdate(
//         { yearAndMonth: `${year}-${month}` },
//         {
//           salesCount: totalSales,
//           sum: totalAmount,
//         },
//         { upsert: true, new: true }
//       );
//     }
//   } catch (error) {
//     console.error('Error calculating monthly sales:', error);
//   }
// }
async function calculateMonthlySales(isRecent: boolean) {
  try {
    const pipelineForRandomSubset: any[] = [];
    const pipelineForAllRecords: any[] = [];

    if (isRecent) {
      const now = new Date();
      const startOfPreviousMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);

      pipelineForRandomSubset.push({
        $match: {
          createdAt: { $gte: startOfPreviousMonth }
        }
      });

      pipelineForAllRecords.push({
        $match: {
          createdAt: { $gte: startOfPreviousMonth }
        }
      });
    }

    // Add a field with a random value to each document for the random subset
    pipelineForRandomSubset.push({
      $addFields: {
        random: { $rand: {} }
      }
    });

    // Filter based on the random field to approximate random selection
    pipelineForRandomSubset.push({
      $match: {
        random: { $lte: 0.5 } // Adjust this value to control the proportion of documents selected
      }
    });

    // Group for random subset
    pipelineForRandomSubset.push({
      $group: {
        _id: {
          month: { $month: "$createdAt" },
          year: { $year: "$createdAt" }
        },
        uniqueCount: { $sum: 1 },
        total: { $sum: "$price" }
      }
    });

    // Group for all records
    pipelineForAllRecords.push({
      $group: {
        _id: {
          month: { $month: "$createdAt" },
          year: { $year: "$createdAt" }
        },
        sum: { $sum: "$price" }
      }
    });

    const randomSubsetStats = await Payment.aggregate(pipelineForRandomSubset);
    const allRecordsStats = await Payment.aggregate(pipelineForAllRecords);

    const allRecordsMap = new Map(allRecordsStats.map(item => [`${item._id.year}-${item._id.month}`, item.sum]));

    // let previousMonthSum = null;


    for (const stat of randomSubsetStats) {
      const month = stat._id.month - 1; // Adjust month to 0-11
      const year = stat._id.year;
      const uniqueCount = stat.uniqueCount;
      const total = stat.total;

      const allRecordsSum = allRecordsMap.get(`${year}-${month + 1}`) || 0;

      let difference = 0;
      // if (previousMonthSum !== null) {
      //   difference = ((allRecordsSum - previousMonthSum) / previousMonthSum) * 100;
      // }

      // Update or create record in MonthlySales
      await MonthlySalesModel.findOneAndUpdate(
        { year, month },
        {
          year,
          month,
          uniqueCount,
          total,
          sum: allRecordsSum,
          difference
        },
        { upsert: true, new: true }
      );

      // previousMonthSum = allRecordsSum;

    }
  } catch (error) {
    console.error('Error calculating monthly sales:', error);
  }
}


async function recalculateDifference(isCurrentMonthOnly: boolean) {
  try {
    let monthsToProcess: { year: number; month: number }[] = [];

    if (isCurrentMonthOnly) {
      const currentDate = new Date();
      const currentMonth = currentDate.getMonth();
      const currentYear = currentDate.getFullYear();

      const previousMonth = currentMonth === 0 ? 11 : currentMonth - 1;
      const yearOfPreviousMonth = currentMonth === 0 ? currentYear - 1 : currentYear;

      monthsToProcess = [
        { year: currentYear, month: currentMonth },
        { year: yearOfPreviousMonth, month: previousMonth }
      ];
    } else {
      // Fetch all records and then filter out unique year-month combinations
      const allRecords = await MonthlySalesModel.find({});
      const uniqueYearMonths = new Set();

      for (const record of allRecords) {
        const yearMonthKey = `${record.year}-${record.month}`;
        uniqueYearMonths.add(yearMonthKey);
      }

      monthsToProcess = Array.from(uniqueYearMonths).map(key => {
        const [year, month] = (key as string).split('-').map(Number); // Asserting that key is a string
        return { year, month };
      });

    }

    // Sorting the monthsToProcess array in chronological order
    monthsToProcess.sort((a, b) => {
      // Compare years first
      if (a.year !== b.year) {
        return a.year - b.year;
      }
      // If years are the same, compare months
      return a.month - b.month;
    });


    for (const monthRecord of monthsToProcess) {
      const salesRecord = await MonthlySalesModel.findOne({ year: monthRecord.year, month: monthRecord.month });
      console.log("month to process: ", monthRecord)
      if (salesRecord) {
        const previousMonth = monthRecord.month === 0 ? 11 : monthRecord.month - 1;
        const yearOfPreviousMonth = monthRecord.month === 0 ? monthRecord.year - 1 : monthRecord.year;

        const previousMonthRecord = await MonthlySalesModel.findOne({ year: yearOfPreviousMonth, month: previousMonth });
        const previousSum = previousMonthRecord ? previousMonthRecord.sum : 0;

        const differencePercentage = previousSum !== 0 ? ((salesRecord.sum - previousSum) / previousSum) * 100 : 0;
        salesRecord.difference = differencePercentage;

        await salesRecord.save();
      }
    }

    console.log('Differences recalculated successfully');
  } catch (error) {
    console.error('Error recalculating differences', error);
  }
}


export { calculateMonthlySales, recalculateDifference }
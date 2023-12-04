import { Context, Telegraf } from 'telegraf'
import { message } from 'telegraf/filters'
import { connectDB } from './db';
import { MonthlySalesModel } from './MonthlySalesModel';
import { calculateMonthlySales, recalculateDifference} from './Calculate';
import cron from 'node-cron';

connectDB();
const bot = new Telegraf('6793590260:AAEkhRXQP1F0S388gG_5QNdSLEVG3O8lwRY');


// async function getFirstPaymentDate() {

//     const payment = await this.paymentModel.findOne().sort({ _id: 1 }) // ищет в базе данных первый пеймент

//     if (!payment) {
//         return new Date()
//     }

//     return payment.createdAt
// }

// async function getLastPaymentDate() {
//     const payment = await this.paymentModel.findOne().sort({ _id: -1 })

//     if (!payment) {
//         return new Date()
//     }

//     return payment.createdAt
// }

// async function getStatisticsByMonth() {
//     console.log('getStatisticsByMonth')

//     const firstDate = await this.getFirstPaymentDate()
//     const lastDate = await this.getLastPaymentDate()

//     const res = []

//     const storeIds = []

//     const date = new Date()
//     for (let year = firstDate.getFullYear(); year <= lastDate.getFullYear(); year++) {
//         for (let month = 0; month < 12; month++) {
//             const d = new Date(year, month + 1, 0)
//             const lastDayOfMonth = d.getDate()

//             const gte = new Date(year, month, 1)

//             const lte = new Date(year, month, lastDayOfMonth, 23, 59, 59, 999)

//             const createdAt = {
//                 $gte: gte,
//                 $lte: lte,
//             }

//             const payments = await this.paymentModel.find({
//                 createdAt,
//             })

//             let sum = 0
//             let count = 0
//             let total = 0

//             for (const payment of payments) {
//                 if (!storeIds.includes(payment?.storeId?.toString())) {
//                     sum += payment.price

//                     count++
//                     if (payment?.storeId) {
//                         storeIds.push(payment?.storeId?.toString())
//                     }
//                 }

//                 total += payment.price
//             }

//             if (total) {
//                 res.push({
//                     sum,
//                     year,
//                     month,
//                     count,
//                     total,
//                 })
//             }
//         }
//     }

//     return res
// }

// async function statisticsByMonth(ctx: Context, bot: Telegraf) {
//     console.log('statisticsByMonth')

//     const chatId = ctx.from.id

//     const foundTelegramUser = await this.telegramModel.findOne({ chatId })
//     if (!foundTelegramUser) {
//         return
//     }

//     const stats = await this.paymentService.getStatisticsByMonth()

//     let message = '<b>Статистика по месяцам</b>\n\n'

//     const months = ['январь', 'февраль', 'март', 'апрель', 'май', 'июнь', 'июль', 'август', 'сентябрь', 'октябрь', 'ноябрь', 'декабрь']

//     for (let i = 0; i < stats.length; i++) {
//         const year = stats[i].year

//         const previousMonth = stats[i - 1]
//         const currentMonth = stats[i]
//         let isUp = false
//         if (previousMonth && currentMonth.sum >= previousMonth.sum) {
//             isUp = true
//         }

//         message += `<b>${ months[currentMonth.month] } - ${ year } </b>\n`
//         message += `Уник.продавцов: ${ isUp ? '⬆' : '⬇' } <b>${ currentMonth.count } (${ this.currencyFormat(currentMonth.sum) } KZT)</b>`

//         if (previousMonth) {
//             let percentageMsg = ''

//             if (previousMonth.sum > currentMonth.sum) {
//                 percentageMsg += `<i>-${ this.currencyFormat((1 - currentMonth.sum / previousMonth.sum) * 100) } </i>`
//             } else {
//                 percentageMsg += <i>+${ this.currencyFormat((1 - previousMonth.sum / currentMonth.sum) * 100) } </i>
//             }

//             message += percentageMsg + '%\n'
//         } else {
//             message += '\n'
//         }

//         message += 'Общая касса: <b>' + ${ this.currencyFormat(currentMonth.total) } + 'KZT < /b>'

//         message += '\n\n'
//     }

//     if (message) {
//         await this.sendMessage(ctx.from.id, message, bot, {
//             keyboard: this.getMainMenuKeyboards(),
//             inline_keyboard: [],
//         })
//     }
// }


// // return stat for all months


// helpers.ts

bot.command('s', async (ctx) => {
    try {
        await calculateMonthlySales(true);
        await recalculateDifference(true);
        // Fetch data from DB and sort by year and month
        const salesData = await MonthlySalesModel.find().sort({ year: 1, month: 1 });
        const MonthNames = [
            'Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь',
            'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'
        ];
        let response = '';
        salesData.forEach(sale => {
            const roundedDifference = Math.round(sale.difference);
            const monthName = MonthNames[sale.month];
            response += `Год: *${sale.year}*, *${monthName}*\nУникальные продажи: *${sale.uniqueCount}*\n (*${sale.total}* KZT)\nСумма: *${sale.sum} KZT*\nРазница: *${roundedDifference}* %\n\n`;
        });

        // Send the response
        ctx.replyWithMarkdown(response);
    } catch (error) {
        console.error('Error fetching sales data:', error);
        ctx.reply('Произошла ошибка при извлечении данных о продажах.');
    }
});

bot.command('cur', async (ctx) => {
    try{
        calculateMonthlySales(true);
        recalculateDifference(true);
        ctx.replyWithMarkdown('База данных на последние два месяца обновлена!');
    }
    catch(error){
        console.error('Error fetching sales data:', error);
        ctx.reply('Произошла ошибка.');
    }
});

bot.command('all', async (ctx) => {
    try{
        calculateMonthlySales(false);
        recalculateDifference(false);
        ctx.replyWithMarkdown('Вся база данных обновлена!');
    }
    catch(error){
        console.error('Error fetching sales data:', error);
        ctx.reply('Произошла ошибка.');
    }
});



// Start the bot
bot.launch();

cron.schedule('0 0 * * *', () => {
    console.log('Бд обновлена!');
    calculateMonthlySales(false);
    recalculateDifference(false);
});
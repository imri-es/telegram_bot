import express, { Request, Response } from 'express';
import { changeResponsible, getLatest } from './script'

const app = express();
app.use(express.json());

app.use(express.urlencoded({
    extended: false, // Whether to use algorithm that can handle non-flat data strutures
    limit: 10000, // Limit payload size in bytes
    parameterLimit: 99999999, // Limit number of form items on payload
}))

let counter = 0;

const responsible_users = [10386710, 10388442, 10386706] // Дос,  Дамир, imran
getLatest().then(latestUser => {
    console.log(latestUser);
    counter = responsible_users.indexOf(latestUser);
    console.log(" current responsible user in the script is: " + responsible_users[counter])

}).catch(error => {
    console.error('Error:', error);
});





app.post('/webhook', (req: Request, res: Response) => {
    console.log('Webhook received:', req.body);
    // Process the webhook data here
    const LeadToChange = req.body['leads[add][0][id]']; // get the lead ID
    console.log('new lead id:', LeadToChange)
    res.status(200).send('Webhook received'); // inform that the webhook is received 
    counter++
    console.log("Выбраная сделка: " + LeadToChange, " Новый ответственный: " + responsible_users[counter % responsible_users.length]) // information
    changeResponsible(LeadToChange, responsible_users[counter % responsible_users.length]) // change the responsible user on selected lead
    


});

const port = 3000;
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});

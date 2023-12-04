"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const script_1 = require("./script");
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({
    extended: false, // Whether to use algorithm that can handle non-flat data strutures
    limit: 10000, // Limit payload size in bytes
    parameterLimit: 99999999, // Limit number of form items on payload
}));
let counter = 0;
const responsible_users = [10386710, 10388442, 10386706]; // Дос,  Дамир, imran
(0, script_1.getLatest)().then(latestUser => {
    console.log(latestUser);
    counter = responsible_users.indexOf(latestUser);
    console.log(" current responsible user in the script is: " + responsible_users[counter]);
}).catch(error => {
    console.error('Error:', error);
});
app.post('/webhook', (req, res) => {
    console.log('Webhook received:', req.body);
    // Process the webhook data here
    const LeadToChange = req.body['leads[add][0][id]']; // get the lead ID
    console.log('new lead id:', LeadToChange);
    res.status(200).send('Webhook received'); // inform that the webhook is received 
    counter++;
    console.log("Выбраная сделка: " + LeadToChange, " Новый ответственный: " + responsible_users[counter % responsible_users.length]); // information
    (0, script_1.changeResponsible)(LeadToChange, responsible_users[counter % responsible_users.length]); // change the responsible user on selected lead
});
const port = 3000;
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
//# sourceMappingURL=app.js.map
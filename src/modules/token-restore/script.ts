import path from 'path';
import fs from 'fs';
import { Client } from 'amocrm-js';
import config from './config';

const client = new Client(config);
const filePath = path.resolve(__dirname, './token.json');


const updateConnection = async () => {
    if (!client.connection.isTokenExpired()) {
        return;
    }
    await client.connection.update();
};

(async () => {
    let renewTimeout: NodeJS.Timeout;

    client.token.on('change', () => {
        const token = client.token.getValue();
        fs.writeFileSync(filePath, JSON.stringify(token));

        // Renew token when it expires
        const tokenValue = token ?? { expires_in: 100000 };
        const expiresIn = tokenValue.expires_in * 1000;


        clearTimeout(renewTimeout);
        renewTimeout = setTimeout(updateConnection, expiresIn);
    });

    if (fs.existsSync(filePath)) {
        try {
            const json = fs.readFileSync(filePath).toString();
            const currentToken = JSON.parse(json);
            client.token.setValue(currentToken);
        } catch (error) {
            console.error('Error parsing token JSON:', error);
            // Handle incorrect JSON token here
        }
    }

    try {
        await client.connection.connect();
        console.log("connection success!");

         /* Создание новой сделки */
         for (let i = 1; i < 25; i++){
            await client.leads.create([
                {
                    name: "Тестовая сделка N" + i
                },
            ]);
         }
         

        const pagination = await client.leads.get();
        const leads = pagination.getData();
        const responsible_users = [10386710, 10388442, 10386706]

        let counter = 0; // Counter to keep track of the current index in responsible_users

        for (const lead of leads) {
            // Assign the next user from responsible_users and increment the counter
            lead.responsible_user_id = responsible_users[counter % responsible_users.length];
            await lead.save(); // If save() is an asynchronous operation
        
            counter++; // Increment the counter for the next iteration
        }



        //console.log(leads);

    } catch (error) {
        console.error('Error connecting to amoCRM:', error);
    }
})();

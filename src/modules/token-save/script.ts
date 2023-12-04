import path from 'path';
import fs from 'fs';
import { Client } from 'amocrm-js';
import config from './config';

const client = new Client(config);
const filePath = path.resolve(__dirname, './token.json');

(async () => {
    client.token.on('change', () => {
        const token = client.token.getValue();
        try {
            fs.writeFileSync(filePath, JSON.stringify(token));
        } catch (error) {
            console.error('Error writing token to file:', error);
        }
    });

    try {
        await client.connection.connect();
    } catch (error) {
        console.error('Error connecting to amoCRM:', error);
    }
})();

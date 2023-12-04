"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getLatest = exports.changeResponsible = void 0;
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const amocrm_js_1 = require("amocrm-js");
const config_1 = __importDefault(require("./config"));
const client = new amocrm_js_1.Client(config_1.default);
const filePath = path_1.default.resolve(__dirname, './token.json');
const updateConnection = async () => {
    if (!client.connection.isTokenExpired()) {
        return;
    }
    await client.connection.update();
};
(async () => {
    let renewTimeout;
    client.token.on('change', () => {
        const token = client.token.getValue();
        fs_1.default.writeFileSync(filePath, JSON.stringify(token));
        // Renew token when it expires
        const tokenValue = token !== null && token !== void 0 ? token : { expires_in: 100000 };
        const expiresIn = tokenValue.expires_in * 1000;
        clearTimeout(renewTimeout);
        renewTimeout = setTimeout(updateConnection, expiresIn);
    });
    if (fs_1.default.existsSync(filePath)) {
        try {
            const json = fs_1.default.readFileSync(filePath).toString();
            const currentToken = JSON.parse(json);
            client.token.setValue(currentToken);
        }
        catch (error) {
            console.error('Error parsing token JSON:', error);
            // Handle incorrect JSON token here
        }
    }
})();
function changeResponsible(leadId, newResponsible) {
    (async () => {
        try {
            await client.connection.connect();
            console.log("connection success!");
            //  /* Создание новой сделки */
            //  for (let i = 1; i < 25; i++){
            //     await client.leads.create([
            //         {
            //             name: "Тестовая сделка N" + i
            //         },
            //     ]);
            //  }
            const lead = await client.leads.getById(leadId);
            if (lead) {
                lead.responsible_user_id = newResponsible;
                await lead.save();
            }
            else {
                console.log('Lead not found with ID' + leadId);
            }
        }
        catch (error) {
            console.error('Error connecting to amoCRM:', error);
        }
    })();
}
exports.changeResponsible = changeResponsible;
async function getLatest() {
    try {
        await client.connection.connect();
        console.log("connection success!");
        const pagination = await client.leads.get();
        const leads = pagination.getData();
        if (leads.length === 0) {
            // Handle the case where there are no leads
            console.log("No leads found");
            return 0; // Or some other default value or error code
        }
        const lastLead = leads[leads.length - 1];
        const responsibleUserId = lastLead.responsible_user_id;
        // Check if responsibleUserId is indeed a number
        if (typeof responsibleUserId === 'number') {
            console.log("Latest ID: " + responsibleUserId);
            return responsibleUserId;
        }
        else {
            // Handle the case where responsible_user_id is not a number
            console.log("responsible_user_id is not a number");
            return 0; // Or some other default value or error code
        }
    }
    catch (error) {
        console.error('Error connecting to amoCRM:', error);
        return 0; // Return 0 or some other error code in case of failure
    }
}
exports.getLatest = getLatest;
//# sourceMappingURL=script.js.map
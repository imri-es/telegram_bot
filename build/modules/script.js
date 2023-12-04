"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const amocrm_js_1 = require("amocrm-js");
const config_1 = __importDefault(require("./config")); // Assuming you have converted config.js to config.ts
const client = new amocrm_js_1.Client(config_1.default);
(async () => {
    try {
        const status = await client.connection.connect();
        console.log({ status });
        const pagination = await client.leads.get();
        const leads = pagination.getData();
        const leadIds = leads.map(lead => lead.id);
        console.log(leadIds);
        const paginationContacts = await client.request.get('/api/v4/users');
        console.log(paginationContacts);
    }
    catch (error) {
        console.error('Error:', error);
    }
})();
//# sourceMappingURL=script.js.map
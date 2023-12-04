"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const amocrm_js_1 = require("amocrm-js");
const config_1 = __importDefault(require("./config"));
const client = new amocrm_js_1.Client(config_1.default);
const filePath = path_1.default.resolve(__dirname, './token.json');
(async () => {
    client.token.on('change', () => {
        const token = client.token.getValue();
        try {
            fs_1.default.writeFileSync(filePath, JSON.stringify(token));
        }
        catch (error) {
            console.error('Error writing token to file:', error);
        }
    });
    try {
        await client.connection.connect();
    }
    catch (error) {
        console.error('Error connecting to amoCRM:', error);
    }
})();
//# sourceMappingURL=script.js.map
import Base from "../base";
import { LOGIN, REGISTER, WEBHOOK } from "./mutation";

export default class Authentication extends Base {
    constructor(...args) {
        super(...args);
    }

    async register(data = {}) {
        // 1. bulid variables for request
        const { email, password, full_name, country_id, merchant_id: merchantId } = data;
        const variables = {
            sign_up_data: { auth: { email, password }, user_info: { full_name, country_id } },
            merchantId,
        };

        // 2. Assign query object;
        const mutation = REGISTER;

        // 3. Declare result values
        const responseMap = {
            register: "register",
        };

        // 4. Execute mutation;
        return this.executeMutation({
            mutation,
            variables,
            responseMap,
        });
    }

    async login(data = {}) {
        // 1. bulid variables for request
        const { email, password } = data;
        const variables = { auth: { email, password } };

        // 2. Assign query object;
        const mutation = LOGIN;

        // 3. Declare result values
        const responseMap = {
            login: "login",
        };

        // 4. Execute mutation;
        return this.executeMutation({
            mutation,
            variables,
            responseMap,
        });
    }

    async webhook(data = {}) {
        const { url } = data;
        const variables = { url };
        //2. Assign query object;
        const mutation = WEBHOOK;
        //3. Declare result values
        const responseMap = {
            webhook: "updateWebhookUrl",
        };

        // 4. Execute mutation;
        return this.executeMutation({ mutation, variables, responseMap });
    }
}

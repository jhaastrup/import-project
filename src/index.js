const settings = require("./settings");
require("dotenv").config();
import express from "express";
import { initializeMarketplace } from "./services/engine";
import bodyParser from "body-parser";
import { urlencoded } from "body-parser";
import axios from "axios";

// Create a new instance of express
const app = express();
const engine = initializeMarketplace();

// Tell express to use the body-parser middleware and to not parse extended bodies
app.use(bodyParser.urlencoded({ extended: false }));
// parse application/json
app.use(bodyParser.json());

app.get("/", (req, res) => {
    res.send("Home page");
    res.end();
});

//login
app.post("/login", async function (req, res) {
    try {
        const { email, password } = req.body;
        const response = await engine.authentication.login({ email, password });
        res.json(response);
    } catch (err) {
        res.status(500).send(err.message);
        console.log(err.message);
    }
});

//register

app.post("/register", async function (req, res) {
    try {
        const { email, password, full_name, country_id, merchant_id } = req.body;
        const response = await engine.authentication.register({ email, password, full_name, country_id, merchant_id });
        console.log({response})
        res.json(response);
    } catch (err) {
        res.status(500).send(err.message);
        console.log(err.message);
    }
});

//webhook url for exohub to post when a product is created or updated
app.post("/webhook", function (req, res) {
    const response = req.body;
    console.log(response);

    //change some values in response
     response.user.merchantId = "5d0d62d540f1c100019aaad0";
    response.payload.inventory.line2 = "NG-19818";
    response.payload.inventory.id = "USNG-19818";
    console.log({response}, "response i am sending");

    //Post exohub response to sendbox
    axios
        .post(`${settings.HEADLESS_SHIPPING_INTERNAL_URL}/register_import`, {"request_data" : response})
        .then(function (response) {
            res.json({});
            console.log("it sent for delivered");
        })
        .catch(function (error) {
            console.log(error);
            //res.status(401).send("Invalid Authorization");
        });

    console.log(response);
});

//register webhook

engine.authentication.webhook({ url: `${settings.BASE_URL}webhook`});

app.listen(process.env.PORT || 4000, () => {
    console.log("Sendbox-Exohub integration is listening on port 4000! 🚀");
});

export { initializeMarketplace };

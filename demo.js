const {initializeMarketplace} = require("./src");
const engine = initializeMarketplace();

//engine.authentication.login({email:"adejoke.haastrup@sendbox.ng", password:"Tester@1"}).then((res)=>{console.log(res)})
engine.authentication.register({email:"newtester08@gmail.com", password:"Tester@004", merchantId:"sb-007", full_name:"New Tester"})
//engine.authentication.webhook({url:"https://9fb9-160-152-97-91.ngrok.io/webhook"})
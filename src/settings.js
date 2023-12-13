require("dotenv").config({ path: process.env.ENV_SOURCE || ".env" });

let settings = {
    BASE_URL: process.env.BASE_URL,
    EXOHUB_GRAPH_URI:process.env.EXOHUB_GRAPH_URI,
    HEADLESS_SHIPPING_INTERNAL_URL:process.env.HEADLESS_SHIPPING_INTERNAL_URL,
    APP_ID: process.env.APP_ID
    
  };

  if ( process.env.NODE_ENV === "staging" || process.env.NODE_ENV === "production" ) {
    settings = {
      BASE_URL:process.env.BASE_URL,
      EXOHUB_GRAPH_URI:process.env.EXOHUB_GRAPH_URI,
      HEADLESS_SHIPPING_INTERNAL_URL:process.env.HEADLESS_SHIPPING_INTERNAL_URL,
      APP_ID:process.env.APP_ID  
    };
  }
  
  module.exports = settings
/**
 * config.js
 * Internal config object to calibrate the marketplace api engine.
 * Some attributes declared here can be changed by the implementer of the engine.
 */
 const settings = require("./settings");

const config = {
    uri: "https://sandbox-api.exohub.com/exo-graphql",
    //uri: "https://api.exohub.com/exo-graphql",
    tokenId: "__sc.aid",
    sessionId: "__sc.uid",
    locationId: "__sc.lid",
    redirect: "/",
    appId: "0ae5f98a2df5a73a87d408ad75de6cd768eecf89ed508e67b6c345446795ca32",
    //appId: "dDe9zEbvueqffgBaYxA4Pu7B7SiQfV1B8i1aMkvvrYQkN2AzeE42NnoSKzhaPxci"
};

export default config;

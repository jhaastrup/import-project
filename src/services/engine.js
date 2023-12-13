/**
 * @sendbox/exohub
 * Sendbox exohub integration
 */ 
 import globalConfig from "src/config";
 import { Authentication } from "./index";
 import Auth from "../lib/auth";
import { v4 as uuidv4 } from "uuid";
import { initializeApollo } from "src/lib/apollo";

class Marketplace {

    constructor(uri, appId, sessionId, context = {}, initialState = null, redirect) {
        
        this.uri = uri;
        this.redirect = redirect;
       // this.tokenId = tokenId;
        this.sessionId = sessionId;
        this.appId = appId;
        this.context = context;
        // instantiate the GraphQL client;
        this.client = initializeApollo(uri, appId, context, initialState);

        // instantiate service objects; 
        this.authentication = new Authentication(this); 
    }

    getSession(req = {}, res = {}) {
        let sessionId = Auth.getCookie(this.sessionId, req);
        console.log("inside getSession", sessionId);
        if (!sessionId) {
            sessionId = this.setSession(res);
        }
        return sessionId;
    }

    setSession(res = {}) {
        const sessionId = uuidv4();
        Auth.setCookie(this.sessionId, sessionId, res);
        return sessionId;
    }

    isAuthenticated(req = {}) {
        return Auth.isAuthenticated(req);
    } 

    clearSession(context = {}) {}

    getAppId(){
        return this.appId;
    }
 
    loadCookieData(key, req = {}, res = {}) {
        const payload = Auth.loadCookieData(key, req, res);
        return payload;
    }

   /*  getToken(req = {}) {
        return Auth.getCookie(this.tokenId, req);
    } */

    getCookie(key, req = {}) {
        return Auth.getCookie(key, req);
    }

    setCookie(key, value, res = {}, expires = 1, path = "/") {
        Auth.setCookie(key, value, res, expires, path);
    }

    removeCookie(key) {
        Auth.removeCookie(key);
    }

    setCookieData(key, data, res = {}, expires = 1, path = "/") {
        Auth.setCookieData(key, data, res, expires, path);
    }

    clearCookieData(key, req = {}) {
        Auth.removeCookie(key);
    }

   /*  loginUser(token) {
        Auth.loginUser(this.tokenId, token);
    } */

    /* logoutUser(key, req = {}, path) {
        Auth.logoutUser(key, req, path);
    } */

}

// static marketplace object that holds base instance of the marketplace
let marketplace;
export function initializeMarketplace( ) {
    // Discard any unwanted parameters from config
   
    const { uri, sessionId, redirect, context={}, initialState=null ,appId } = globalConfig;
    const _marketplace = marketplace ?? new Marketplace(uri, appId, sessionId, context, initialState, redirect);

    // For SSG and SSR always create a new marketplace
    if (typeof window === "undefined") return _marketplace;
    // But create the new marketplace only once on the client side
    if (!marketplace) marketplace = _marketplace;

    return _marketplace;
}

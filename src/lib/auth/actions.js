import redirect from "./redirect";
import { setCookie, getCookie, removeCookie } from "./session";
import base64 from "base-64";
import URL from "url-parse";

/**
 * 
 * @param {String} cookieId Identifier for cookie that holds login token
 * @param {String} token Login token to be stored in cookie
 * @param {String} redirectURL URL to redirect to after sucessful login
 */
export const loginUser = async (cookieId, token, redirectURL = "/") => {
    // Sign in a user by setting the cookie with the token received

    // const payloadHash = base64.encode(JSON.stringify(payload));
    setCookie(cookieId, token);
    // if (redirectURL) {
    //     redirect(redirectURL);
    // }
};

export const logoutUser = (cookieId, ctx = {}, redirectURL = "/") => {
    // Sign out user by removing the cookie from the broswer session
    if (process.browser) {
        removeCookie(cookieId);
        // if(redirectURL) {
        //     redirect(redirectURL, ctx);
        // }
    }
};

export const getToken = (cookieId, ctx) => {
    // Fetch the auth token for a user
    return getCookie(cookieId, ctx.req);
};


export const setProfile = (profileId, profile) => {
    const p = base64.encode(JSON.stringify(profile));
    setCookie(profileId, p);
};

export const getProfile = (profileId, ctx = {}) => {
    const profile = getCookie(profileId, ctx.req);

    return profile ? JSON.parse(base64.decode(profile)) : {};
};

export const isAuthenticated = ctx => !!getToken(ctx);

export const redirectIfAuthenticated = (ctx, target = "/") => {
    if (isAuthenticated(ctx)) {
        redirect(target, ctx);
        return true;
    }
    return false;
};

export const redirectIfNotAuthenticated = (ctx, loginURL, target = "/") => {
    if (!isAuthenticated(ctx)) {
        const { query, resolvedUrl } = ctx;
        // console.log({ asPath });
        const { redirect_to = resolvedUrl, state } = query;
        const urlObj = new URL(loginURL);
        urlObj.set("query", { domain: target, redirect_to, state });
        const redirectURL = urlObj.toString();
        redirect(redirectURL, ctx);
        return { query, resolvedUrl };
    }
    // if (!isAuthenticated(ctx)) {
    //     redirect(target, ctx);
    //     return true;
    // }

    return false;
};

export const getAuthHeaders = async (ctx = {}) => {
    const token = getToken(ctx);
    const headers = {};

    if (process.browser) {
        headers["X-Request-With"] = "XMLHttpRequest";
    }
    if (token) {
        headers["Authorization"] = `${token}`;
    }

    return headers;
};

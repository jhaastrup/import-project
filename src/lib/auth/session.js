import cookie from "js-cookie";

export const setCookie = (key, value, res = {}, expires = 1, path = "/") => {
    if (process.browser) {
        cookie.set(key, value, {
            expires,
            path,
        });
    } else {
        res && res.cookie && res.cookie("name", JSON.stringify({ key: value }));
    }
};

export const removeCookie = (key, expires = 1, path = "/") => {
    if (process.browser) {
        cookie.remove(key, {
            expires,
            path,
        });
    }
};

export const getCookieFromBrowser = key => {
    return cookie.get(key);
};

export const getCookieFromServer = (key, req) => {
    if(req === undefined) {
        return undefined;
    }

    if (!req.headers || !req.headers.cookie) {
        return undefined;
    }

    const rawCookie = req.headers.cookie.split(";").find(c => c.trim().startsWith(`${key}=`));
    if (!rawCookie) {
        return undefined;
    }

    return rawCookie.split("=")[1];
};

export const getCookie = (key, req) => {
    return process.browser ? getCookieFromBrowser(key) : getCookieFromServer(key, req);
};


export const getCurrentLocation = (key, req) => {
    const data = getCookie(key, req) || "{}";

    let payload;
    try {
        payload = JSON.parse(data);
    } catch (error) {
        payload = {};
    }

    return payload;
}

export const loadCookieData = (key, req) => {
    const data = getCookie(key, req) || "{}";

    let payload;
    try {
        payload = JSON.parse(decodeURIComponent(data));
    } catch (error) {
        payload = {};
    }

    return payload;
};

export const setCookieData = (key, data, res = {}, expires = 1, path = "/") => {
    const payload = JSON.stringify(data);
    setCookie(key, payload, res, expires, path);
}
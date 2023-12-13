
import { ApolloClient, HttpLink } from "@apollo/client/core";
import { InMemoryCache } from "@apollo/client/cache";
import fetch from "isomorphic-unfetch";
import { setContext } from "@apollo/client/link/context";

// import settings from "app/config/settings";
import Auth from "./auth";

// Global apolloClient state object
let apolloClient;

/**
 *
 * @param {String} uri - GraphQL api URL
 * @param {String} tokenId - Auth token cookie ID
 * @returns {Object} - Apollo client object
 */
function createApolloClient(uri, appId = null, context = {}) {
    const isBrowser = typeof window !== "undefined";

    const link = new HttpLink({
        uri: uri, // Server URL (must be absolute)
        fetch: !isBrowser && fetch,
        credentials: "same-origin", // Additional fetch() options like `credentials` or `headers`
        // Use fetch() polyfill on the server
    });

    const authLink = setContext((_, { headers }) => {
        // fetch the authToken from here and include it in the headers
        //const token = tokenId && Auth.getCookie(tokenId, context);
        return {
            headers: {
                ...headers,
                //authorization: token ? `${token}` : "",
                "AppId":appId ?`${appId}`: "",
               
            },
        };
    });

    return new ApolloClient({
        ssrMode: !isBrowser,
        link: authLink.concat(link),
        cache: new InMemoryCache({}),
    });
}

/**
 *
 * @param {String} uri - GraphQL api URL
 * @param {String} tokenId - Auth token cookie ID
 * @param {String} appId - Exohub app id
 * @param {Object} initialState - Initial GraphQL state
 * @returns {Object} - Apollo client object
 */
export function initializeApollo(uri, appId = null, context = {}, initialState = null) {
    const _apolloClient = apolloClient ?? createApolloClient(uri, appId, context);

    // If your page has Next.js data fetching methods that use Apollo Client, the initial state
    // gets hydrated here
    if (initialState) {
        // Restore the cache
        _apolloClient.cache.restore(initialState);
    }
    // For SSG and SSR always create a new Apollo Client
    if (typeof window === "undefined") return _apolloClient;
    // Create the Apollo Client once in the client
    if (!apolloClient) apolloClient = _apolloClient;

    return _apolloClient;
}

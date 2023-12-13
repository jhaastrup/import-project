/**
 * base.js
 * Base class for all service classes. This will contain methods for querying and retrieving data for the response.
 */
import _ from "lodash";
import cleanDeep from "clean-deep";
class Base {
    constructor(parent) {
        this.parent = parent;
    }

    buildListQueryParams(data = {}, queryParams) {
        const { sort_by = {}, filter_by, page_by = {}, view, near, merchant } = data;

        if (queryParams) {
            const {
                sort_by: sortBy,
                page_by: pageBy,
                view: pageView,
                // near: location,
                query: pageQuery,
                filter_by: filterBy,
            } = this.extractQueryParams(queryParams);

            const preVariables = {
                sort_by: !_.isEmpty(sortBy) ? sortBy : sort_by,
                page_by: !_.isEmpty(pageBy) ? pageBy : page_by,
                view: pageView ? pageView : view,
                near,
                query: pageQuery,
                filter_by: { ...this.buildFilter(filter_by, filterBy) },
                merchant,
            };

            const variables = _.pickBy({ ...preVariables }, _.identity);
            return variables;
        }

        const variables = _.pickBy({ sort_by, filter_by, page_by, view, near, merchant }, _.identity);
        return variables;
    }
    extractQueryParams(queryObj = {}) {
        const { page, per_page, order_by, asc_desc, query = "", view = "", name, op, value, lat, lng } = queryObj;

        const page_by = { page, per_page };
        const sort_by = { order_by, asc_desc };
        const filter_by = name && op && value ? { [name]: { op, value } } : {};
        const near = { lat, lng };

        return {
            page_by: cleanDeep(page_by),
            sort_by: cleanDeep(sort_by),
            filter_by: cleanDeep(filter_by),
            query,
            view,
            near: cleanDeep(near),
        };
    }

    buildFilter(prevfilter, newfilter) {
        // check if there is an existing filter from query call and merge with queryprams
        if (!_.isEmpty(prevfilter)) {
            const mergedFilter = {
                ...prevfilter,
                ...newfilter,
            };
            return mergedFilter;
        }
        return newfilter;
    }

    async executeQuery({ query, variables, responseMap = {} }) {
        try {
            const resp = await this.parent.client
                .watchQuery({
                    query,
                    variables,
                })
                .result();
            const data = resp.data;
            const payload = Object.entries(responseMap).reduce((prev, curr) => {
                const [k, v] = curr;
                const val = v.split(".").reduce((acc, key) => {
                    // extract the keys specified and pull the path from the response data
                    const res = acc[key];
                    return res;
                }, data);
                prev[k] = val;

                return prev;
            }, {});

            return payload;
        } catch (error) {
            throw error;
        }
    }

    async executeMutation({ mutation, variables, responseMap = {} }) {
        try {
            const resp = await this.parent.client.mutate({
                mutation,
                variables,
            });

            const data = resp.data;
            console.log({ data });
            const payload = Object.entries(responseMap).reduce((prev, curr) => {
                const [k, v] = curr;
                const val = v.split(".").reduce((acc, key) => {
                    // extract the keys specified and pull the path from the response data
                    const res = acc[key];
                    return res;
                }, data);
                prev[k] = val;

                return prev;
            }, {});

            return payload;
        } catch (error) {
            throw error;
        }
    }
}

export default Base;

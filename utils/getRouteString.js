export default function getRouteString(route, req) {
    if (req != null) {
        const protocol = req.headers["x-forwarded-proto"] || "http";
        const baseUrl = `${protocol}://${req.headers.host}`;

        return baseUrl + route;
    }
    else {
        return route;
    }
}
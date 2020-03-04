import Router from "next/router";

const redirect = (location, res) => {
    if (res) {
        res.writeHead(302, {
            Location: location || "/"
        });
        return res.end();
    } else {
        return Router.push("/");
    }                
};

export default redirect;
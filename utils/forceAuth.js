import Router from "next/router";

const forceAuth = (store, res, hasToBeLoggedIn, hasToBeLoggedOut, redirectIfLoggedIn) => {
    const state = store ? store.getState() : null;

    if (state) {
        if (state.app) {
            //already signed in
            if (state.app.user) {
                if (hasToBeLoggedOut) {
                    if (res) {
                        res.writeHead(302, {
                            Location: redirectIfLoggedIn || "/"
                        });
                        return res.end();
                    } else {
                        return Router.push(redirectIfLoggedIn || "/").then(() => window.scrollTo(0, 0));
                    }
                }
                //if user doesn't have to be logged out, its fine show them (since user is logged in)
                //also accounts for if user HAS to be logged in
                else return true;
            }
        }
    }

    /* USER IS NOT LOGGED IN */

    if (hasToBeLoggedIn) {
        if (res) {
            res.writeHead(302, {
                Location: "/auth/sign-in"
            });
            return res.end();
        } else {
            Router.push("/auth/sign-in").then(() => window.scrollTo(0, 0));
        }
    }
    //if user doesn't have to be logged in, its fine show them (since user is logged out)
    //also accounts for if user HAS to be logged out
    else return true;
};

export default forceAuth;
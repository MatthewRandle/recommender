import Router from "next/router";

const forceAuth = (store, res, hasToBeLoggedIn) => {
    const state = store ? store.getState() : null;

    if(state) {
        if (state.app) {
            //already signed in
            if (state.app.user) {
                //if user is only allowed on page is logged in
                if (hasToBeLoggedIn) {
                    return;
                }
                //if user is not allowed on page if logged in
                else {
                    if (res) {
                        res.writeHead(302, {
                            Location: "/"
                        });
                        return res.end();
                    } else {
                        return Router.push("/");
                    }
                }
            }
        }
    }

    //user is not logged in so don't allow
    if (hasToBeLoggedIn) {
        if (res) {
            res.writeHead(302, {
                Location: "/"
            });
            res.end();
        } else {
            Router.push("/");
        }
    }
    //if user is only allowed on page if not logged in
    else {
        return;
    }
};

export default forceAuth;
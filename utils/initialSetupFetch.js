import axios from "axios";
import { putUser } from "../components/app/duck";

export default async function initialSetupFetch (store, req) {
    //only do this once per mount, i.e. server side
    if(req) {
        if(req.user != null) {
            store.dispatch(putUser({ user: req.user }));
            return;
        }
    }
    else {
        if(store) {
            const state = store.getState();
            if (!state.app || !state.app.user) {
                const res = await axios.get("/auth/get-user");
                
                if(res.data.user != null) {
                    store.dispatch(putUser({ user: res.data.user }));
                }
            }
        }
    }
}
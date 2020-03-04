import { combineReducers } from "redux";

import { AppReducer } from "../components/app/duck";

export default combineReducers({
    app: AppReducer
});
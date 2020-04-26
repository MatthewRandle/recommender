import { combineReducers } from "redux";

import { AppReducer } from "../components/app/duck";
import { SearchReducer } from "../components/search/duck";
import { ListsReducer } from "../components/lists/duck";

export default combineReducers({
    app: AppReducer,
    search: SearchReducer,
    lists: ListsReducer
});
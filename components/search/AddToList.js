import React, { useState } from "react";
import { useDispatch } from "react-redux";

import { addTvShowToList, addMovieToList } from "../lists/duck";

const AddToList = ({ details, type }) => {
    const dispatch = useDispatch();
    const [rating, setRating] = useState(0);

    const handleSubmit = () => {
        if (type === "show") dispatch(addTvShowToList(details, rating))
        else dispatch(addMovieToList(details, rating))
    }

    return(
        <div className="addToList">
            <label htmlFor="rating">Rate {details.name || details.title} out of 10</label>
            <input type="number" name="rating" min="0" max="10" value={rating} onChange={(e) => setRating(e.target.value)} />
            <button onClick={() => handleSubmit()}>Add to list</button>
        </div>
    );
};

export default AddToList;
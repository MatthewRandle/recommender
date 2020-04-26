import React from "react";
import Router from "next/router";

const Result = ({ title, id, posterPath, type }) => {
    return(
        <div onClick={() => Router.push(`/${type}/${id}`)}>
            <img src={`http://image.tmdb.org/t/p/w92${posterPath}`} alt="Poster" />
            <h2>{title}</h2>
            <p>{type}</p>
        </div>
    );
};

export default Result;
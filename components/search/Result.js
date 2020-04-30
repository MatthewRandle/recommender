import React from "react";
import Router from "next/router";

const Result = ({ title, id, posterPath, type, overview }) => {
    return(
        <div className="search_result" onClick={() => Router.push(`/${type}/${id}`)}>
            <div className="search_result_image_container"><img src={`http://image.tmdb.org/t/p/w342${posterPath}`} alt="Poster" /></div>
            <div className="search_result_text">
                <h2>{title}</h2>
                <p>{overview.trim()}...</p>
            </div>
        </div>
    );
};

export default Result;
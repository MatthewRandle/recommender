import React from "react";
import Router from "next/router";

const Item = ({ name, poster_path, vote_average, id, type }) => {
    const getHref = () => {
        if(type === "movie") return `/movie/${id}`;
        else return `/tv/${id}`;
    }

    return(
        <a href={getHref()} className="item" onClick={() => viewItem()}>
            <div className="item_image_container"><img src={`http://image.tmdb.org/t/p/w342${poster_path}`} alt="Poster" /></div>
            <h2>{name}</h2>
            {vote_average != null ? <h3>{vote_average}</h3> : null}
        </a>
    );
};

export default Item;
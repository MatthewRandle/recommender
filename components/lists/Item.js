import React, { useState, useRef, useEffect } from "react";
import { useDispatch } from "react-redux";
import Draggable from "react-draggable";

/* 
    position: if even it is on the right, odd left
*/
const Item = ({ media, length, offset, position, stacked, startingIndex, lastItem, updateMedia, iteration }) => {
    const dispatch = useDispatch();
    const initialRating = parseFloat(media.rating).toFixed(2);
    const [newRating, setNewRating] = useState(initialRating);
    const ref = useRef(null);
    
    let width;
    //if we are stacked, the first 2 will still be the normal width
    //after that, each 2 pairs will be the same width
    if(stacked) {
        if(iteration == 0 || iteration == 1) width = "48%";
        else if (iteration == 2 || iteration == 3) width = "46%";
        else if (iteration == 4 || iteration == 5) width = "44%";
        else if (iteration == 6 || iteration == 7) width = "42%";
    }
    else width = "48%";

    const defaultClassName = getClassName(stacked, startingIndex, lastItem, position);
    const [className, setClassName] = useState(defaultClassName);
    const [zIndex, setZIndex] = useState(0);

    const updateNewRating = () => {
        const newRating = (10 - (((ref.current.getBoundingClientRect().top + document.documentElement.scrollTop - offset) / length) * 10)).toFixed(2);
        setNewRating(newRating);   
    }

    const save = () => {
        dispatch(updateMedia(media.id, newRating));
    }

    return(
        <Draggable
            onDrag={() => updateNewRating()} axis="y"
            defaultClassName={className}
            onMouseDown={() => {
                setZIndex(1);

                if(position % 2 === 0) {
                    setClassName("timeline_item timeline_item_right");
                }
                else {
                    setClassName("timeline_item timeline_item_left");
                }
            }}
        >
            <div
                onClick={() => {
                    setZIndex(0);
                    if(initialRating == newRating || newRating == null) {
                        setClassName(defaultClassName);
                    }
                }}
                style={{ 
                    position: "absolute", 
                    top: (length * ((10 - initialRating) / 10)), 
                    width,
                    zIndex
                }}
                ref={ref} 
            >
                {/* {newRating && newRating !== initialRating ? 
                    <p>{newRating}</p>
                : null} */}

                <div className="timeline_item_marker" />
                <img draggable="false" src={`http://image.tmdb.org/t/p/w342${media.backdrop_path}`} alt="Poster" />
                
                <div className="timeline_item_content">
                    <h2>{media.name}</h2>
                    {newRating && newRating !== initialRating ? <button onClick={() => save()}>UPDATE</button> : null}
                </div>

                <h3>{newRating}</h3>

            </div>
        </Draggable>
    );
};

export default Item;

function getClassName(stacked, startingIndex, lastItem, position) {
    let className;
    if (stacked && !lastItem) {
        //item is on the right
        if (position % 2 === 0) {
            if (position % 4 === 0) className = "timeline_item timeline_item_right timeline_item_stacked--even";
            else className = "timeline_item timeline_item_right timeline_item_stacked--odd";
        }
        //item is on the left
        else {
            //if we start at 0, make it 1 so our modulus checks works for only odd numbers, since anything % 0 is 0
            let startIndex = startingIndex == 0 ? startingIndex + 1 : startingIndex;

            if (position % (startIndex + 2) !== 0) className = "timeline_item timeline_item_left timeline_item_stacked--even";
            else className = "timeline_item timeline_item_left timeline_item_stacked--odd";
        }
    }
    else position % 2 === 0 ? className = "timeline_item timeline_item_right" : className = "timeline_item timeline_item_left";

    return className;
}
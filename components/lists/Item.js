import React, { useState, useRef, useEffect } from "react";
import { useDispatch } from "react-redux";
import Draggable from "react-draggable";

/* 
    position: if even it is on the right, odd left
*/
const Item = ({ media, length, offset, position, stacked, startingIndex, lastItem, updateMedia }) => {
    const dispatch = useDispatch();
    const initialRating = parseFloat(media.rating).toFixed(2);
    const [newRating, setNewRating] = useState(null);
    const ref = useRef(null);
    const width = stacked ? `${48 - (parseInt(position) * 2)}%` : "48%";    

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
                    setClassName("timeline_item_right");
                }
                else {
                    setClassName("timeline_item_left");
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
                {newRating && newRating !== initialRating ? 
                    <p>{newRating}</p>
                : null}

                <div>
                    {media.name || media.title}
                </div>

                {newRating && newRating !== initialRating ? <p onClick={() => save()}>Rating has changed!</p> : null}
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
            if (position % 4 === 0) className = "timeline_item_right timeline_item_stacked--even";
            else className = "timeline_item_right timeline_item_stacked--odd";
        }
        //item is on the left
        else {
            //if we start at 0, make it 1 so our modulus checks works for only odd numbers, since anything % 0 is 0
            let startIndex = startingIndex == 0 ? startingIndex + 1 : startingIndex;

            if (position % (startIndex + 2) !== 0) className = "timeline_item_left timeline_item_stacked--even";
            else className = "timeline_item_left timeline_item_stacked--odd";
        }
    }
    else position % 2 === 0 ? className = "timeline_item_right" : className = "timeline_item_left";

    return className;
}
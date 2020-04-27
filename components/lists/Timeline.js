import React, { useEffect, useState, useRef } from "react";
import { useSelector } from "react-redux";
import Draggable from "react-draggable";

const Timeline = () => {
    const tvShowList = useSelector(state => state.lists ? state.lists.tvShowList : []);
    const [offset, setOffset] = useState(null);
    const [bottomYPos, setBottomYPos] = useState(null);
    const [length, setLength] = useState(0);
    const [scale, setScale] = useState(100); //minimum is 20
    const [steps, setSteps] = useState([
        "10",
        "9",
        "8",
        "7",
        "6",
        "5",
        "4",
        "3",
        "2",
        "1",
        "0"
    ]);

    const topRef = useRef(null);
    const bottomRef = useRef(null);

    useEffect(() => {
        setOffset(topRef.current.getBoundingClientRect().top);
        setBottomYPos(bottomRef.current.getBoundingClientRect().bottom);
    }, [scale]);

    useEffect(() => {
        setLength(bottomYPos - offset);
    }, [offset, bottomYPos])

    if(tvShowList && tvShowList.length > 0) {
        return (
            <div>
                <input type="range" min="20" max="500" defaultValue={scale} onChange={(e) => setScale(e.target.value)} />

                <div className="timeline" style={{ height: `${steps.length * scale}px` }}>
                    {steps.map((step, i) => (
                        <span
                            key={i}
                            style={{ top: `${(i * scale)}px` }}
                            ref={i === 0 ? topRef : i === steps.length - 1 ? bottomRef : null}
                        >
                            {step}
                        </span>
                    ))}

                    {length ?
                        tvShowList.map((group, i) => {
                            if (group.shows.length > 1) {
                                return group.shows.map((show, i) => {
                                    return (
                                        <Draggable key={i} axis="y">
                                            <div style={{ position: "absolute", top: (length * ((10 - parseFloat(show.rating)) / 10)) }}>
                                                <div className="timeline_item">{show.name}</div>
                                            </div>
                                        </Draggable>
                                    );
                                })
                            }
                            else {
                                const show = group.shows[0];
                                
                                return (
                                    <Draggable key={i} axis="y">
                                        <div style={{ position: "absolute", top: (length * ((10 - parseFloat(show.rating)) / 10)) }}>
                                            <div className="timeline_item">{show.name}</div>
                                        </div>
                                    </Draggable>
                                );
                            }
                        })
                        : null}
                </div>
            </div>
        );
    }
    else return <div>You have no items on this list</div>;
};

export default Timeline;
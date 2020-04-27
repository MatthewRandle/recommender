import React, { useEffect, useState, useRef } from "react";

import Item from "./Item";

const Timeline = ({ list, steps }) => {
    const [offset, setOffset] = useState(null);
    const [bottomYPos, setBottomYPos] = useState(null);
    const [length, setLength] = useState(0);
    const [scale, setScale] = useState(200); //minimum is 20

    const topRef = useRef(null);
    const bottomRef = useRef(null);

    useEffect(() => {
        setOffset(topRef.current.getBoundingClientRect().top);
        setBottomYPos(bottomRef.current.getBoundingClientRect().top);
    }, [scale]);

    useEffect(() => {
        setLength(bottomYPos - offset);
    }, [offset, bottomYPos])

    return (
        <div>
            <input type="range" min="20" max="500" defaultValue={scale} onChange={(e) => setScale(e.target.value)} />

            <div className="timeline">
                {steps.map((step, i) => (
                    <span
                        key={i}
                        style={{ marginBottom: `${(scale)}px` }}
                        ref={i === 0 ? topRef : i === steps.length - 1 ? bottomRef : null}
                    >
                        {step}
                    </span>
                ))}

                {length ?
                    list.map((group, i) => {
                        if (group.mediaList.length > 1) {
                            return group.mediaList.map((show, k) => {
                                return (
                                    <Item 
                                        lastItem={!(k < group.mediaList.length - 2)} 
                                        startingIndex={i}
                                        stacked 
                                        position={i + k} 
                                        key={k} 
                                        show={show} 
                                        length={length} 
                                        offset={offset} 
                                    />
                                );
                            })
                        }
                        else {
                            const show = group.mediaList[0];

                            return (
                                <Item 
                                    position={i} 
                                    key={i} 
                                    show={show} 
                                    length={length} 
                                    offset={offset} 
                                />
                            );
                        }
                    })
                    : null}
            </div>
        </div>
    );
};

export default Timeline;
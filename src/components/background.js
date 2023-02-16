import React, { useState, useEffect } from 'react'
const size = 70

export default function Background() {
    const [squares, setSquares] = useState([])
    useEffect(() => {
        addSquares()
    }, [])

    const addSquares = () => {
        const squares = [], windowHeight = window.innerHeight, windowWidth = window.innerWidth
        const yLimit = Math.ceil(windowHeight/size), xLimit = Math.ceil(windowWidth/size)
        for(let i=0; i<xLimit; i++) {
            for(let j=0; j<yLimit; j++) {
                squares.push({x: i*size, y: j*size})
            }
        }
        setSquares(squares)
    }

    return (
        <div className="background">
            {
                squares.length>0 &&
                squares.map(i => (
                <div
                    className="square"
                    style={{
                        width: `${size}px`,
                        height: `${size}px`,
                        left: i.x,
                        top: i.y
                    }}
                ></div>
                ))
            }
        </div>
    )
}
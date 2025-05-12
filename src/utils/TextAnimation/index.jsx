import React from 'react'
import "./index.scss";

const TextAnimation = ({ text, className, delayStart }) => {
    return (
        <div className={className}>
            {text.split("").map((char, index) => (
                <span
                    key={index}
                    className="char"
                    style={{ animationDelay: `${delayStart + index * 0.1}s` }}
                >
                    {char === " " ? "\u00A0" : char}
                </span>

            ))}
        </div>
    );
};

export default TextAnimation
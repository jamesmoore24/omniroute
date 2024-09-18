import { useState, useEffect } from "react";

export const useTypingEffect = (text: string, speed: number = 30) => {
    const [displayedText, setDisplayedText] = useState("");
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        if (currentIndex < text.length) {
            const timer = setTimeout(() => {
                setDisplayedText((prevText) => prevText + text[currentIndex]);
                setCurrentIndex((prevIndex) => prevIndex + 1);
            }, speed);

            return () => clearTimeout(timer);
        }
    }, [text, speed, currentIndex]);

    useEffect(() => {
        setDisplayedText("");
        setCurrentIndex(0);
    }, [text]);

    return displayedText;
};

import React, { useState, useEffect, useRef } from "react";
import { Typography } from "antd";
import CountUp from "react-countup";
import { prompts, models } from "../../data/aiData";

const { Text } = Typography;

const calculateTokens = (text: string) =>
  Math.round(text.split(/\s+/).length * 1.3);
const calculateSaved = (tokens: number) => tokens * 0.007;

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

export const LandingDemo: React.FC = () => {
  const [currentPrompt, setCurrentPrompt] = useState(0);
  const [totalTokens, setTotalTokens] = useState(0);
  const [totalSaved, setTotalSaved] = useState(0);
  const [updateCounter, setUpdateCounter] = useState(0);
  const prevTokensRef = useRef(0);
  const prevSavedRef = useRef(0);
  const displayedOptimizedText = useTypingEffect(
    prompts[currentPrompt].optimized,
    30
  );

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentPrompt((prev) => {
        const next = (prev + 1) % prompts.length;
        const newTokens = calculateTokens(prompts[next].optimized);
        const newSaved = calculateSaved(newTokens);

        prevTokensRef.current = totalTokens;
        prevSavedRef.current = totalSaved;

        setTotalTokens((prevTokens) => prevTokens + newTokens);
        setTotalSaved((prevSaved) => prevSaved + newSaved);
        setUpdateCounter((prev) => prev + 1);

        return next;
      });
    }, 5000);
    return () => clearInterval(interval);
  });

  return (
    <div className="max-w-4xl mx-auto bg-white/10 backdrop-blur-md rounded-lg p-6 animate-fade-in-up animation-delay-800 border border-gray-200">
      <div className="flex flex-col md:flex-row justify-between items-start mb-8">
        <div className="w-full md:w-1/3 text-left mb-8 md:mb-0">
          <div className="space-y-4">
            {prompts.map((prompt, index) => (
              <div
                key={index}
                className={`transition-all duration-500 ${
                  index === currentPrompt ? "opacity-100" : "opacity-0 hidden"
                }`}
              >
                <div className="mb-2">
                  <span className="text-xs text-gray-500 mb-1 block">
                    Original Prompt
                  </span>
                  <div className="bg-gray-200 text-gray-800 p-3 rounded-lg rounded-tl-none inline-block w-full">
                    {prompt.text}
                  </div>
                </div>
                <div>
                  <span className="text-xs text-gray-500 mb-1 block">
                    Optimized Prompt
                  </span>
                  <div className="bg-orange-500 text-white p-3 rounded-lg inline-block w-full">
                    <div className="text-left whitespace-pre-wrap break-words">
                      {displayedOptimizedText}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="w-full md:w-2/3 flex justify-end items-center">
          <div className="relative w-full h-[200px]">
            <svg viewBox="0 0 300 200" className="w-full h-full">
              <defs>
                <linearGradient
                  id="routeGradient"
                  x1="0%"
                  y1="0%"
                  x2="100%"
                  y2="0%"
                >
                  <stop offset="0%" stopColor="#F97316" stopOpacity="0.2" />
                  <stop offset="100%" stopColor="#F97316" stopOpacity="1" />
                </linearGradient>
              </defs>
              {models.map((model, index) => {
                const y = 20 + (index * 160) / (models.length - 1);
                const isSelected = model === prompts[currentPrompt].model;
                return (
                  <g key={model} transform={`translate(170, 0)`}>
                    <circle
                      cx="0"
                      cy={y}
                      r="4"
                      fill={isSelected ? "#F97316" : "#4B5563"}
                    />
                    <text
                      x="15"
                      y={y + 5}
                      fontSize="18"
                      fill={isSelected ? "#F97316" : "gray"}
                      textAnchor="start"
                    >
                      {model}
                    </text>
                  </g>
                );
              })}
              <path
                d={`M-50,100 Q75,100 170,${
                  20 +
                  (models.indexOf(prompts[currentPrompt].model) * 160) /
                    (models.length - 1)
                }`}
                stroke="url(#routeGradient)"
                strokeWidth="3"
                fill="none"
                className="transition-all duration-500 ease-in-out"
              />
            </svg>
          </div>
          <div className="flex flex-col space-y-4 ml-4">
            <div className="text-center p-4 border border-gray-300 rounded-lg">
              <Text strong className="text-sm block">
                Total Tokens
              </Text>
              <CountUp
                key={`tokens-${updateCounter}`}
                start={prevTokensRef.current}
                end={totalTokens}
                separator=","
                duration={2}
                className="block text-xl font-bold text-orange-500"
              />
            </div>
            <div className="text-center p-4 border border-gray-300 rounded-lg">
              <Text strong className="text-sm block">
                Total Saved
              </Text>
              <CountUp
                key={`saved-${updateCounter}`}
                start={prevSavedRef.current}
                end={totalSaved}
                separator=","
                decimals={2}
                prefix="$"
                duration={2}
                className="block text-xl font-bold text-green-500"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

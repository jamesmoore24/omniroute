import React, { useState, useEffect, useRef } from "react";
import { Typography } from "antd";
import CountUp from "react-countup";
import { useTypingEffect } from "./Helpers";
import { prompts, models } from "../data/aiData";

const { Text } = Typography;

export const LandingDemo = () => {
  const [totalTokens, setTotalTokens] = useState(0);
  const [totalSaved, setTotalSaved] = useState(0);
  const [currentPrompt, setCurrentPrompt] = useState(0);
  const prevTokensRef = useRef(0);
  const prevSavedRef = useRef(0);
  const [updateCounter, setUpdateCounter] = useState(0);

  const displayedOptimizedText = useTypingEffect(
    prompts[currentPrompt].optimized,
    30
  );

  const calculateTokens = (text: string) =>
    Math.round(text.split(/\s+/).length * 1.3);
  const calculateSaved = (tokens: number) => tokens * 0.007;

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
  }, []);

  interface Prompt {
    text: string;
    optimized: string;
    model: string;
  }

  interface PromptDisplayProps {
    prompts: Prompt[];
    currentPrompt: number;
    displayedOptimizedText: string;
  }

  const PromptDisplay: React.FC<PromptDisplayProps> = ({
    prompts,
    currentPrompt,
    displayedOptimizedText,
  }) => (
    <div className="w-full md:w-1/3 text-left mb-8 md:mb-0">
      <div className="space-y-4">
        {prompts.map((prompt, index) => (
          <div
            key={index}
            className={`transition-all duration-500 ${
              index === currentPrompt ? "opacity-100" : "opacity-0 hidden"
            }`}
          >
            <PromptBox
              title="Original Prompt"
              content={prompt.text}
              bgColor="bg-gray-200"
              textColor="text-gray-800"
            />
            <PromptBox
              title="Optimized Prompt"
              content={displayedOptimizedText}
              bgColor="bg-orange-500"
              textColor="text-white"
            />
          </div>
        ))}
      </div>
    </div>
  );

  interface PromptBoxProps {
    title: string;
    content: string;
    bgColor: string;
    textColor: string;
  }

  const PromptBox: React.FC<PromptBoxProps> = ({
    title,
    content,
    bgColor,
    textColor,
  }) => (
    <div className="mb-2">
      <span className="text-xs text-gray-500 mb-1 block">{title}</span>
      <div
        className={`${bgColor} ${textColor} p-3 rounded-lg rounded-tl-none inline-block w-full`}
      >
        <div className="text-left whitespace-pre-wrap break-words">
          {content}
        </div>
      </div>
    </div>
  );

  interface ModelVisualizationProps {
    models: string[];
    currentPrompt: number;
    prompts: Prompt[];
  }

  const ModelVisualization: React.FC<ModelVisualizationProps> = ({
    models,
    currentPrompt,
    prompts,
  }) => (
    <div className="relative w-full h-[200px]">
      <svg viewBox="0 0 300 200" className="w-full h-full">
        <defs>
          <linearGradient id="routeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
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
  );

  interface StatsDisplayProps {
    totalTokens: number;
    totalSaved: number;
    prevTokensRef: React.RefObject<number>;
    prevSavedRef: React.RefObject<number>;
    updateCounter: number;
  }

  const StatsDisplay: React.FC<StatsDisplayProps> = ({
    totalTokens,
    totalSaved,
    prevTokensRef,
    prevSavedRef,
    updateCounter,
  }) => (
    <div className="flex flex-col space-y-4 ml-4">
      <StatBox
        key={`tokens-${updateCounter}`}
        title="Total Tokens"
        value={totalTokens}
        startValue={prevTokensRef.current}
      />
      <StatBox
        key={`saved-${updateCounter}`}
        title="Total Saved"
        value={totalSaved}
        startValue={prevSavedRef.current}
        prefix="$"
        decimals={2}
      />
    </div>
  );

  interface StatBoxProps {
    title: string;
    value: number;
    startValue: number;
    prefix?: string;
    decimals?: number;
  }

  const StatBox: React.FC<StatBoxProps> = ({
    title,
    value,
    startValue,
    prefix = "",
    decimals = 0,
  }) => (
    <div className="text-center p-4 border border-gray-300 rounded-lg">
      <Text strong className="text-sm block">
        {title}
      </Text>
      <CountUp
        start={startValue}
        end={value}
        separator=","
        decimals={decimals}
        prefix={prefix}
        duration={2}
        className={`block text-xl font-bold ${
          title.includes("Tokens") ? "text-orange-500" : "text-green-500"
        }`}
      />
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto bg-white/10 backdrop-blur-md rounded-lg p-6 animate-fade-in-up animation-delay-800 border border-gray-200">
      <div className="flex flex-col md:flex-row justify-between items-start mb-8">
        <PromptDisplay
          prompts={prompts}
          currentPrompt={currentPrompt}
          displayedOptimizedText={displayedOptimizedText}
        />
        <div className="w-full md:w-2/3 flex justify-end items-center">
          <ModelVisualization
            models={models}
            currentPrompt={currentPrompt}
            prompts={prompts}
          />
          <StatsDisplay
            totalTokens={totalTokens}
            totalSaved={totalSaved}
            prevTokensRef={prevTokensRef}
            prevSavedRef={prevSavedRef}
            updateCounter={updateCounter}
          />
        </div>
      </div>
    </div>
  );
};

export default LandingDemo;

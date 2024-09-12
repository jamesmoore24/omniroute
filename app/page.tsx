"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import { Button, Input, Typography, Space, Tooltip } from "antd";
import { SendOutlined, LoadingOutlined } from "@ant-design/icons";
import { prompts, models } from "../data/aiData";
import CountUp from "react-countup";
import { message } from "antd";
import { useTypingEffect } from "../components/Helpers";
import { AnimatedGridBackground } from "../components/GridBackground";
import { Header } from "../components/Header";

const { Title, Paragraph, Text } = Typography;

const calculateTokens = (text: string) =>
  Math.round(text.split(/\s+/).length * 1.3);
const calculateSaved = (tokens: number) => tokens * 0.007;

export default function AiLandingPage() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [currentPrompt, setCurrentPrompt] = useState(0);
  const [totalTokens, setTotalTokens] = useState(0);
  const [totalSaved, setTotalSaved] = useState(0);
  const [isValidEmail, setIsValidEmail] = useState(false);
  const prevTokensRef = useRef(0);
  const prevSavedRef = useRef(0);
  const displayedOptimizedText = useTypingEffect(
    prompts[currentPrompt].optimized,
    30
  );

  const validateEmail = (email: string) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newEmail = e.target.value;
    setEmail(newEmail);
    setIsValidEmail(validateEmail(newEmail));
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentPrompt((prev) => {
        const next = (prev + 1) % prompts.length;
        const newTokens = calculateTokens(prompts[next].optimized);
        const newSaved = calculateSaved(newTokens);

        setTotalTokens((prevTokens) => {
          prevTokensRef.current = prevTokens;
          return prevTokens + newTokens;
        });

        setTotalSaved((prevSaved) => {
          prevSavedRef.current = prevSaved;
          return prevSaved + newSaved;
        });

        return next;
      });
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleSubmit = useCallback(async () => {
    if (!isValidEmail) {
      message.error("Please enter a valid email address");
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch("/api/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }), // Corrected to use the variable 'email'
      });

      console.log(response);

      if (response.ok) {
        message.success(
          "You have been added to the waitlist! Check your email for confirmation."
        );
        setEmail("");
      } else {
        throw new Error("Failed to sign up");
      }
    } catch (error) {
      message.error("An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }, [email, isValidEmail]);

  return (
    <div className="min-h-screen bg-white relative">
      <AnimatedGridBackground />
      <div className="relative z-10">
        <Header />

        <main className="container mx-auto px-4 py-8 text-center">
          <Title
            level={1}
            className="text-gray-800 text-5xl md:text-6xl font-extrabold mb-6 animate-fade-in-up"
          >
            <span className="text-gray-800">
              The unified LLM platform made just for you.
            </span>
          </Title>
          <Paragraph className="text-gray-700 text-xl md:text-2xl mb-12 max-w-2xl mx-auto animate-fade-in-up animation-delay-200">
            Pay-as-you-go, model routing, prompt optimization, context
            management, token tracking, customizability and more.
          </Paragraph>
          <Paragraph className="text-gray-700 text-xl md:text-2xl mb-12 max-w-2xl mx-auto animate-fade-in-up animation-delay-200">
            <strong>All in one API and native, lightweight application.</strong>
          </Paragraph>
          <Space
            direction="vertical"
            size="large"
            className="w-full max-w-md mx-auto mb-8 animate-fade-in-up animation-delay-400"
          >
            <Input
              size="large"
              placeholder="Enter your email"
              value={email}
              onChange={handleEmailChange}
              className="bg-white/20 text-gray-800 placeholder-gray-500 border-gray-300"
            />
            <Button
              type="primary"
              size="large"
              icon={isLoading ? <LoadingOutlined /> : <SendOutlined />}
              onClick={handleSubmit}
              loading={isLoading}
              disabled={!isValidEmail}
              className="w-full bg-orange-500 hover:bg-orange-600 border-none"
            >
              {isLoading ? "Please wait" : "Join the waitlist 🚀"}
            </Button>
          </Space>
          <Paragraph className="text-gray-600 text-sm animate-fade-in-up animation-delay-600 mb-8">
            Our mission is to make the premium LLM experience accessible to
            everyone.
          </Paragraph>
          <div className="max-w-4xl mx-auto bg-white/10 backdrop-blur-md rounded-lg p-6 animate-fade-in-up animation-delay-800 border border-gray-200">
            <div className="flex flex-col md:flex-row justify-between items-start mb-8">
              <div className="w-full md:w-1/3 text-left mb-8 md:mb-0">
                <div className="space-y-4">
                  {prompts.map((prompt, index) => (
                    <div
                      key={index}
                      className={`transition-all duration-500 ${
                        index === currentPrompt
                          ? "opacity-100"
                          : "opacity-0 hidden"
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
                        <div className="bg-orange-500 text-white p-3 rounded-lg rounded-tr-none inline-block w-full">
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
                        <stop
                          offset="0%"
                          stopColor="#F97316"
                          stopOpacity="0.2"
                        />
                        <stop
                          offset="100%"
                          stopColor="#F97316"
                          stopOpacity="1"
                        />
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
        </main>
      </div>
    </div>
  );
}

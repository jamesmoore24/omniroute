"use client";

import React, { useState, useCallback } from "react";
import { Button, Input, Typography, Space } from "antd";
import { SendOutlined, LoadingOutlined } from "@ant-design/icons";
import { message } from "antd";
import { AnimatedGridBackground } from "../components/GridBackground";
import { Header } from "../components/Header";
import { LandingDemo } from "../components/Landing/LandingDemo";

const { Title, Paragraph } = Typography;

export default function AiLandingPage() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isValidEmail, setIsValidEmail] = useState(false);

  const validateEmail = (email: string) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newEmail = e.target.value;
    setEmail(newEmail);
    setIsValidEmail(validateEmail(newEmail));
  };

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
        body: JSON.stringify({ email }),
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
          <LandingDemo />
        </main>
      </div>
    </div>
  );
}

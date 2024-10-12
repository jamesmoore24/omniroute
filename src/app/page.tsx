"use client";

import React from "react";
import { Button, Typography, Space } from "antd";
import { AnimatedGridBackground } from "../components/GridBackground";
import FundingLogos from "../components/Landing/SandboxLogo";
import { Header } from "../components/Header";
import { LandingDemo } from "../components/Landing/LandingDemo";
import { useRouter } from "next/navigation";
import { Rocket } from "lucide-react";

const { Title, Paragraph } = Typography;

export default function AiLandingPage() {
  const router = useRouter();

  const handleStartChatting = () => {
    router.push("/chat");
  };

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
            Optimize costs, maximize quality, and minimize latency with
            intelligent model routing and prompt optimization.
          </Paragraph>
          <Paragraph className="text-gray-700 text-xl md:text-2xl mb-12 max-w-2xl mx-auto animate-fade-in-up animation-delay-200">
            <strong>All in one API and lightweight application.</strong>
          </Paragraph>
          <Space
            direction="vertical"
            size="large"
            className="w-full max-w-md mx-auto mb-8 animate-fade-in-up animation-delay-400"
          >
            <div className="flex-1 flex items-center justify-center">
              <Button
                type="primary"
                size="large"
                onClick={handleStartChatting}
                className="bg-orange-500 hover:bg-orange-600 border-none text-white font-bold py-3 px-6 rounded-lg shadow-lg transition duration-300 ease-in-out transform hover:-translate-y-1 hover:scale-105"
              >
                Start chatting
                <Rocket className="h-5 w-5 mr-2" />
              </Button>
            </div>
          </Space>
          <Paragraph className="text-gray-600 text-sm animate-fade-in-up animation-delay-600 mb-8">
            Our mission is to make the premium LLM experience accessible to
            everyone.
          </Paragraph>
          <LandingDemo />
          <FundingLogos />
        </main>
      </div>
    </div>
  );
}

import React from "react";
import { GraduationCap } from "lucide-react";

export function Header() {
  return (
    <header className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-20 px-4">
      <div className="max-w-4xl mx-auto text-center">
        <div className="flex justify-center mb-6">
          <GraduationCap size={48} className="text-white" />
        </div>
        <h1 className="text-4xl md:text-5xl font-bold mb-6">
          Omniroute is now building next generation EdTech tools
        </h1>
        <p className="text-xl md:text-2xl text-blue-100 max-w-2xl mx-auto">
          We are dedicated to creating innovative educational tools for
          teachers, students, and schools.
        </p>
      </div>
    </header>
  );
}

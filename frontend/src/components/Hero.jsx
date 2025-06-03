import React from "react";
import { TypewriterEffectSmooth } from "@/components/ui/typewriter-effect";
import { Link } from "react-router-dom";

const Hero = () => {
  const words = [
    {
      text: "Easier",
    },
    {
      text: "workout",
    },
    {
      text: "routine",
    },
    {
      text: "with",
    },
    {
      text: "Gymness.",
      className: "text-blue-500 dark:text-blue-500",
    },
  ];
  return (
    <div className="flex flex-col items-center justify-center py-48">
      <p className="text-neutral-600 dark:text-neutral-200 sm:text-base  ">
        Your personal workout planner
      </p>
      <TypewriterEffectSmooth words={words} />
      <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 space-x-0 md:space-x-4">
        <Link to="/auth/login">
          <button className="w-40 h-10 rounded-xl bg-black border dark:border-white border-transparent text-white text-sm">
            Get Started
          </button>
        </Link>
      </div>
    </div>
  );
};

export default Hero;

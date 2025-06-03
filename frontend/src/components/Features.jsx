import React from "react";
import DisplayCards from "@/components/ui/display-cards";
import { Dumbbell, CalendarCheck, Flame } from "lucide-react";

const defaultCards = [
  {
    icon: <Dumbbell className="size-4 text-blue-400" />,
    title: "Create Workout Plan",
    description: "Create custom plans",
    date: "Just now",
    iconClassName: "text-blue-600",
    titleClassName: "text-blue-600",
    className:
      "[grid-area:stack] hover:-translate-y-10 before:absolute before:w-[100%] before:outline-1 before:rounded-xl before:outline-border before:h-[100%] before:content-[''] before:bg-blend-overlay before:bg-background/50 grayscale-[100%] hover:before:opacity-0 before:transition-opacity before:duration-700 hover:grayscale-0 before:left-0 before:top-0",
  },
  {
    icon: <CalendarCheck className="size-4 text-green-400" />,
    title: "Track Progress",
    description: "Track your sets, reps and pbs",
    date: "2 days ago",
    iconClassName: "text-green-600",
    titleClassName: "text-green-600",
    className:
      "[grid-area:stack] translate-x-12 translate-y-10 hover:-translate-y-1 before:absolute before:w-[100%] before:outline-1 before:rounded-xl before:outline-border before:h-[100%] before:content-[''] before:bg-blend-overlay before:bg-background/50 grayscale-[100%] hover:before:opacity-0 before:transition-opacity before:duration-700 hover:grayscale-0 before:left-0 before:top-0",
  },
  {
    icon: <Flame className="size-4 text-red-400" />,
    title: "Stay Consistent",
    description: "Hit your fitness goals",
    date: "Today",
    iconClassName: "text-red-600",
    titleClassName: "text-red-600",
    className:
      "[grid-area:stack] translate-x-24 translate-y-20 hover:translate-y-10",
  },
];

const Features = () => {
  return (
    <div className="flex w-full flex-col items-center justify-center mb-40 ">
      <h1 className="text-3xl lg:text-5xl font-bold text-center mb-20 text-foreground">
        Features
      </h1>
      <div className=" w-full max-w-3xl overflow-hidden lg:overflow-visible">
        <DisplayCards cards={defaultCards} />
      </div>
    </div>
  );
};

export default Features;

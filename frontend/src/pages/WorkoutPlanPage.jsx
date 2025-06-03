import React, { useEffect, useState } from "react";
import { Button } from "../components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FaCirclePlus } from "react-icons/fa6";
import WorkoutDayCard from "../components/WorkoutDayCard";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";

const WorkoutPlanPage = () => {
  const [workoutPlan, setWorkoutPlan] = useState({ name: "Loading..." });
  const [workoutDays, setWorkoutDays] = useState([]);
  const [name, setName] = useState("");
  const [day, setDay] = useState("Monday");
  const [muscleTrain, setMuscleTrain] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [open, setOpen] = useState(false);

  const { planId } = useParams();

  // Fetch workout plan details
  useEffect(() => {
    const getWorkoutPlan = async () => {
      try {
        const res = await fetch(`/api/workout-plans/${planId}`, {
          credentials: "include",
        });

        if (!res.ok) {
          throw new Error("Failed to fetch workout plan");
        }

        const data = await res.json(); // Add await here
        setWorkoutPlan(data); // Set data, not workoutPlan
      } catch (error) {
        console.error("Error fetching workout plan: ", error);
        toast.error("Failed to load workout plan");
      }
    };

    getWorkoutPlan();
  }, [planId]);

  // Fetch workout days
  useEffect(() => {
    const getWorkoutDays = async () => {
      try {
        const res = await fetch(`/api/workout-plans/${planId}/days`, {
          credentials: "include",
        });

        if (!res.ok) {
          throw new Error("Failed to fetch workout days");
        }

        const data = await res.json(); // Add await here
        setWorkoutDays(data); // Set data to workoutDays, not workoutPlan
      } catch (error) {
        console.error("Error fetching workout days: ", error);
        toast.error("Failed to load workout days");
      }
    };

    getWorkoutDays();
  }, [planId]);

  // Create new workout day
  const createWorkoutDay = async (e) => {
    e.preventDefault();

    // Form validation
    if (!name.trim() || !day || !muscleTrain.trim()) {
      toast.error("Please fill in all fields");
      return;
    }

    try {
      setIsSubmitting(true);

      const newDay = {
        name,
        day,
        muscleTrain,
      };

      const res = await fetch(`/api/workout-plans/${planId}/days`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newDay),
      });

      if (!res.ok) {
        throw new Error("Failed to create workout day");
      }

      const createdDay = await res.json();

      // Update local state with the new day
      setWorkoutDays([...workoutDays, createdDay]);

      // Reset form
      setName("");
      setDay("Monday");
      setMuscleTrain("");

      // Close dialog
      setOpen(false);

      toast.success("Workout day created successfully");
    } catch (error) {
      console.error("Error creating workout day:", error);
      toast.error("Failed to create workout day");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle workout day update
  const handleDayUpdate = (updatedDay) => {
    setWorkoutDays(
      workoutDays.map((day) => (day._id === updatedDay._id ? updatedDay : day))
    );
  };

  // Handle workout day deletion
  const handleDayDelete = (dayId) => {
    setWorkoutDays(workoutDays.filter((day) => day._id !== dayId));
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">{workoutPlan.name}</h1>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button>
              <FaCirclePlus className="mr-2" />
              Add Day
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <form onSubmit={createWorkoutDay}>
              <DialogHeader>
                <DialogTitle>Add Day</DialogTitle>
                <DialogDescription>
                  Add a new workout day. Click confirm when you're done.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="name" className="text-right">
                    Name
                  </Label>
                  <Input
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="col-span-3"
                    required
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="day" className="text-right">
                    Day
                  </Label>
                  <select
                    id="day"
                    value={day}
                    onChange={(e) => setDay(e.target.value)}
                    className="col-span-3 border border-input bg-background rounded-md px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-ring"
                    required
                  >
                    <option value="">Select a day</option>
                    <option>Monday</option>
                    <option>Tuesday</option>
                    <option>Wednesday</option>
                    <option>Thursday</option>
                    <option>Friday</option>
                    <option>Saturday</option>
                    <option>Sunday</option>
                  </select>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="muscleTrain" className="text-left">
                    Muscle Train
                  </Label>
                  <Input
                    id="muscleTrain"
                    value={muscleTrain}
                    onChange={(e) => setMuscleTrain(e.target.value)}
                    className="col-span-3"
                    required
                  />
                </div>
              </div>
              <DialogFooter>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? "Creating..." : "Confirm"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="space-y-4">
        {workoutDays.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-10 bg-muted/30 rounded-lg border-2 border-dashed border-muted-foreground/25 text-center">
            <div className="rounded-full bg-primary/10 p-3 mb-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-10 h-10 text-primary"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                />
              </svg>
            </div>
            <h3 className="text-xl font-medium mb-2">No Workout Days Yet</h3>
            <p className="text-muted-foreground max-w-sm mb-6">
              Start building your workout plan by adding your first workout day.
            </p>
            <Button onClick={() => setOpen(true)}>
              <FaCirclePlus className="mr-2" />
              Add Your First Day
            </Button>
          </div>
        ) : (
          workoutDays.map((day) => (
            <WorkoutDayCard
              key={day._id}
              day={day}
              planId={planId}
              onDayUpdated={handleDayUpdate}
              onDayDeleted={handleDayDelete}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default WorkoutPlanPage;

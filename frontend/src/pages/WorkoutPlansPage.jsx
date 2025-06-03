import React from "react";
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
import WorkoutPlanCard from "../components/WorkoutPlanCard";
import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const WorkoutPlansPage = () => {
  const [workoutPlans, setWorkoutPlans] = useState([]);
  const [name, setName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [open, setOpen] = useState(false);

  const navigate = useNavigate();

  const createWorkoutPlan = async (newWorkoutPlan) => {
    try {
      setIsSubmitting(true);
      const res = await fetch("/api/workout-plans/", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newWorkoutPlan),
      });

      if (!res.ok) {
        throw new Error("Failed to create workout plan");
      }

      const data = await res.json();

      // Add the new plan to the state
      setWorkoutPlans([...workoutPlans, data]);

      // Show success message
      toast.success("Workout plan created successfully");

      // Close the dialog
      setOpen(false);

      // Reset form
      setName("");

      return data;
    } catch (error) {
      console.error("Error creating new workout plan: ", error);
      toast.error("Error creating new workout plan");
      throw error;
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle workout plan update
  const handlePlanUpdate = (updatedPlan) => {
    setWorkoutPlans(
      workoutPlans.map((plan) =>
        plan._id === updatedPlan._id ? updatedPlan : plan
      )
    );
  };

  // Handle workout plan deletion
  const handlePlanDelete = (planId) => {
    setWorkoutPlans(workoutPlans.filter((plan) => plan._id !== planId));
  };

  const submitForm = async (e) => {
    e.preventDefault();

    if (!name.trim()) {
      toast.error("Please enter a plan name");
      return;
    }

    try {
      await createWorkoutPlan({ name });
    } catch (error) {
      // Error already handled in createWorkoutPlan
    }
  };

  useEffect(() => {
    const getAllWorkoutPlans = async () => {
      try {
        const res = await fetch("/api/workout-plans/", {
          method: "GET",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
        });

        const data = await res.json();
        console.log("API response data:", data);
        setWorkoutPlans(data);
      } catch (error) {
        console.log("Error fetching data: ", error);
        toast.error("Failed to load workout plans");
      }
    };

    getAllWorkoutPlans();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Workout Plans</h1>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button>
              <FaCirclePlus className="mr-2" />
              Add Plan
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <form onSubmit={submitForm}>
              <DialogHeader>
                <DialogTitle>Add Plan</DialogTitle>
                <DialogDescription>
                  Add new workout plan. Click confirm when you're done.
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
        {workoutPlans.length === 0 ? (
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
                  d="M13 10V3L4 14h7v7l9-11h-7z"
                />
              </svg>
            </div>
            <h3 className="text-xl font-medium mb-2">No Workout Plans Yet</h3>
            <p className="text-muted-foreground max-w-sm mb-6">
              Get started on your fitness journey by creating your first workout
              plan.
            </p>
            <Dialog open={open} onOpenChange={setOpen}>
              <DialogTrigger asChild>
                <Button>
                  <FaCirclePlus className="mr-2" />
                  Create Your First Plan
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <form onSubmit={submitForm}>
                  <DialogHeader>
                    <DialogTitle>Add Plan</DialogTitle>
                    <DialogDescription>
                      Add new workout plan. Click confirm when you're done.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="plan-name" className="text-right">
                        Name
                      </Label>
                      <Input
                        id="plan-name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
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
        ) : (
          workoutPlans.map((plan) => (
            <WorkoutPlanCard
              key={plan._id}
              plan={plan}
              onPlanUpdated={handlePlanUpdate}
              onPlanDeleted={handlePlanDelete}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default WorkoutPlansPage;

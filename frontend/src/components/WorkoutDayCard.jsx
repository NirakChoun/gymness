import React from "react";
import { Link } from "react-router-dom";
import { FaPenToSquare, FaRegTrashCan } from "react-icons/fa6";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { toast } from "react-toastify";

const WorkoutDayCard = ({ day, planId, onDayUpdated, onDayDeleted }) => {
  const [name, setName] = useState(day.name);
  const [selectedDay, setSelectedDay] = useState(day.day);
  const [muscleTrain, setMuscleTrain] = useState(day.muscleTrain);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  // Edit workout day
  const editWorkoutDay = async () => {
    if (!name.trim() || !selectedDay || !muscleTrain.trim()) {
      toast.error("Please fill in all fields");
      return;
    }

    try {
      setIsSubmitting(true);
      const res = await fetch(`/api/workout-plans/${planId}/days/${day._id}`, {
        method: "PUT",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          day: selectedDay,
          muscleTrain,
        }),
      });

      if (!res.ok) {
        throw new Error("Failed to update workout day");
      }

      const updatedDay = await res.json();

      // Close dialog
      setEditDialogOpen(false);

      // Show success message
      toast.success("Workout day updated successfully");

      // Update parent component if callback provided
      if (onDayUpdated) {
        onDayUpdated(updatedDay);
      }

      return updatedDay;
    } catch (error) {
      console.error("Error updating workout day:", error);
      toast.error("Failed to update workout day");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Delete workout day
  const deleteWorkoutDay = async () => {
    try {
      setIsDeleting(true);
      const res = await fetch(`/api/workout-plans/${planId}/days/${day._id}`, {
        method: "DELETE",
        credentials: "include",
      });

      if (!res.ok) {
        throw new Error("Failed to delete workout day");
      }

      // Close dialog
      setDeleteDialogOpen(false);

      // Show success message
      toast.success("Workout day deleted successfully");

      // Update parent component if callback provided
      if (onDayDeleted) {
        onDayDeleted(day._id);
      }
    } catch (error) {
      console.error("Error deleting workout day:", error);
      toast.error("Failed to delete workout day");
    } finally {
      setIsDeleting(false);
    }
  };

  // Form submission handler
  const submitForm = (e) => {
    e.preventDefault();
    editWorkoutDay();
  };

  return (
    <div className="border rounded-xl p-4 bg-muted shadow-sm hover:shadow transition group">
      <div className="flex items-center justify-between">
        {/* Link wrapper */}
        <Link to={`/plans/${planId}/day/${day._id}`}>
          <div>
            <h2 className="text-lg font-semibold mb-1">{day.name}</h2>
            <p className="text-sm text-muted-foreground mb-0.5">
              Day: <span className="font-medium">{day.day}</span>
            </p>
            <p className="text-sm text-muted-foreground">
              Muscle: <span className="font-medium">{day.muscleTrain}</span>
            </p>
          </div>
        </Link>

        <div className="flex gap-3 hidden group-hover:flex">
          {/* Edit Dialog */}
          <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm">
                <FaPenToSquare />
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <form onSubmit={submitForm}>
                <DialogHeader>
                  <DialogTitle>Edit Workout Day</DialogTitle>
                  <DialogDescription>
                    Update this workout day's details.
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
                      value={selectedDay}
                      onChange={(e) => setSelectedDay(e.target.value)}
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
                    <Label htmlFor="muscleTrain" className="text-right">
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
                    {isSubmitting ? "Saving..." : "Save changes"}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>

          {/* Delete Dialog */}
          <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="destructive" size="sm">
                <FaRegTrashCan />
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[400px]">
              <DialogHeader>
                <DialogTitle>Delete "{day.name}"?</DialogTitle>
                <DialogDescription>
                  This action cannot be undone.
                </DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => setDeleteDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  variant="destructive"
                  onClick={deleteWorkoutDay}
                  disabled={isDeleting}
                >
                  {isDeleting ? "Deleting..." : "Delete"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </div>
  );
};

export default WorkoutDayCard;

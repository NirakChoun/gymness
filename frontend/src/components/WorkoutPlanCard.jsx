import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
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
import { toast } from "react-toastify";

const WorkoutPlanCard = ({ plan, onPlanUpdated, onPlanDeleted }) => {
  const navigate = useNavigate();
  const [name, setName] = useState(plan.name);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  // Edit workout plan
  const editWorkoutPlan = async () => {
    if (!name.trim()) {
      toast.error("Plan name cannot be empty");
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch(`/api/workout-plans/${plan._id}`, {
        method: "PUT",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name }),
      });

      if (!res.ok) {
        throw new Error("Failed to update workout plan");
      }

      const updatedPlan = await res.json();

      // Close dialog
      setEditDialogOpen(false);

      // Show success message
      toast.success("Workout plan updated successfully");

      // Call parent update handler if provided
      if (onPlanUpdated) {
        onPlanUpdated(updatedPlan);
      }

      return updatedPlan;
    } catch (error) {
      console.error("Error updating workout plan:", error);
      toast.error("Failed to update workout plan");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Delete workout plan
  const deleteWorkoutPlan = async () => {
    setIsDeleting(true);
    try {
      const res = await fetch(`/api/workout-plans/${plan._id}`, {
        method: "DELETE",
        credentials: "include",
      });

      if (!res.ok) {
        throw new Error("Failed to delete workout plan");
      }

      // Close dialog
      setDeleteDialogOpen(false);

      // Show success message
      toast.success("Workout plan deleted successfully");

      // Call parent delete handler if provided
      if (onPlanDeleted) {
        onPlanDeleted(plan._id);
      }
    } catch (error) {
      console.error("Error deleting workout plan:", error);
      toast.error("Failed to delete workout plan");
    } finally {
      setIsDeleting(false);
    }
  };

  // Edit form submit handler
  const submitEditForm = (e) => {
    e.preventDefault();
    editWorkoutPlan();
  };

  return (
    <div className="border rounded-xl p-4 bg-muted shadow-sm hover:shadow transition flex items-center justify-between group">
      <Link
        to={`/plans/${plan._id}`}
        className="text-lg font-semibold block mb-2"
      >
        {plan.name}
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
            <form onSubmit={submitEditForm}>
              <DialogHeader>
                <DialogTitle>Edit Workout Plan</DialogTitle>
                <DialogDescription>Update your plan name.</DialogDescription>
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
              <DialogTitle>Delete "{plan.name}"?</DialogTitle>
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
                onClick={deleteWorkoutPlan}
                disabled={isDeleting}
              >
                {isDeleting ? "Deleting..." : "Delete"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default WorkoutPlanCard;

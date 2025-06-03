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
import { FaCirclePlus, FaPenToSquare, FaTrash } from "react-icons/fa6";
import { useParams } from "react-router-dom";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { toast } from "react-toastify";

const WorkoutDayPage = () => {
  // Exercise list state
  const [exercises, setExercises] = useState([]);
  const [workoutDay, setWorkoutDay] = useState({ name: "", muscleTrain: "" });

  // Dialog visibility states
  const [selectedExercise, setSelectedExercise] = useState(null);
  const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  // Exercise form state for add/edit
  const [editedExercise, setEditedExercise] = useState(null);
  const [newExerciseForm, setNewExerciseForm] = useState({
    name: "",
    sets: "",
    reps: "",
    weight: "",
    restTime: "",
    notes: "",
  });

  // Loading states
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const { planId, dayId } = useParams();

  // Fetch workout day details
  useEffect(() => {
    const getWorkoutDay = async () => {
      try {
        const res = await fetch(`/api/workout-plans/${planId}/days/${dayId}`, {
          credentials: "include",
        });

        if (!res.ok) {
          throw new Error("Failed to fetch workout day");
        }

        const data = await res.json();
        setWorkoutDay(data);
      } catch (error) {
        console.error("Error fetching workout day:", error);
        toast.error("Failed to load workout day");
      }
    };

    getWorkoutDay();
  }, [planId, dayId]);

  // Fetch all exercises
  useEffect(() => {
    const getAllExercises = async () => {
      try {
        const res = await fetch(
          `/api/workout-plans/${planId}/days/${dayId}/exercises`,
          {
            credentials: "include",
          }
        );

        if (!res.ok) {
          throw new Error("Failed to fetch exercises");
        }

        const data = await res.json();
        setExercises(data);
      } catch (error) {
        console.error("Error fetching exercises:", error);
        toast.error("Failed to load exercises");
      }
    };

    getAllExercises();
  }, [planId, dayId]);

  // Handle input change for new exercise form
  const handleNewExerciseChange = (e) => {
    const { id, value } = e.target;
    setNewExerciseForm({
      ...newExerciseForm,
      [id]: value,
    });
  };

  // Handle input change for edit exercise form
  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setEditedExercise({
      ...editedExercise,
      [id]: value,
    });
  };

  // Create a new exercise
  const createExercise = async (e) => {
    e.preventDefault();

    // Form validation
    if (
      !newExerciseForm.name ||
      !newExerciseForm.sets ||
      !newExerciseForm.reps
    ) {
      toast.error("Name, sets, and reps are required");
      return;
    }

    try {
      setIsSubmitting(true);
      const res = await fetch(
        `/api/workout-plans/${planId}/days/${dayId}/exercises`,
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(newExerciseForm),
        }
      );

      if (!res.ok) {
        throw new Error("Failed to create exercise");
      }

      const newExercise = await res.json();

      // Add the new exercise to the list
      setExercises([...exercises, newExercise]);

      // Reset form and close dialog
      setNewExerciseForm({
        name: "",
        sets: "",
        reps: "",
        weight: "",
        restTime: "",
        notes: "",
      });
      setIsAddDialogOpen(false);

      toast.success("Exercise created successfully");
    } catch (error) {
      console.error("Error creating exercise:", error);
      toast.error("Failed to create exercise");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Edit an exercise
  const editExercise = async () => {
    if (!editedExercise) return;

    if (!editedExercise.name || !editedExercise.sets || !editedExercise.reps) {
      toast.error("Name, sets, and reps are required");
      return;
    }

    try {
      setIsSubmitting(true);
      const res = await fetch(
        `/api/workout-plans/${planId}/days/${dayId}/exercises/${editedExercise._id}`,
        {
          method: "PUT",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(editedExercise),
        }
      );

      if (!res.ok) {
        throw new Error("Failed to update exercise");
      }

      const updatedExercise = await res.json();

      // Update the exercise in the list
      setExercises(
        exercises.map((exercise) =>
          exercise._id === updatedExercise._id ? updatedExercise : exercise
        )
      );

      // Close dialog and reset state
      setIsEditDialogOpen(false);
      setSelectedExercise(updatedExercise);

      toast.success("Exercise updated successfully");
    } catch (error) {
      console.error("Error updating exercise:", error);
      toast.error("Failed to update exercise");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Delete an exercise
  const deleteExercise = async () => {
    if (!selectedExercise) return;

    try {
      setIsDeleting(true);
      const res = await fetch(
        `/api/workout-plans/${planId}/days/${dayId}/exercises/${selectedExercise._id}`,
        {
          method: "DELETE",
          credentials: "include",
        }
      );

      if (!res.ok) {
        throw new Error("Failed to delete exercise");
      }

      // Remove the exercise from the list
      setExercises(
        exercises.filter((exercise) => exercise._id !== selectedExercise._id)
      );

      // Close dialog and reset state
      setIsDetailsDialogOpen(false);
      setSelectedExercise(null);

      toast.success("Exercise deleted successfully");
    } catch (error) {
      console.error("Error deleting exercise:", error);
      toast.error("Failed to delete exercise");
    } finally {
      setIsDeleting(false);
    }
  };

  // Handle clicking on an exercise row
  const handleExerciseClick = (exercise) => {
    setSelectedExercise(exercise);
    setIsDetailsDialogOpen(true);
  };

  // Handle clicking the edit button in details dialog
  const handleEditExercise = () => {
    setEditedExercise({ ...selectedExercise });
    setIsDetailsDialogOpen(false);
    setIsEditDialogOpen(true);
  };

  // Handle clicking the delete button in details dialog
  const handleDeleteExercise = () => {
    deleteExercise();
  };

  // Handle saving edited exercise
  const handleSaveEdit = () => {
    editExercise();
  };

  // Submit form for new exercise
  const submitForm = (e) => {
    createExercise(e);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">
          {workoutDay.name} ({workoutDay.muscleTrain})
        </h1>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <FaCirclePlus className="mr-2" />
              Add Exercise
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <form onSubmit={submitForm}>
              <DialogHeader>
                <DialogTitle>Exercise</DialogTitle>
                <DialogDescription>
                  Add a new exercise. Click confirm when you're done.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="name" className="text-right">
                    Name
                  </Label>
                  <Input
                    id="name"
                    value={newExerciseForm.name}
                    onChange={handleNewExerciseChange}
                    className="col-span-3"
                    required
                  />
                </div>

                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="sets" className="text-left">
                    Sets
                  </Label>
                  <Input
                    id="sets"
                    value={newExerciseForm.sets}
                    onChange={handleNewExerciseChange}
                    className="col-span-3"
                    required
                    type="number"
                  />
                </div>

                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="reps" className="text-left">
                    Reps
                  </Label>
                  <Input
                    id="reps"
                    value={newExerciseForm.reps}
                    onChange={handleNewExerciseChange}
                    className="col-span-3"
                    required
                    type="number"
                  />
                </div>

                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="weight" className="text-left">
                    Weight
                  </Label>
                  <Input
                    id="weight"
                    value={newExerciseForm.weight}
                    onChange={handleNewExerciseChange}
                    className="col-span-3"
                    type="number"
                  />
                </div>

                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="restTime" className="text-left">
                    Rest Time
                  </Label>
                  <Input
                    id="restTime"
                    value={newExerciseForm.restTime}
                    onChange={handleNewExerciseChange}
                    className="col-span-3"
                  />
                </div>

                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="notes" className="text-left">
                    Notes
                  </Label>
                  <Input
                    id="notes"
                    value={newExerciseForm.notes}
                    onChange={handleNewExerciseChange}
                    className="col-span-3"
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

      {/* Exercise Table */}
      <div className="mt-6 rounded-md border">
        {exercises.length === 0 ? (
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
                  d="M4 8h16M4 16h16"
                />
              </svg>
            </div>
            <h3 className="text-xl font-medium mb-2">No Exercises Yet</h3>
            <p className="text-muted-foreground max-w-sm mb-6">
              Start building your workout by adding your first exercise.
            </p>
            <Button onClick={() => setIsAddDialogOpen(true)}>
              <FaCirclePlus className="mr-2" />
              Add Your First Exercise
            </Button>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[200px]">Name</TableHead>
                <TableHead className="text-center">Sets</TableHead>
                <TableHead className="text-center">Reps</TableHead>
                <TableHead className="hidden md:table-cell text-center">
                  Weight
                </TableHead>
                <TableHead className="hidden md:table-cell text-center">
                  Rest Time
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {exercises.map((exercise) => (
                <TableRow
                  key={exercise._id}
                  onClick={() => handleExerciseClick(exercise)}
                  className="cursor-pointer hover:bg-muted"
                >
                  <TableCell className="font-medium">{exercise.name}</TableCell>
                  <TableCell className="text-center">{exercise.sets}</TableCell>
                  <TableCell className="text-center">{exercise.reps}</TableCell>
                  <TableCell className="hidden md:table-cell text-center">
                    {exercise.weight}
                  </TableCell>
                  <TableCell className="hidden md:table-cell text-center">
                    {exercise.restTime}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>

      {/* Exercise Details Dialog */}
      <Dialog open={isDetailsDialogOpen} onOpenChange={setIsDetailsDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{selectedExercise?.name}</DialogTitle>
            <DialogDescription>Exercise details</DialogDescription>
          </DialogHeader>

          {selectedExercise && (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-3 items-center gap-4">
                <Label className="text-right font-medium">Sets:</Label>
                <div className="col-span-2">{selectedExercise.sets}</div>
              </div>

              <div className="grid grid-cols-3 items-center gap-4">
                <Label className="text-right font-medium">Reps:</Label>
                <div className="col-span-2">{selectedExercise.reps}</div>
              </div>

              <div className="grid grid-cols-3 items-center gap-4">
                <Label className="text-right font-medium">Weight:</Label>
                <div className="col-span-2">
                  {selectedExercise.weight || "Not specified"}
                </div>
              </div>

              <div className="grid grid-cols-3 items-center gap-4">
                <Label className="text-right font-medium">Rest Time:</Label>
                <div className="col-span-2">
                  {selectedExercise.restTime || "Not specified"}
                </div>
              </div>

              {selectedExercise.notes && (
                <div className="grid grid-cols-3 items-center gap-4">
                  <Label className="text-right font-medium">Notes:</Label>
                  <div className="col-span-2">{selectedExercise.notes}</div>
                </div>
              )}
            </div>
          )}

          <DialogFooter className="flex justify-between">
            <Button
              variant="destructive"
              onClick={handleDeleteExercise}
              disabled={isDeleting}
            >
              <FaTrash className="mr-2" />{" "}
              {isDeleting ? "Deleting..." : "Delete"}
            </Button>
            <Button onClick={handleEditExercise}>
              <FaPenToSquare className="mr-2" /> Edit
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Exercise Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit Exercise</DialogTitle>
            <DialogDescription>
              Make changes to the exercise details
            </DialogDescription>
          </DialogHeader>

          {editedExercise && (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">
                  Name
                </Label>
                <Input
                  id="name"
                  className="col-span-3"
                  required
                  value={editedExercise.name}
                  onChange={handleInputChange}
                />
              </div>

              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="sets" className="text-left">
                  Sets
                </Label>
                <Input
                  id="sets"
                  className="col-span-3"
                  required
                  type="number"
                  value={editedExercise.sets}
                  onChange={handleInputChange}
                />
              </div>

              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="reps" className="text-left">
                  Reps
                </Label>
                <Input
                  id="reps"
                  className="col-span-3"
                  required
                  type="number"
                  value={editedExercise.reps}
                  onChange={handleInputChange}
                />
              </div>

              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="weight" className="text-left">
                  Weight
                </Label>
                <Input
                  id="weight"
                  className="col-span-3"
                  type="number"
                  value={editedExercise.weight}
                  onChange={handleInputChange}
                />
              </div>

              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="restTime" className="text-left">
                  Rest Time
                </Label>
                <Input
                  id="restTime"
                  className="col-span-3"
                  value={editedExercise.restTime}
                  onChange={handleInputChange}
                />
              </div>

              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="notes" className="text-left">
                  Notes
                </Label>
                <Input
                  id="notes"
                  className="col-span-3"
                  value={editedExercise.notes}
                  onChange={handleInputChange}
                />
              </div>
            </div>
          )}

          <DialogFooter className="flex justify-between">
            <Button
              variant="outline"
              onClick={() => setIsEditDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button onClick={handleSaveEdit} disabled={isSubmitting}>
              {isSubmitting ? "Saving..." : "Save Changes"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default WorkoutDayPage;

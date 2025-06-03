import Exercise from "../models/exercise.model.js";
import asyncHandler from "express-async-handler";

const getAllExercises = asyncHandler(async (req, res) => {
  const exercises = await Exercise.find({
    workoutDay: req.params.dayId,
  });

  res.status(200).json(exercises);
});

const createExercise = asyncHandler(async (req, res) => {
  const { name, sets, reps, weight, restTime, notes } = req.body;

  if (!name || !sets || !reps) {
    const error = new Error("These fields are required: name, sets, reps");
    error.statusCode = 400;
    throw error;
  }

  const newExercise = await Exercise.create({
    workoutDay: req.params.dayId,
    name,
    sets,
    reps,
    weight,
    restTime,
    notes,
  });

  res.status(201).json(newExercise);
});

const updateExercise = asyncHandler(async (req, res) => {
  const { name, sets, reps, weight, restTime, notes } = req.body;

  const exercise = await Exercise.findById(req.params.exerciseId).populate({
    path: "workoutDay",
    populate: {
      path: "plan",
      model: "WorkoutPlan",
    },
  });

  if (!exercise) {
    const error = new Error("Workout day not found");
    error.statusCode = 404;
    throw error;
  }

  if (exercise.workoutDay.plan.user.toString() !== req.user._id.toString()) {
    const error = new Error("Not authorized to update this exercise");
    error.statusCode = 403;
    throw error;
  }

  if (name !== undefined) exercise.name = name;
  if (sets !== undefined) exercise.sets = sets;
  if (reps !== undefined) exercise.reps = reps;
  if (weight !== undefined) exercise.weight = weight;
  if (restTime !== undefined) exercise.restTime = restTime;
  if (notes !== undefined) exercise.notes = notes;

  await exercise.save();

  res.status(200).json(exercise);
});

const deleteExercise = asyncHandler(async (req, res) => {
  const exercise = await Exercise.findById(req.params.exerciseId).populate({
    path: "workoutDay",
    populate: {
      path: "plan",
      model: "WorkoutPlan",
    },
  });

  if (!exercise) {
    const error = new Error("Exercise not found");
    error.statusCode = 404;
    throw error;
  }

  if (exercise.workoutDay.plan.user.toString() !== req.user._id.toString()) {
    const error = new Error("Not authorized to delete this exercise");
    error.statusCode = 403;
    throw error;
  }

  await exercise.deleteOne();

  res.status(200).json({ message: "Exercise day deleted successfully" });
});

export { getAllExercises, createExercise, updateExercise, deleteExercise };

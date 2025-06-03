import asyncHandler from "express-async-handler";
import WorkoutDay from "../models/workoutday.model.js";

const getAllWorkoutDays = asyncHandler(async (req, res) => {
  const workoutDays = await WorkoutDay.find({
    plan: req.params.planId,
  });

  res.status(200).json(workoutDays);
});

const getWorkoutDay = asyncHandler(async (req, res) => {
  const workoutDay = await WorkoutDay.findById(req.params.dayId).populate(
    "plan"
  );
  console.log(workoutDay);

  if (!workoutDay) {
    const error = new Error("Workout day not found");
    error.statusCode = 404;
    throw error;
  }

  if (workoutDay.plan.user.toString() !== req.user._id.toString()) {
    const error = new Error("Not authorized to access this workout day");
    error.statusCode = 403;
    throw error;
  }

  res.status(200).json(workoutDay);
});

const createWorkoutDay = asyncHandler(async (req, res) => {
  const { name, day, muscleTrain } = req.body;

  if (!day) {
    const error = new Error("Day is required");
    error.statusCode = 400;
    throw error;
  }

  const newWorkoutDay = await WorkoutDay.create({
    plan: req.params.planId,
    name,
    day,
    muscleTrain,
  });

  res.status(201).json(newWorkoutDay);
});

const updateWorkoutDay = asyncHandler(async (req, res) => {
  const { name, day, muscleTrain } = req.body;

  const workoutDay = await WorkoutDay.findById(req.params.dayId).populate(
    "plan"
  );

  if (!workoutDay) {
    const error = new Error("Workout day not found");
    error.statusCode = 404;
    throw error;
  }

  if (workoutDay.plan.user.toString() !== req.user._id.toString()) {
    const error = new Error("Not authorized to access this workout day");
    error.statusCode = 403;
    throw error;
  }

  if (name !== undefined) workoutDay.name = name;
  if (day !== undefined) workoutDay.day = day;
  if (muscleTrain !== undefined) workoutDay.muscleTrain = muscleTrain;

  await workoutDay.save();

  res.status(200).json(workoutDay);
});

const deleteWorkoutDay = asyncHandler(async (req, res) => {
  const workoutDay = await WorkoutDay.findById(req.params.dayId).populate(
    "plan"
  );

  if (!workoutDay) {
    const error = new Error("Workout day not found");
    error.statusCode = 404;
    throw error;
  }

  if (workoutDay.plan.user.toString() !== req.user._id.toString()) {
    const error = new Error("Not authorized to access this workout day");
    error.statusCode = 403;
    throw error;
  }

  await workoutDay.deleteOne();

  res.status(200).json({ message: "Workout day deleted successfully" });
});

export {
  getAllWorkoutDays,
  getWorkoutDay,
  createWorkoutDay,
  updateWorkoutDay,
  deleteWorkoutDay,
};

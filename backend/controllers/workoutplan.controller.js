import asyncHandler from "express-async-handler";
import WorkoutPlan from "../models/workoutplan.model.js";

const getAllWorkoutPlans = asyncHandler(async (req, res) => {
  const workoutPlans = await WorkoutPlan.find({
    user: req.user._id,
  });

  res.status(200).json(workoutPlans);
});

const getWorkoutPlan = asyncHandler(async (req, res) => {
  const workoutPlan = await WorkoutPlan.findById(req.params.planId);
  console.log(req.user._id);

  if (!workoutPlan) {
    const error = new Error("Workout plan not found");
    error.statusCode = 404;
    throw error;
  }

  if (workoutPlan.user.toString() !== req.user._id.toString()) {
    const error = new Error("Not authorized to access this workout plan");
    error.statusCode = 403;
    throw new error();
  }

  res.status(200).json(workoutPlan);
});

const createWorkoutPlan = asyncHandler(async (req, res) => {
  const { name } = req.body;

  if (!name) {
    const error = new Error("Workout plan name is required");
    error.statusCode = 400;
    throw error;
  }

  // Check if existing plan exists
  const existingPlan = await WorkoutPlan.findOne({ user: req.user._id, name });

  if (existingPlan) {
    const error = new Error("Workout plan with this name already exists");
    error.statusCode = 409;
    throw error;
  }

  const newWorkoutPlan = await WorkoutPlan.create({
    user: req.user._id,
    name,
  });

  res.status(201).json(newWorkoutPlan);
});

const updateWorkoutPlan = asyncHandler(async (req, res) => {
  const { name } = req.body;

  const workoutPlan = await WorkoutPlan.findById(req.params.planId);

  if (!workoutPlan) {
    const error = new Error("Workout plan not found");
    error.statusCode = 404;
    throw error;
  }

  if (workoutPlan.user.toString() !== req.user._id.toString()) {
    const error = new Error("Not authorized to access this workout plan");
    error.statusCode = 403;
    throw error;
  }

  if (name !== undefined) {
    workoutPlan.name = name;
  }

  await workoutPlan.save();

  res.status(200).json(workoutPlan);
});

const deleteWorkoutPlan = asyncHandler(async (req, res) => {
  const workoutPlan = await WorkoutPlan.findById(req.params.planId);

  if (!workoutPlan) {
    const error = new Error("Workout plan not found");
    error.statusCode = 404;
    throw error;
  }

  if (workoutPlan.user.toString() !== req.user._id.toString()) {
    const error = new Error("Not authorized to access this workout plan");
    error.statusCode = 403;
    throw error;
  }

  await workoutPlan.deleteOne();

  res.status(200).json({ message: "Workout plan deleted successfully" });
});

export {
  getAllWorkoutPlans,
  getWorkoutPlan,
  createWorkoutPlan,
  updateWorkoutPlan,
  deleteWorkoutPlan,
};

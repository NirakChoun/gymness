import { Router } from "express";
import { protect } from "../middlewares/auth.middleware.js";
import {
  getAllWorkoutPlans,
  getWorkoutPlan,
  createWorkoutPlan,
  updateWorkoutPlan,
  deleteWorkoutPlan,
} from "../controllers/workoutplan.controller.js";
import {
  createWorkoutDay,
  deleteWorkoutDay,
  getAllWorkoutDays,
  getWorkoutDay,
  updateWorkoutDay,
} from "../controllers/workoutday.controller.js";
import {
  createExercise,
  deleteExercise,
  getAllExercises,
  updateExercise,
} from "../controllers/exercise.controller.js";

const workoutPlanRouter = Router();

// Workout Plans
workoutPlanRouter.get("/", protect, getAllWorkoutPlans);

workoutPlanRouter.get("/:planId", protect, getWorkoutPlan);

workoutPlanRouter.post("/", protect, createWorkoutPlan);

workoutPlanRouter.put("/:planId", protect, updateWorkoutPlan);

workoutPlanRouter.delete("/:planId", protect, deleteWorkoutPlan);

// Workout Days
workoutPlanRouter.get("/:planId/days", protect, getAllWorkoutDays);

workoutPlanRouter.get("/:planId/days/:dayId", protect, getWorkoutDay);

workoutPlanRouter.post("/:planId/days", protect, createWorkoutDay);

workoutPlanRouter.put("/:planId/days/:dayId", protect, updateWorkoutDay);

workoutPlanRouter.delete("/:planId/days/:dayId", protect, deleteWorkoutDay);

// Exercises
workoutPlanRouter.get(
  "/:planId/days/:dayId/exercises",
  protect,
  getAllExercises
);

workoutPlanRouter.post(
  "/:planId/days/:dayId/exercises",
  protect,
  createExercise
);

workoutPlanRouter.put(
  "/:planId/days/:dayId/exercises/:exerciseId",
  protect,
  updateExercise
);

workoutPlanRouter.delete(
  "/:planId/days/:dayId/exercises/:exerciseId",
  protect,
  deleteExercise
);

export default workoutPlanRouter;

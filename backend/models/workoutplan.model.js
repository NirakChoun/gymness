import { Schema, model } from "mongoose";

const workoutPlanSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const WorkoutPlan = model("WorkoutPlan", workoutPlanSchema);

export default WorkoutPlan;

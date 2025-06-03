import { Schema, model } from "mongoose";

const workoutDaySchema = new Schema(
  {
    plan: {
      type: Schema.Types.ObjectId,
      ref: "WorkoutPlan",
      required: true,
    },
    name: {
      type: String,
      default: "",
    },
    day: {
      type: String,
      required: true,
      enum: [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
        "Sunday",
      ],
    },
    muscleTrain: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

// Prevent duplicate days in the same plan
workoutDaySchema.index({ plan: 1, day: 1 }, { unique: true });

const WorkoutDay = model("WorkoutDay", workoutDaySchema);

export default WorkoutDay;

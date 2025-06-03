import { Schema, model } from "mongoose";

const exerciseSchema = new Schema(
  {
    workoutDay: {
      type: Schema.Types.ObjectId,
      ref: "WorkoutDay",
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    sets: {
      type: Number,
      required: true,
      min: 1,
    },
    reps: {
      type: Number,
      required: true,
      min: 1,
    },
    weight: {
      type: Number,
      default: 0,
      min: 0,
    },
    restTime: {
      type: Number,
      default: 0,
      min: 0,
    },
    notes: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

const Exercise = model("Exercise", exerciseSchema);

export default Exercise;

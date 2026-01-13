import mongoose from "mongoose";

const sessionSchema = new mongoose.Schema(
  {
    problem: {
      type: String,
      required: true,
    },
    difficulty: {
      type: String,
      enum: ["Easy", "Medium", "Hard"],
      required: true,
    },
    host: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    participants: {
      type: mongoose.Schema.Types.Mixed, // Can store various data types
      default: null,
      ref: "User",
    },
    status: {
      type: String,
      enum: ["active", "Completed"],
      default: "active",
    },
    callId: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Session = mongoose.model("Session", sessionSchema);
export default Session;

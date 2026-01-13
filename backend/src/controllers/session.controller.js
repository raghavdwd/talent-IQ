import { streamClient } from "../lib/stream";
import Session from "../models/Session.js";

export const createSession = async (req, res) => {
  try {
    const { problem, difficulty } = req.body;
    const host = req.user._id;
    const clerkId = req.user.clerkId;

    if (!problem || !difficulty) {
      return res
        .status(400)
        .json({ message: "Problem and difficulty are required" });
    }
    // Generate a unique callId for the session
    const callId = `call_${Date.now()}_${Math.random()
      .toString(36)
      .substr(2, 9)}`;

    const session = await Session.create({
      problem,
      difficulty,
      host,
      callId,
    });

    await streamClient.video.call("default", callId).getOrCreate({
      data: {
        created_by_id: clerkId,
        custom: { sessionId: session._id.toString(), problem, difficulty },
      },
    });

    //chat messanging

    const channel = streamClient.channel("messaging", callId, {
      name: `Session Chat - ${problem}`,
      created_by_id: clerkId,
      members: [clerkId],
    });

    await channel.create();

    return res.status(201).json({ message: "Session created", session });
  } catch (error) {
    console.error("Error creating session:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

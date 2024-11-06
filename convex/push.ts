import { v } from "convex/values";
import { internalAction } from "./_generated/server";

const EXPO_ACCESS_TOKEN = process.env.EXPO_ACCESS_TOKEN;

export const sendPushNotification = internalAction({
  args: {
    pushToken: v.string(),
    messageTitle: v.string(),
    messageBody: v.string(),
    threadId: v.id("messages"),
  },
  handler: async (ctx, args) => {
    const res = await fetch("https://exp.host/--/api/v2/push/send", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${EXPO_ACCESS_TOKEN}`,
      },
      body: JSON.stringify({
        to: args.pushToken,
        sound: "default",
        body: args.messageBody,
        title: args.messageTitle,
        data: { threadId: args.threadId },
      }),
    }).then((res) => res.json());

    console.log(res);

    console.log("🚀 ~ handler: ~ res:", res);
  },
});

import { httpRouter } from "convex/server";
import { httpAction } from "./_generated/server";
import { internal } from "./_generated/api";

const http = httpRouter();

export const doSomething = httpAction(async (ctx, request) => {
  const { data, type } = await request.json();

  switch (type) {
    case "user.created":
      await ctx.runMutation(internal.users.createUser, {
        clerkId: data.id,
        email: data.email_addresses[0].email_address,
        imageUrl: data.image_url,
        username: data.username,
        websiteUrl: data.website_url,
        first_name: data.first_name,
        last_name: data.last_name,
        followersCount: 0,
      });
      break;
    case "user.updated":
      console.log("user updated ");
      break;
  }

  return new Response(null, { status: 200 });
});

//https://cool-sheep-421.convex.cloud
//https://cool-sheep-421.convex.site

export default http;

http.route({
  path: "/clerk-users-webhook",
  method: "POST",
  handler: doSomething,
});

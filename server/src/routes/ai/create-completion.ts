import { FastifyInstance } from "fastify";
import { prisma } from "../../lib/prisma";
import { getUserPostsAndInfo } from "../../services/xScraper";
import { analyzeUser } from "../../services/aiAnalyzer";
import { UserAnalysisSchema } from "../../schemas/userSchemas";
import { UserInfo } from "../../../../shared/types";

export const createCompletionRoute = async (app: FastifyInstance) => {
  app.get<{
    Params: { username: string };
    Reply: UserInfo | { error: string };
  }>("/ai/completion/:username", async (request, reply) => {
    let { username } = request.params;
    username = username.startsWith("@") ? username : "@" + username;

    if (!username) {
      return reply.code(400).send({ error: "Username is required" });
    }

    try {
      const existingUser = await prisma.user.findFirst({
        where: { username },
        include: {
          posts: true,
        },
      });

      if (existingUser) {
        return UserAnalysisSchema.parse({
          ...existingUser,
          posts: existingUser.posts,
        });
      }

      const postLimit = 14;
      const userInfo = await getUserPostsAndInfo(username, postLimit);
      console.log(userInfo);
      const analysis = await analyzeUser(userInfo, postLimit);

      const newUser = await prisma.user.create({
        data: {
          username: userInfo.username,
          name: userInfo.name,
          bio: userInfo.bio,
          location: userInfo.location,
          joinedDate: userInfo.joinedDate,
          postsCount: userInfo.postsCount,
          followersCount: userInfo.followersCount,
          followingCount: userInfo.followingCount,
          likesCount: userInfo.likesCount,
          profilePicture: userInfo.profilePicture,
          bannerPicture: userInfo.bannerPicture,
          description: analysis.why,
          is_a_ngmi: analysis.is_a_ngmi,
          success_percentage: analysis.success_percentage,
          posts: {
            create: userInfo.posts.map((post) => ({
              text: post.text,
              timestamp: post.timestamp,
              likes: post.likes,
              reposts: post.reposts,
              comments: post.comments,
              views: post.views,
            })),
          },
        },
        include: {
          posts: true,
        },
      });

      return UserAnalysisSchema.parse(newUser);
    } catch (error) {
      console.error("Error in create-completion route:", error);
      return reply.code(500).send({ error: "Internal server error" });
    }
  });
};

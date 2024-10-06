import { z } from "zod";
import { UserAnalysis, Post } from "../../../shared/types";

const PostSchema: z.ZodType<Post> = z.object({
  text: z.string(),
  timestamp: z.string(),
  likes: z.number().int().min(0),
  reposts: z.number().int().min(0),
  comments: z.number().int().min(0),
  views: z.number().int().min(0),
});

export const UserAnalysisSchema: z.ZodType<UserAnalysis> = z.object({
  username: z.string(),
  name: z.string(),
  bio: z.string(),
  location: z.string(),
  joinedDate: z.string(),
  postsCount: z.string(),
  followersCount: z.string(),
  followingCount: z.string(),
  likesCount: z.string(),
  profilePicture: z.string().optional(),
  bannerPicture: z.string().optional(),
  is_a_ngmi: z.boolean(),
  success_percentage: z.number().int().min(0).max(100),
  description: z.string(),
  posts: z.array(PostSchema),
});

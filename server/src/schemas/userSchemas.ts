import { z } from "zod";
import { UserAnalysis, UserInfo, Post } from "../../../shared/types";

export const PostSchema: z.ZodType<Post> = z.object({
  text: z.string(),
  timestamp: z.string(),
  likes: z.number().int().min(0),
  reposts: z.number().int().min(0),
  comments: z.number().int().min(0),
  views: z.number().int().min(0),
});

export const UserInfoSchema: z.ZodType<UserInfo> = z.object({
  name: z.string(),
  username: z.string(),
  bio: z.string(),
  location: z.string(),
  joinedDate: z.string(),
  postsCount: z.string(),
  followersCount: z.string(),
  followingCount: z.string(),
  likesCount: z.string(),
  posts: z.array(PostSchema),
  profilePicture: z.string(),
  bannerPicture: z.string(),
});

export const UserAnalysisSchema: z.ZodType<UserAnalysis> = z.object({
  username: z.string(),
  is_a_ngmi: z.boolean(),
  success_percentage: z.number().int().min(0).max(100),
  description: z.string(),
  name: z.string(),
  bio: z.string(),
  location: z.string(),
  joinedDate: z.string(),
  postsCount: z.string(),
  followersCount: z.string(),
  followingCount: z.string(),
  likesCount: z.string(),
  posts: z.array(PostSchema),
  profilePicture: z.string(),
  bannerPicture: z.string(),
});

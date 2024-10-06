export interface UserAnalysis extends UserInfo {
  is_a_ngmi: boolean;
  success_percentage: number;
  description: string;
}

export interface Post {
  text: string;
  timestamp: string;
  likes: number;
  reposts: number;
  comments: number;
  views: number;
}

export interface UserInfo {
  name: string;
  username: string;
  bio: string;
  location: string;
  joinedDate: string;
  postsCount: string;
  followersCount: string;
  followingCount: string;
  likesCount: string;
  posts: Post[];
  profilePicture: string;
  bannerPicture: string;
}

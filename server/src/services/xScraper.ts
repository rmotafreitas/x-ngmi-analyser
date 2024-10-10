import { JSDOM } from "jsdom";
import axios from "axios";
import { UserInfo, Post } from "../../../shared/types";

export async function getUserPostsAndInfo(
  username: string,
  postLimit?: number
): Promise<UserInfo> {
  try {
    const cleanUsername = username.startsWith("@")
      ? username.slice(1)
      : username;

    const url = `https://twstalker.com/${cleanUsername}`;
    const { data } = await axios.get(url);
    const { document } = new JSDOM(data).window;

    const userInfo: UserInfo = {
      name:
        document
          .querySelector(".my-dash-dt h1")
          ?.textContent?.trim()
          .split("\n")[0] || "",
      username:
        document.querySelector(".my-dash-dt h1 span")?.textContent?.trim() ||
        "",
      bio:
        document
          .querySelector(".my-dash-dt span:nth-child(2)")
          ?.textContent?.trim() || "",
      location:
        document
          .querySelector(".my-dash-dt span:nth-child(3)")
          ?.textContent?.replace("🗺️", "")
          .trim() || "",
      joinedDate:
        document
          .querySelector(".my-dash-dt span:nth-child(4)")
          ?.textContent?.replace("Joined", "")
          .trim() || "",
      postsCount:
        document
          .querySelector(".right-details li:nth-child(1) .dscun-numbr")
          ?.textContent?.trim() || "",
      followersCount:
        document
          .querySelector(".right-details li:nth-child(2) .dscun-numbr")
          ?.textContent?.trim() || "",
      followingCount:
        document
          .querySelector(".right-details li:nth-child(3) .dscun-numbr")
          ?.textContent?.trim() || "",
      likesCount:
        document
          .querySelector(".right-details li:nth-child(4) .dscun-numbr")
          ?.textContent?.trim() || "",
      posts: [],
      profilePicture: "",
      bannerPicture: "",
    };

    // Extract profile picture
    const profilePicElement = document.querySelector(".my-dp-dash img");
    userInfo.profilePicture = profilePicElement?.getAttribute("src") || "";

    // Extract banner picture
    const bannerElement = document.querySelector(".todo-thumb1.dash-bg-image1");
    const bannerStyle = bannerElement?.getAttribute("style");
    const bannerUrlMatch = bannerStyle?.match(/url\((.*?)\)/);
    userInfo.bannerPicture = bannerUrlMatch ? bannerUrlMatch[1] : "";

    userInfo.posts = extractPosts(document, userInfo.username, postLimit);
    return userInfo;
  } catch (error) {
    console.error("Error fetching tweets and user info:", error);
    throw error;
  }
}

function extractPosts(
  document: Document,
  username: string,
  postLimit?: number
): Post[] {
  const posts: Post[] = [];
  const postElements = document.querySelectorAll(".activity-posts");

  for (
    let i = 0;
    i < postElements.length && (!postLimit || posts.length < postLimit);
    i++
  ) {
    const element = postElements[i];
    const text =
      element.querySelector(".activity-descp p")?.textContent?.trim() || "";

    if (text && !posts.some((post) => post.text === text)) {
      if (
        element.querySelector(".user-text3 a h4 span")?.textContent?.trim() !==
        username
      )
        continue;
      const post: Post = {
        text,
        timestamp:
          element.querySelector(".user-text3 span a")?.textContent?.trim() ||
          "",
        likes: parseInt(
          element
            .querySelector(".like-item.lc-left:nth-child(3) span")
            ?.textContent?.trim() || "0",
          10
        ),
        reposts: parseInt(
          element
            .querySelector(".like-item.lc-left:nth-child(2) span")
            ?.textContent?.trim() || "0",
          10
        ),
        comments: parseInt(
          element
            .querySelector(".like-item:first-child span")
            ?.textContent?.trim() || "0",
          10
        ),
        views: parseInt(
          element
            .querySelector(".like-item.lc-left:nth-child(4) span")
            ?.textContent?.trim() || "0",
          10
        ),
      };
      posts.push(post);
    }
  }

  return posts;
}

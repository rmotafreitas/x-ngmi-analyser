import model from "../lib/gemini";
import { UserInfo } from "../types/x";

interface AIResponse {
  is_a_ngmi: boolean;
  success_percentage: number;
  why: string;
}

export async function analyzeUser(
  userInfo: UserInfo,
  postLimit: number
): Promise<AIResponse> {
  const prompt = createPrompt(userInfo, postLimit);
  const res: string = (await model.generateContent(prompt)).response.text();
  return parseAIResponse(res);
}

function createPrompt(userInfo: UserInfo, postLimit: number): string {
  const truncate = (text: string, maxLength: number) =>
    text.length > maxLength ? text.substring(0, maxLength) + "..." : text;

  const concisePosts = userInfo.posts.slice(0, postLimit).map((post) => ({
    text: truncate(post.text, 100),
    engagement: `L:${post.likes} R:${post.reposts} C:${post.comments} V:${post.views}`,
  }));

  return `
Analyze Twitter user. Determine if NGMI (Not Gonna Make It) or has potential.

Profile:
${userInfo.name} (@${userInfo.username})
Bio: ${truncate(userInfo.bio, 100)}
Posts: ${userInfo.postsCount} | Followers: ${
    userInfo.followersCount
  } | Following: ${userInfo.followingCount}

Recent Posts:
${concisePosts
  .map((post, i) => `${i + 1}. "${post.text}" - ${post.engagement}`)
  .join("\n")}

Respond in JSON:
{
  "is_a_ngmi": boolean,
  "success_percentage": number (0-100, representing the likelihood of success, inverse of NGMI),
  "why": "100+ word humorous explanation. Mock if NGMI, sarcastically praise if potential. Reference profile/posts."
}
`;
}

function parseAIResponse(res: string): AIResponse {
  try {
    const jsonString = res.replace(/```json\n?|\n?```/g, "").trim();
    const parsedRes = JSON.parse(jsonString);

    if (
      typeof parsedRes.is_a_ngmi !== "boolean" ||
      typeof parsedRes.success_percentage !== "number" ||
      parsedRes.success_percentage < 0 ||
      parsedRes.success_percentage > 100 ||
      typeof parsedRes.why !== "string"
    ) {
      throw new Error("Invalid response structure");
    }

    return parsedRes;
  } catch (error) {
    console.error("Error parsing AI response:", error);
    throw new Error("Invalid AI response format");
  }
}

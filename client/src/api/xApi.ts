import { UserInfo } from "../../../shared/types";
import axiosInstance from "./axiosConfig";
export async function fetchUserAnalysis(username: string): Promise<UserInfo> {
  try {
    const response = await axiosInstance.get<UserInfo>(
      `/ai/completion/${username}`
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching user analysis:", error);
    throw error;
  }
}

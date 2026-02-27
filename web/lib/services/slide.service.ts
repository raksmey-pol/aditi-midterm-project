
import { apiClient, API_CONFIG } from "../api-client";

export interface Slide {
  id: number;
  title: string;
  imageUrl: string;
  link: string;
  description: string;
}

export async function getSlides(): Promise<Slide[]> {
  return apiClient.get<Slide[]>(API_CONFIG.endpoints.slides.list);
}

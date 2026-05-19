import { API_ORIGIN } from "../services/api/client";

export const resolveImageUrl = (imageUrl) => {
  if (!imageUrl) {
    return "";
  }

  if (imageUrl.startsWith("http")) {
    return imageUrl;
  }

  return `${API_ORIGIN}${imageUrl}`;
};



import Cookies from "js-cookie";
import jwt from "jsonwebtoken";

const SECRET_KEY = "your_secret_key_54456445";
const REFRESH_SECRET_KEY = "your_refresh_secret_key_123456";

const verifyToken = async (token: string, secretKey: string) => {
  try {
    // Verify token using your verification function or library
    const decoded = jwt.verify(token, secretKey);
    return decoded;
  } catch (error) {
    console.error("Token verification failed:", error);
    return null;
  }
};

export const checkAuthStatus = async () => {
  const accessToken = localStorage.getItem("accessToken");
  const refreshToken = Cookies.get("refreshToken");

  if (accessToken) {
    // Verify the access token
    const decodedAccess = await verifyToken(accessToken, SECRET_KEY);
    if (decodedAccess) {
      return { authenticated: true };
    }
  }

  if (refreshToken) {
    // Verify the refresh token and get a new access token
    const response = await fetch("/api/quiz/refreshToken", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ refreshToken }),
    });

    if (response.ok) {
      const data = await response.json();
      localStorage.setItem("accessToken", data.accessToken);
      return { authenticated: true };
    } else {
      // Refresh token failed or is invalid
      return { authenticated: false };
    }
  }

  // No access token or refresh token
  return { authenticated: false };
};

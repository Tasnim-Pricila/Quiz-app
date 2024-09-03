import Cookies from "js-cookie";
import jwt from "jsonwebtoken";

const ACCESS_TOKEN_SECRET = "your_access_token_secret"; // Replace with your actual access token secret key
const REFRESH_TOKEN_SECRET = "your_refresh_token_secret";

const verifyToken = async (token: string) => {
  try {
    // Verify token using your verification function or library
    const decoded = jwt.verify(token, "your_access_token_secret");
    return decoded;
  } catch (error) {
    console.error("Token verification failed:", error);
    return null;
  }
};

export const checkAuthStatus = async () => {
  const accessToken = localStorage.getItem("accessToken");
  // const refreshToken = Cookies.get("refreshToken");

  if (accessToken) {
    // Verify the access token
    const decodedAccess = await verifyToken(accessToken);
    // console.log(decodedAccess);
    if (decodedAccess) {
      return { authenticated: true };
    }
  }

  // if (refreshToken) {
  //   // Verify the refresh token and get a new access token
  //   const response = await fetch("/api/quiz/refreshToken", {
  //     method: "POST",
  //     headers: {
  //       "Content-Type": "application/json",
  //     },
  //     body: JSON.stringify({ refreshToken }),
  //   });

  //   if (response.ok) {
  //     const data = await response.json();
  //     localStorage.setItem("accessToken", data.accessToken);
  //     return { authenticated: true };
  //   } else {
  //     // Refresh token failed or is invalid
  //     return { authenticated: false };
  //   }
  // }

  // No access token or refresh token
  return { authenticated: false };
};

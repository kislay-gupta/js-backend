export const DB_NAME = "videoTube";

export const options = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
};

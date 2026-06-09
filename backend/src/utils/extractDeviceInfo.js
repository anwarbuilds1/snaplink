import { detect } from "detect-browser";

export const extractDeviceInfo = (userAgent) => {
  const result = detect(userAgent);

  if (!result) {
    return {
      browser: "unknown",
      os: "unknown",
    };
  }

  return {
    browser: result.name,
    os: result.os,
  };
};

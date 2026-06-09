export const buildClickContext = (req) => {
  return {
    userAgent: req.headers["user-agent"] || "",
    referrer: req.headers.referer || "direct",
  };
};

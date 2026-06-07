const extractDeviceInfo = (req) => ({
  userAgent: req.get("user-agent") || "",
});

module.exports = extractDeviceInfo;

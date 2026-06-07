const extractDeviceInfo = (req) => ({
  userAgent: req.get("user-agent") || "",
});

export default extractDeviceInfo;

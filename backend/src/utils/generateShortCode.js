import crypto from "crypto";

const generateShortCode = (length = 7) =>
  crypto.randomBytes(length).toString("base64url").slice(0, length);

export default generateShortCode;

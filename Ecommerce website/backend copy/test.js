import crypto from "crypto";
 
const bytes=crypto.randomBytes(20);
console.log(bytes.toString("hex"));
console.log(bytes.toString("base64"));
const token=bytes.toString("hex");
const resetToken=crypto.createHash("sha256").update(token).digest("hex");
console.log("token",token);
console.log("resetToken",resetToken);
console.log(Date.now() + 30 * 60 * 1000);
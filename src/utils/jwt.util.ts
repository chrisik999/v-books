import { SignJWT, jwtVerify, JWTPayload } from "jose";

const secret = new TextEncoder().encode(process.env.JWT_SECRET || "dev-secret");

export async function signAccessToken(payload: JWTPayload, expires = "15m") {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(expires)
    .sign(secret);
}

export async function verifyToken(token: string) {
  const { payload } = await jwtVerify(token, secret, { algorithms: ["HS256"] });
  return payload;
}

// node -e "console.log(require('crypto').randomBytes(48).toString('hex'))"

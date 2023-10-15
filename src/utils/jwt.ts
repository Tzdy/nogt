import * as JWT from 'jsonwebtoken';
// jwt token 超时时间单位ms
/**
 * @description
 * Eg: 60, "2 days", "10h", "7d"
 *
 * 详情参考：https://github.com/vercel/ms
 */
export const maxAge = process.env.JWT_EXPIRES;

export interface JwtUser {
  id: number;
}

export function sign(payload: JwtUser) {
  return JWT.sign(
    {
      payload,
      exp: Date.now(),
    },
    process.env.JWT_SECRET,
  );
}

export function verify(token): JwtUser {
  return JWT.verify(token, process.env.JWT_SECRET, {
    maxAge,
  })['payload'];
}

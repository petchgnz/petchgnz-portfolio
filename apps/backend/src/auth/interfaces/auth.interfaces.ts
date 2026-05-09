// payload for jwt token
export interface JwtPayload {
  sub: string;
  email: string;
}

// payload for jwt (refresh) token
export interface JwtRefreshPayload {
  sub: string;
  email: string;
  refreshToken: string;
}

// return auth structure
export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

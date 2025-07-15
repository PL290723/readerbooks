// Utility functions for OAuth configuration
export const isGoogleOAuthEnabled = () => {
  return !!(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET)
}

export const isAppleOAuthEnabled = () => {
  return !!(process.env.APPLE_ID && process.env.APPLE_SECRET)
}

export const isOAuthEnabled = () => {
  return isGoogleOAuthEnabled() || isAppleOAuthEnabled()
}

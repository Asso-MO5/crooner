const DEPLOY_TYPE = process.env.DEPLOY_TYPE || 'production'

export const DISCORD_TOKEN =
  DEPLOY_TYPE !== 'production'
    ? process.env.DISCORD_TOKEN_DEV
    : process.env.DISCORD_TOKEN
export const DISCORD_CLIENT_ID =
  DEPLOY_TYPE !== 'production'
    ? process.env.DISCORD_CLIENT_ID_DEV
    : process.env.DISCORD_CLIENT_ID
export const DISCORD_GUILD_ID =
  DEPLOY_TYPE !== 'production'
    ? process.env.DISCORD_GUILD_ID_DEV
    : process.env.DISCORD_GUILD_ID

export const CHAT_GPT_API = process.env.CHAT_GPT_API || ''
export const CHAT_GPT_ORG_ID = process.env.CHAT_GPT_ORG_ID || ''

export const BRAVE_TOKEN_SEARCH = process.env.BRAVE_TOKEN_SEARCH || ''

import { ActionRowBuilder, ButtonStyle, ButtonBuilder } from 'discord.js'
import { DonsCustomId } from './dons.custom-id.mjs'

export const homeContent = `
Bienvenue sur la page des dons ! 🎉

Tu peux soutenir le serveur de différentes manières :
- En faisant un don financier 💸
- En faisant un don de matériel 🎁
- En nous soutenant sur Tipeee 💰

Clique sur un bouton pour en savoir plus ! 🤔

---
`

export const btnMoney = new ButtonBuilder()
  .setCustomId(DonsCustomId.money)
  .setLabel('Don financier 💸')
  .setStyle(ButtonStyle.Success)

export const btnMaterial = new ButtonBuilder()
  .setCustomId(DonsCustomId.material)
  .setLabel('Don de matériel 🎁')
  .setStyle(ButtonStyle.Primary)

export const btnTipeee = new ButtonBuilder()
  .setCustomId(DonsCustomId.tipeee)
  .setLabel('Tipeee 💰')
  .setStyle(ButtonStyle.Danger)

export const donRow = new ActionRowBuilder().addComponents(
  btnMoney,
  btnMaterial,
  btnTipeee
)

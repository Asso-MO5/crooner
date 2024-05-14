import { ButtonBuilder, ActionRowBuilder, ButtonStyle } from 'discord.js'
import { rogueCustomId } from './rogue.custom-id.mjs'

const scoreBtn = new ButtonBuilder()
  .setCustomId(rogueCustomId.score)
  .setLabel('Tableau des scores')
  .setStyle(ButtonStyle.Danger)

const playBtn = new ButtonBuilder()
  .setCustomId(rogueCustomId.play)
  .setLabel('Jouer')
  .setStyle(ButtonStyle.Success)

export const mainRow = new ActionRowBuilder().addComponents(scoreBtn, playBtn)

export async function mainMsg(interaction, isReply = false) {
  const content =
    'Bienvenue sur le jeu Rogue ! 🎮\nClique sur un bouton pour commencer.'
  const components = [mainRow]

  if (isReply) {
    await interaction.reply({
      content,
      components,
      ephemeral: true,
    })
  } else {
    await interaction.editReply({
      content,
      components,
    })
  }
}

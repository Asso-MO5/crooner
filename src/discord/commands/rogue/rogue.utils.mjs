import { ButtonBuilder, ActionRowBuilder, ButtonStyle } from 'discord.js'
import { rogueCustomId } from './rogue.custom-id.mjs'

const scoreBtn = new ButtonBuilder()
  .setCustomId(rogueCustomId.score)
  .setLabel('Tableau des scores')
  .setStyle(ButtonStyle.Danger)
  .setDisabled(true)

const playBtn = new ButtonBuilder()
  .setCustomId(rogueCustomId.play)
  .setLabel('Jouer')
  .setStyle(ButtonStyle.Success)

const resetBtn = new ButtonBuilder()
  .setCustomId(rogueCustomId.reset)
  .setLabel('Réinitialiser')
  .setStyle(ButtonStyle.Danger)

export const mainRow = new ActionRowBuilder().addComponents(
  scoreBtn,
  resetBtn,
  playBtn
)

/*

const mapWidth = 20
const mapHeight = 30
const floorEmoji = '⬛'
const wallEmoji = '🧱'
const unexploredEmoji = '🌑'
const playerSymbol = ['😃', '🙂', '😵', '😟', '🤕', '😡']
const exitEmoji = '🚪'
const deathEmoji = '💀'

const enemySymbols = {
  virus: '🦠',
  popup: '📛',
  troll: '👹',
}

const itemSymbols = {
  crt: '📺',
  pc: '💻',
  game: '🕹️',
  chest: '💰',
}

const depotEmoji = '📥'

*/
export async function mainMsg(interaction, isReply = false) {
  const content = `
  ## MO5 ROGUE ##
Bienvenue dans le jeu MO5 Rogue !
---
*Le jeu est en developpement, il est possible que vous rencontriez des bugs.*
- Il n'est pas encore possible de naviguer dans l'invetaire. 
- Le tableau des scores n'est pas encore implémenté.
- Il manque pas mal de mécaniques de jeu.
---

## But du jeu
Vous (🙂) devez collecter des machines (📺,💻,🕹️,💰) et les envoyées dans au local (📥) pour gagner des points.

Attention aux ennemis (🦠,📛,👹) et aux murs (🧱) !


----
  `
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

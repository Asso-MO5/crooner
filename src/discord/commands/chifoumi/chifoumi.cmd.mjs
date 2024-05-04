import {
  SlashCommandBuilder,
  ActionRowBuilder,
  ButtonStyle,
  ButtonBuilder,
} from 'discord.js'

import { ChifoumiCustomId } from './chifoumi.custom-id.mjs'

const cmd = {
  data: new SlashCommandBuilder()
    .setName('chifoumi')
    .setDescription('Joue au Chifoumi !! '),
  async execute(interaction) {
    // ICI je récupère les roles de l'utilisateur qui utilise la commande
    const memberRoles = interaction.member.roles.cache.map((role) => role.name)

    console.log(memberRoles)
    const row = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId(ChifoumiCustomId.stone)
        .setLabel('✊')
        .setStyle(ButtonStyle.Secondary),
      new ButtonBuilder()
        .setCustomId(ChifoumiCustomId.paper)
        .setLabel('✋')
        .setStyle(ButtonStyle.Secondary),
      new ButtonBuilder()
        .setCustomId(ChifoumiCustomId.scissors)
        .setLabel('✌️')
        .setStyle(ButtonStyle.Secondary)
    )

    await interaction.reply({
      content: `Fais ton choix ! 🤔`,
      ephemeral: true,
      components: [row],
    })
  },
}

export default cmd

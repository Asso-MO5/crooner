import { ActionRowBuilder, ButtonStyle } from 'discord.js'
import { mailer } from '../../services/mail.mjs'
import { jsmxCustomId } from '../commands/jmsx/jmsx.custom-id.mjs'
import { ButtonBuilder } from 'discord.js'

export async function postMessageJmsx(interaction, client) {
  if (interaction?.reference) {
    const messageId = interaction.reference.messageId
    const channelId = interaction.reference.channelId

    try {
      // Récupérer le canal où le message de référence a été envoyé
      const channel = await client.channels.fetch(channelId)

      if (!channel) {
        console.log("Le canal récupéré n'est pas un canal de texte.")
        return
      }

      // Récupérer le message original via son ID
      const message = await channel.messages.fetch(messageId)

      const splitMsg = message.content.split('\n')

      const emailLine = splitMsg.find((line) => line.includes('Email'))

      const row = new ActionRowBuilder().addComponents(
        new ButtonBuilder()
          .setCustomId(jsmxCustomId.cancel)
          .setLabel('Non merci')
          .setStyle(ButtonStyle.Danger),
        new ButtonBuilder()
          .setCustomId(jsmxCustomId.send)
          .setLabel('Oui !')
          .setStyle(ButtonStyle.Success)
      )

      const content = [
        `Veux-tu envoyer ta réponse en mail ? `,
        '```markdown',
        `${interaction.content}`,
        '```',
        `à l'adresse suivante : ${emailLine.split(':')[1].trim()}`,
        '\n',
      ].join('\n')

      await interaction.author.send({
        content,
        components: [row],
      })

      /**
      await interaction.author.send({
        content: `Merci pour votre message, souhaitez-vous nous envoyer un email ?`,
        components: [row],
      })

      **/

      return

      // Réponse à l'utilisateur
    } catch (error) {
      console.error('Erreur lors de la récupération du message:', error)
    }
  } else {
    console.log('Aucun message de référence trouvé pour cette interaction.')
  }
}

import { mailer } from '../../services/mail.mjs'

export async function mail(interaction, client) {
  if (interaction?.reference) {
    const messageId = interaction.reference.messageId
    const channelId = interaction.reference.channelId

    try {
      // Récupérer le canal où le message de référence a été envoyé
      const channel = await client.channels.fetch(channelId)

      console.log('channel', channel)
      if (!channel) {
        console.log("Le canal récupéré n'est pas un canal de texte.")
        return
      }

      // Récupérer le message original via son ID
      const message = await channel.messages.fetch(messageId)

      const splitMsg = message.content.split('\n')

      const emailLine = splitMsg.find((line) => line.includes('Email'))

      // Réponse à l'utilisateur
      if (emailLine) {
        const email = emailLine.split(':')[1].trim()
        if (!email || !email?.includes('@')) return
        await mailer.sendMail({
          from: '"JMSX" <jmsx@mo5.com>',
          to: email,
          subject: 'JMSX24 - contact',
          text: `
           ${interaction.content}
           --------------
           L'équipe de JMSX.`,
        })
      }
    } catch (error) {
      console.error('Erreur lors de la récupération du message:', error)
    }
  } else {
    console.log('Aucun message de référence trouvé pour cette interaction.')
  }
}

import { mailer } from '../../../services/mail.mjs'
import { jsmxCustomId } from './jmsx.custom-id.mjs'

const extractEmail = (text) => {
  const regex = /[\w.-]+@[\w.-]+\.\w+/
  const match = text.match(regex)
  return match ? match[0] : null
}

function extractMarkdownCode(lines) {
  let isCodeBlock = false
  let codeContent = []

  for (const line of lines) {
    if (line.startsWith('```')) {
      isCodeBlock = !isCodeBlock
      continue
    }
    if (isCodeBlock) codeContent.push(line)
  }

  return codeContent.join('\n')
}

const btn = {
  customId: jsmxCustomId.send,
  async execute(interaction) {
    await interaction.deferUpdate()

    const lines = interaction?.message?.content?.split('\n')

    console.log('lines', lines)

    const emailLine = lines.find(
      (line) => line.includes('Email') || line.includes('adresse suivante')
    )

    if (emailLine) {
      const email = extractEmail(emailLine.split(':')[1].trim())
      if (!email || !email?.includes('@')) return

      await mailer.sendMail({
        from: '"JSMX" <jmsx@mo5.com>',
        to: email,
        subject: 'JMSX24 - contact',
        text: `
           ${extractMarkdownCode(lines)}
           --------------
           L'équipe de JMSX.`,
      })
    }
    await interaction.deleteReply()
  },
}

export default btn

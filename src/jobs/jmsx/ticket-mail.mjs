import { mailer } from '../../services/mail.mjs'
import { createServerClient } from '../../services/supabase.mjs'
import { placeTypes, sendStates, tables } from './contants.mjs'
import QRCode from 'qrcode'
import { createCanvas, registerFont, loadImage } from 'canvas'
import fs from 'fs'
import path from 'path'
import imgToPDF from 'image-to-pdf'

export async function sendJmsxTicketMail() {
  const supabase = createServerClient()
  const { data: seats } = await supabase
    .from(tables.seats)
    .select('*')
    .neq('sended_state', sendStates.sent)
    .neq('sended_state', sendStates.renew)
    .neq('sended_state', sendStates.pending)
    .limit(10)

  console.log('Nombre de tickets à envoyer: ', seats?.length || 0)

  //TODO rechercher dans nouvelle table l'état des emails.

  // === Canvas ====
  const DPI = 100 // Résolution en DPI
  const widthMM = 210 // Largeur en mm pour A4
  const heightMM = 297 // Hauteur en mm pour A4
  const widthPixels = Math.round((widthMM / 25.4) * DPI)
  const heightPixels = Math.round((heightMM / 25.4) * DPI)
  const canvas = createCanvas(widthPixels, heightPixels)
  const ctx = canvas.getContext('2d')
  registerFont('public/openSans.ttf', { family: 'openSans' })

  //=== images =======

  const visitorTempLate = await loadImage('public/ticket.png')

  // ==== PAGE ====

  for (const seat of seats) {
    ctx.drawImage(visitorTempLate, 0, 0)
    const qrcodeDataUrl = await QRCode.toDataURL(seat.id, {
      width: 250,
      height: 250,
    })

    const qrImage = await loadImage(qrcodeDataUrl)

    ctx.drawImage(qrImage, 15, 910)

    // === TEXTS ===
    ctx.font = 'bold 10px openSans'
    ctx.fillStyle = 'black'
    ctx.fillText(seat.id, 40, 915)

    ctx.font = 'bold 25px openSans'
    ctx.fillStyle = '#5955e0'
    ctx.fillText(`${seat.name} ${seat.lastname.toUpperCase()}`, 300, 1030)

    ctx.font = '15px openSans'
    ctx.fillStyle = '#000000'
    ctx.fillText(`Valable le :`, 300, 1065)

    if (seat.day_one && seat.day_two) {
      ctx.fillText(`Samedi 22 et dimanche 23 juin 2024`, 300, 1085)
    }

    if (seat.day_one && !seat.day_two) {
      ctx.fillText(`Samedi 22 juin 2024`, 300, 1085)
    }

    if (!seat.day_one && seat.day_two) {
      ctx.fillText(`Dimanche 23 juin 2024`, 300, 1085)
    }

    ctx.font = 'bold 30px Sans'
    ctx.fillStyle = '#b95e51'
    ctx.fillText(placeTypes[seat.type], 300, 1130)

    const buff = Buffer.from(
      canvas.toDataURL().replace('data:image/png;base64,', ''),
      'base64'
    )

    const folderName = '_temp'

    const dir = path.join(process.cwd(), folderName)
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true })
    }

    const fileName = `${seat.id}.pdf`
    const pdfPath = path.join(dir, fileName)

    await new Promise((resolve, reject) => {
      imgToPDF([buff], imgToPDF.sizes.A4)
        .pipe(fs.createWriteStream(path.join(folderName, fileName)))
        .on('finish', resolve)
        .on('error', reject)
    })

    try {
      const info = await mailer.sendMail({
        from: '"JMSX" <jmsx@mo5.com>',
        bbc: [seat.email, 'jmsx@mo5.com'],
        attachments: [
          {
            filename: `jmsx_billet_${seat.transaction_id}.pdf`,
            path: path.join(dir, fileName),
          },
        ],
        subject: 'Votre billet pour JMSX24',
        html: `
      <!DOCTYPE html>
<html>
<head>
    <title>Votre Billet</title>
</head>
<body
    style="background-color: black; color: white; font-family: 'Courier New', Courier, monospace; margin: 0; padding: 0;">
    <table width="100%" style="background-color: black; border-spacing: 0; color: white;">
        <tr>
            <td style="text-align: center; padding: 20px;">
                <img src="https://jmsx.mo5.com/favicon.png" width="64" height="64"
                    style="display: block; margin: auto;" />
            </td>
        </tr>
        <tr>
            <td style="padding: 20px;">
                <h1 style="color: #ded087; margin: 0; padding-bottom: 10px;">J'MSX 24</h1>
            </td>
        </tr>
        <tr>
            <td style="padding: 20px;">
                <h2 style="color: #b766b5; text-transform: uppercase; margin: 0; padding-bottom: 10px;">Votre billet
                    pour JMSX 24
                </h2>
                <div style="border: 1px solid #5955e0; padding: 10px;">
                    <p>Bonjour,</p>
                    Nous sommes ravis de vous accueillir à la convention JMSX 2024 ! Veuillez trouver <b><u>ci-joint
                            votre
                            billet d'entrée.</b></u>
                    Assurez-vous de l'imprimer ou de le garder accessible sur votre téléphone mobile pour faciliter
                    votre entrée à
                    l'événement.
                    </p>
                    <p>Nous vous remercions de votre confiance et nous réjouissons de vous accueillir prochainement.
                    </p>
                    <p>
                        Cordialement,
                    </p>
                    <p>L'équipe J'MSX 24</p>

                </div>

            </td>
        </tr>
        <tr>
            <td style="padding: 20px;">
                <h2 style="color: #b766b5; text-transform: uppercase; margin: 0; padding-bottom: 10px;">Infos pratiques
                </h2>
                <div style="border: 1px solid #5955e0; padding: 10px;">

                    <h3 style="color: #b766b5; text-transform: uppercase; margin: 0; padding-bottom: 5px;">Adresse</h3>
                    <p style="margin: 0;">
                        La convention se déroulera du 22 au 23 juin 2024 à ISAR DIGITAL, 60 bd Richard-Lenoir, 75011
                        Paris.
                    <div style="height: 10px;"></div>

                </div>
                <div style="height: 15px;"></div>
                <div style="border: 1px solid #5955e0; padding: 10px;">

                    <h3 style="color: #b766b5; text-transform: uppercase; margin: 0; padding-bottom: 5px;">HORAIRES</h3>

                    <span style="color:#ded087">Samedi</span>
                    <ul>
                        <li>Ouverture à 9h30 pour les participants à la Game jam et les exposants</li>
                        <li>Ouverture au public à 10h</li>
                        <li>Fermeture à 19h30</li>
                    </ul>
                    <div style="height: 10px;"></div>
                    <span style="color:#ded087">Dimanche</span>
                    <ul>
                        <li>Ouverture à 9h30 pour les participants à la Game jam et les exposants</li>
                        <li>Ouverture au public à 10h</li>
                        <li>Fermeture à 19h30</li>
                    </ul>
                    </p>
                    <div style="height: 5px;"></div>
                    <p style=" text-align: right;">
                        <a style="color:white;border: 5px solid #3aa241;background-color: #3aa241;text-decoration: none;"
                            href="https://jmsx.mo5.com/programme">En savoir plus</a>
                    </p>
                </div>
            </td>
        </tr>
    </table>
</body>
</html>
      `,
      })

      await supabase
        .from(tables.seats)
        .update({ sended_state: sendStates.sent, sended_ticket: new Date() })
        .match({ id: seat.id })

      console.log('Message sent: %s', info.messageId, seat.email)
    } catch (e) {
      console.error(e)
      await supabase
        .from(tables.seats)
        .update({ sended_state: sendStates.error, sended_ticket: new Date() })
        .match({ id: seat.id })
    } finally {
      fs.unlinkSync(pdfPath)
    }
  }

  console.log('sendJmsxTicketMail done')
}

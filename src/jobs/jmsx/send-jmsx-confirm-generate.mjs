import { mailer } from '../../services/mail.mjs'
import { createServerClient } from '../../services/supabase.mjs'
import { sendStates, tables } from './contants.mjs'

export async function sendJmsxConfirmGenerate() {
  const supabase = createServerClient()
  const { data: seats } = await supabase
    .from(tables.seats)
    .select('*')
    .neq('token', null)
    .neq('sended_state', sendStates.renew)
    .limit(10)

  console.log('Nombre de mail de confirmation: ', seats?.length || 0)

  for (const seat of seats) {
    try {
      const info = await mailer.sendMail({
        from: '"JMSX" <jmsx@mo5.com>',
        to: seat.email,
        subject: 'Votre billet pour JMSX24',
        html: `
      <!DOCTYPE html>
<html>
<head>
    <title>confirmer</title>
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
                    <p>Si vous avez bien demandé la génération de votre billet pour JMSX24, veuillez cliquer sur le lien
                        suivant pour le confirmer:</p>
                    </p>
                    <br/><br/>
                    <p>
                    <a href="https://jmsx.mo5.com/generate/confirm/${seat.token}" style='color:#ded087;'>https://jmsx.mo5.com/generate/confirm/${seat.token}</a>
                    </p>
                    <br/><br/>
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
        .update({
          sended_state: sendStates.renew,
        })
        .match({ id: seat.id })

      console.log('Message sent: %s', info.messageId, seat.email)
    } catch (e) {
      console.error(e)
      await supabase
        .from(tables.seats)
        .update({ sended_state: sendStates.error, sended_ticket: new Date() })
        .match({ id: seat.id })
    }
  }
}

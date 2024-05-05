import { DonsCustomId } from './dons.custom-id.mjs'
import {
  btnMaterial,
  btnMoney,
  btnTipeee,
  donRow,
  homeContent,
} from './dons.utils.mjs'
import { ButtonBuilder, ActionRowBuilder, ButtonStyle } from 'discord.js'

const btn = {
  customId: DonsCustomId.button,
  execute: async (interaction) => {
    await interaction.deferUpdate()

    if (interaction.customId === DonsCustomId.return) {
      await interaction.editReply({
        content: homeContent,
        components: [donRow],
      })

      return
    }

    const returnBtn = new ButtonBuilder()
      .setCustomId(DonsCustomId.return)
      .setLabel(`Retour au menu principal`)
      .setStyle(ButtonStyle.Primary)

    let row = null,
      content = ''

    if (interaction.customId === DonsCustomId.money) {
      row = new ActionRowBuilder().addComponents(
        btnMaterial,
        btnTipeee,
        returnBtn
      )

      content = [
        'Votre don est crucial pour soutenir les initiatives de notre association,',
        "telles que l'organisation d'événements et la création d'expositions.",
        "En tant qu'organisation déclarée d'intérêt général,",
        '',
        "vous bénéficiez d'une **réduction d'impôt de 66 % du montant de votre don**,",
        "applicable jusqu'à 20 % de votre revenu imposable.",
        '',
        'Contribuez dès maintenant et faites une différence significative !',
        "Pour plus d'informations et pour faire un don, visitez notre site : https://don.mo5.com/",
      ].join('\n')
    }

    if (interaction.customId === DonsCustomId.material) {
      row = new ActionRowBuilder().addComponents(btnMoney, btnTipeee, returnBtn)

      content = [
        'La quasi-totalité des pièces de nos collections vient de vos dons.',
        'En léguant vos machines, jeux et documentations à MO5.COM,',
        'vous jouez un rôle crucial dans la préservation de notre patrimoine culturel.',
        '',
        "Ces contributions permettent à d'autres de découvrir et d'apprécier ces trésors historiques.",
        "Notez que pour les dons matériels, **nous ne délivrons pas d'attestation de don pour les réductions d'impôts.**",
        '',
        'Contribuez à notre mission et aidez-nous à continuer notre travail !',
        "Pour plus d'informations et pour savoir comment donner, visitez notre site : https://don.mo5.com/",
      ].join('\n')
    }

    if (interaction.customId === DonsCustomId.tipeee) {
      row = new ActionRowBuilder().addComponents(
        btnMoney,
        btnMaterial,
        returnBtn
      )

      content = [
        '**Soutenez notre mission en devenant un Tipeur !**',
        'En contribuant sur Tipeee, vous aidez activement à la préservation du patrimoine numérique.',
        'Voici ce que nous offrons en échange de votre générosité :',
        '',
        '**Pour 3 Euros par mois :**',
        "- Devenir membre de l'association MO5.COM.",
        '- Accès gratuit à un de nos plus grands salons par an (PGW, etc).',
        "- Participation à la future reconnaissance d'utilité publique de MO5.COM.",
        '',
        '**Pour 15 Euros par mois :**',
        '- Tous les avantages précédents, plus un conseil personnalisé pour la gestion de votre collection.',
        '- Accès gratuit à deux de nos grands salons par an (Japan Expo, etc).',
        '',
        '**Pour 30 Euros par mois :**',
        "- Tous les avantages précédents, plus prêt d'une machine historique (Sega, Commodore, Nintendo, Atari, etc).",
        '- Possibilité de soumettre des demandes pour aider à réparer votre propre matériel.',
        '',
        '**Pour 60 Euros par mois :**',
        "- Accès gratuit à tous nos salons, toute l'année.",
        "- Prêt d'une borne de jeu toute l'année.",
        '',
        '**Pour 120 Euros et plus par mois :**',
        "- Tous les avantages précédents, plus invitation à toutes nos soirées avec nos membres d'honneur.",
        '',
        "**Notez que pour les contributions via Tipeee, nous ne délivrons pas d'attestation de don pour les réductions d'impôts.**",
        '',
        "Pour plus d'informations et pour devenir Tipeur, visitez notre page : https://fr.tipeee.com/association-mo5-com",
      ].join('\n')
    }

    content += '\n\n---'
    await interaction.editReply({
      content,
      components: row ? [row] : [donRow],
    })
  },
}

export default btn

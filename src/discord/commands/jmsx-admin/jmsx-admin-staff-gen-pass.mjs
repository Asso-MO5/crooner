import { AttachmentBuilder } from 'discord.js'
import { tables } from '../../../jobs/jmsx/contants.mjs'
import { createServerClient } from '../../../services/supabase.mjs'
import { createCanvas, registerFont, loadImage } from 'canvas'
import QRCode from 'qrcode'

export async function jsmxAdminStaffGenPass(interaction) {
  const supabase = createServerClient()
  const { data: me } = await supabase
    .from(tables.staff)
    .select('*')
    .eq('discord_id', interaction.user.id)
    .single()
  const name = interaction.user.globalName || interaction.user.username

  // === Canvas ====
  const DPI = 100 // Résolution en DPI
  const widthMM = 85.6 // Largeur en mm pour carte de visite
  const heightMM = 53.98 // Hauteur en mm pour carte de visite
  const widthPixels = Math.round((widthMM / 25.4) * DPI)
  const heightPixels = Math.round((heightMM / 25.4) * DPI)
  const canvas = createCanvas(widthPixels, heightPixels)
  const ctx = canvas.getContext('2d')
  registerFont('public/openSans.ttf', { family: 'openSans' })

  //=== images =======

  const passTemplate = await loadImage('public/jmsx_pass.png')

  ctx.drawImage(passTemplate, 0, 0, widthPixels, heightPixels)

  // === TEXTS ===
  ctx.font = 'bold 10px openSans'
  ctx.fillStyle = 'black'
  ctx.fillText(me.discord_id, 10, heightPixels - 10)

  const qrcodeDataUrl = await QRCode.toDataURL(me.discord_id, {
    width: 100,
    height: 100,
  })

  const qrImage = await loadImage(qrcodeDataUrl)

  ctx.drawImage(qrImage, widthPixels / 2 - 50, 95)

  ctx.font = 'bold 25px openSans'
  ctx.fillStyle = '#5955e0'
  const textWidth = ctx.measureText(name).width
  const nameX = (widthPixels - textWidth) / 2
  ctx.fillText(name, nameX, 95)

  ctx.font = 'bold 15px openSans'
  ctx.fillStyle = '#b95e51'
  ctx.fillText('STAFF', widthPixels - 50, heightPixels - 10)

  const buffer = Buffer.from(
    canvas.toDataURL().replace('data:image/png;base64,', ''),
    'base64'
  )

  const attachment = new AttachmentBuilder(buffer, { name: 'pass.png' })
  await interaction.editReply({
    files: [attachment],
  })
}

import { ButtonBuilder, ActionRowBuilder, ButtonStyle } from 'discord.js'
import { rogueCustomId } from './rogue.custom-id.mjs'
import { saveGameState, loadGameState, deleteGameState } from './game-state.mjs'
import { mainMsg, mainRow } from './rogue.utils.mjs'

// === BUTTONS ========================================
const upBtn = new ButtonBuilder()
  .setCustomId(rogueCustomId.ctrl.up)
  .setLabel('⬆️')
  .setStyle(ButtonStyle.Primary)

const downBtn = new ButtonBuilder()
  .setCustomId(rogueCustomId.ctrl.down)
  .setLabel('⬇️')
  .setStyle(ButtonStyle.Primary)

const leftBtn = new ButtonBuilder()
  .setCustomId(rogueCustomId.ctrl.left)
  .setLabel('⬅️')
  .setStyle(ButtonStyle.Primary)

const rightBtn = new ButtonBuilder()
  .setCustomId(rogueCustomId.ctrl.right)
  .setLabel('➡️')
  .setStyle(ButtonStyle.Primary)

const inventoryBtn = new ButtonBuilder()
  .setCustomId(rogueCustomId.ctrl.inventory)
  .setLabel('🎒')
  .setStyle(ButtonStyle.Success)
  .setDisabled(true)

const quitBtn = new ButtonBuilder()
  .setCustomId(rogueCustomId.ctrl.quit)
  .setLabel('quitter')
  .setStyle(ButtonStyle.Danger)

// === Blank buttons ========================
const blank_1 = new ButtonBuilder()
  .setCustomId(rogueCustomId.ctrl.blank_1)
  .setLabel('-')
  .setStyle(ButtonStyle.Secondary)
  .setDisabled(true)

const blank_2 = new ButtonBuilder()
  .setCustomId(rogueCustomId.ctrl.blank_2)
  .setLabel('-')
  .setStyle(ButtonStyle.Secondary)
  .setDisabled(true)

const blank_3 = new ButtonBuilder()
  .setCustomId(rogueCustomId.ctrl.blank_3)
  .setLabel('-')
  .setStyle(ButtonStyle.Secondary)
  .setDisabled(true)

const blank_4 = new ButtonBuilder()
  .setCustomId(rogueCustomId.ctrl.blank_4)
  .setLabel('-')
  .setStyle(ButtonStyle.Secondary)
  .setDisabled(true)

// === Setup initial ===
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

let player, enemies, items, map, explored, messages, level, score, isGameOver

function save(id) {
  saveGameState(
    {
      player,
      enemies,
      items,
      map,
      explored,
      messages,
      level,
      score,
      isGameOver,
    },
    id
  )
}

function initializeGameState() {
  player = {
    x: Math.floor(mapWidth / 2),
    y: mapHeight - 1,
    symbol: playerSymbol,
    health: 100,
    attack: 10,
    defense: 5,
    inventory: Object.values(itemSymbols).reduce((acc, item) => {
      acc[item] = 0
      return acc
    }, {}),
    armor: '-',
    weapon: '-',
    bonus: '-',
  }
  enemies = []
  items = []
  map = []
  explored = []
  messages = ['']
  level = 1
  score = 0
  isGameOver = false
  initializeMap()
  placeEnemies(5)
  placeItems(3)
  placeExit()
  placeDepot()
}

function initializeMap() {
  map = []
  explored = []
  for (let y = 0; y < mapHeight; y++) {
    const row = []
    const exploredRow = []
    for (let x = 0; x < mapWidth; x++) {
      row.push(wallEmoji)
      exploredRow.push(false)
    }
    map.push(row)
    explored.push(exploredRow)
  }
  createInitialRoom()
  generateRooms()
  map[player.y][player.x] = player.symbol[0]
  revealArea(player.x, player.y)
}

function createInitialRoom() {
  const initialRoomWidth = 5
  const initialRoomHeight = 5
  const startX = Math.floor(player.x - initialRoomWidth / 2)
  const startY = Math.floor(player.y - initialRoomHeight / 2)

  for (let y = startY; y < startY + initialRoomHeight; y++) {
    for (let x = startX; x < startX + initialRoomWidth; x++) {
      if (x >= 0 && x < mapWidth && y >= 0 && y < mapHeight) {
        map[y][x] = floorEmoji
      }
    }
  }
}

function generateRooms() {
  const roomCount = 5
  let prevRoom = { x: player.x, y: player.y, width: 5, height: 5 }
  for (let i = 0; i < roomCount; i++) {
    const roomWidth = Math.floor(Math.random() * 6) + 4
    const roomHeight = Math.floor(Math.random() * 6) + 4
    const x = Math.floor(Math.random() * (mapWidth - roomWidth - 1)) + 1
    const y = Math.floor(Math.random() * (mapHeight - roomHeight - 1)) + 1
    createRoom(x, y, roomWidth, roomHeight)
    connectRooms(prevRoom, { x, y, width: roomWidth, height: roomHeight })
    prevRoom = { x, y, width: roomWidth, height: roomHeight }
  }
}

function createRoom(x, y, width, height) {
  for (let dy = 0; dy < height; dy++) {
    for (let dx = 0; dx < width; dx++) {
      if (x + dx < mapWidth && y + dy < mapHeight) {
        map[y + dy][x + dx] = floorEmoji
      }
    }
  }
}

function connectRooms(roomA, roomB) {
  let pointA = {
    x: Math.floor(roomA.x + roomA.width / 2),
    y: Math.floor(roomA.y + roomA.height / 2),
  }
  let pointB = {
    x: Math.floor(roomB.x + roomB.width / 2),
    y: Math.floor(roomB.y + roomB.height / 2),
  }

  while (pointA.x !== pointB.x) {
    if (
      pointA.x >= 0 &&
      pointA.x < mapWidth &&
      pointA.y >= 0 &&
      pointA.y < mapHeight
    ) {
      map[pointA.y][pointA.x] = floorEmoji
    }
    pointA.x += pointA.x < pointB.x ? 1 : -1
  }

  while (pointA.y !== pointB.y) {
    if (
      pointA.x >= 0 &&
      pointA.x < mapWidth &&
      pointA.y >= 0 &&
      pointA.y < mapHeight
    ) {
      map[pointA.y][pointA.x] = floorEmoji
    }
    pointA.y += pointA.y < pointB.y ? 1 : -1
  }
}

function placeExit() {
  let x, y
  do {
    x = Math.floor(Math.random() * mapWidth)
    y = Math.floor(Math.random() * mapHeight)
  } while (map[y][x] !== floorEmoji || (x === player.x && y === player.y))
  map[y][x] = exitEmoji
}

function placeDepot() {
  let x, y
  do {
    x = Math.floor(Math.random() * mapWidth)
    y = Math.floor(Math.random() * mapHeight)
  } while (map[y][x] !== floorEmoji || (x === player.x && y === player.y))
  map[y][x] = depotEmoji
}

function revealArea(centerX, centerY, radius = 2) {
  for (let y = centerY - radius; y <= centerY + radius; y++) {
    for (let x = centerX - radius; x <= centerX + radius; x++) {
      if (x >= 0 && x < mapWidth && y >= 0 && y < mapHeight) {
        explored[y][x] = true
      }
    }
  }
}

function moveEnemy(enemy, dx, dy) {
  const newX = enemy.x + dx
  const newY = enemy.y + dy
  if (newX >= 0 && newX < mapWidth && newY >= 0 && newY < mapHeight) {
    if (map[newY][newX] === floorEmoji) {
      enemies = enemies.filter((e) => e !== enemy)
      map[enemy.y][enemy.x] = floorEmoji
      enemy.x = newX
      enemy.y = newY
      map[enemy.y][enemy.x] = enemy.symbol
      enemies.push(enemy)
    }
  }
}

function moveVisibleEnemies() {
  enemies.forEach((enemy) => {
    const { x, y } = enemy
    const isVisible = explored[y][x]
    if (!isVisible) return
    const dx = player.x - x
    const dy = player.y - y
    const absDx = Math.abs(dx)
    const absDy = Math.abs(dy)
    if (absDx > absDy) {
      if (dx > 0) moveEnemy(enemy, 1, 0)
      else moveEnemy(enemy, -1, 0)
    } else {
      if (dy > 0) moveEnemy(enemy, 0, 1)
      else moveEnemy(enemy, 0, -1)
    }
  })
}

function drawInterface() {
  let interfaceString = '```\n'
  for (let y = 0; y < mapHeight; y++) {
    for (let x = 0; x < mapWidth; x++) {
      interfaceString += explored[y][x] ? map[y][x] : unexploredEmoji
    }
    interfaceString += '\n'
  }

  interfaceString += '```\n'
  return interfaceString
}

export async function game(interaction) {
  // Quitter le jeu
  if (interaction.customId === rogueCustomId.ctrl.quit)
    return await mainMsg(interaction)

  const id = interaction.user.id
  const customId = interaction.customId
  // Charger l'état du jeu
  const gameState = loadGameState(id)

  if (gameState) {
    player = gameState.player
    enemies = gameState.enemies
    items = gameState.items
    map = gameState.map
    explored = gameState.explored
    level = gameState.level
    score = gameState.score
    isGameOver = gameState.isGameOver

    if (gameState.isGameOver) deleteGameState(id)
  } else {
    resetGame(id)
  }

  if (isGameOver) {
    return await interaction.editReply({
      content: `
Vous êtes mort ! 😵
Score : **${score}** points
 
--- Fin de la partie ---
`,
      components: [mainRow],
    })
  }

  // Gérer les interactions de boutons
  if (customId === rogueCustomId.ctrl.up) await movePlayer(0, -1, interaction)
  if (customId === rogueCustomId.ctrl.down) await movePlayer(0, 1, interaction)
  if (customId === rogueCustomId.ctrl.left) await movePlayer(-1, 0, interaction)
  if (customId === rogueCustomId.ctrl.right) await movePlayer(1, 0, interaction)
  if (customId === rogueCustomId.ctrl.inventory) {
    //TODO : Ouvrir l'inventaire
  }

  save(id)
  const levelBtn = new ButtonBuilder()
    .setCustomId(rogueCustomId.ctrl.level)
    .setLabel(`${level} - ${score}`)
    .setStyle(ButtonStyle.Secondary)
    .setDisabled(true)

  const lifeBtn = new ButtonBuilder()
    .setCustomId(rogueCustomId.ctrl.life)
    .setLabel(`❤️ ${player.health}`)
    .setStyle(ButtonStyle.Secondary)
    .setDisabled(true)

  const forceBtn = new ButtonBuilder()
    .setCustomId(rogueCustomId.ctrl.force)
    .setLabel(`💪 ${player.attack}`)
    .setStyle(ButtonStyle.Secondary)
    .setDisabled(true)

  const defenseBtn = new ButtonBuilder()
    .setCustomId(rogueCustomId.ctrl.def)
    .setLabel(`🛡️ ${player.defense}`)
    .setStyle(ButtonStyle.Secondary)
    .setDisabled(true)

  const weaponBtn = new ButtonBuilder()
    .setCustomId(rogueCustomId.ctrl.weapon)
    .setLabel(`🗡️ ${player.weapon}`)
    .setStyle(ButtonStyle.Secondary)
    .setDisabled(true)

  const armorBtn = new ButtonBuilder()
    .setCustomId(rogueCustomId.ctrl.armor)
    .setLabel(`🛡️ ${player.armor}`)
    .setStyle(ButtonStyle.Secondary)
    .setDisabled(true)

  const bonusBtn = new ButtonBuilder()
    .setCustomId(rogueCustomId.ctrl.bonus)
    .setLabel(`🔧 ${player.bonus}`)
    .setStyle(ButtonStyle.Secondary)
    .setDisabled(true)

  const statsRow = new ActionRowBuilder().addComponents(
    levelBtn,
    lifeBtn,
    forceBtn,
    defenseBtn,
    quitBtn
  )

  const firstRow = new ActionRowBuilder().addComponents(
    blank_1,
    upBtn,
    blank_2,
    weaponBtn
  )
  const secondRow = new ActionRowBuilder().addComponents(
    leftBtn,
    inventoryBtn,
    rightBtn,
    armorBtn
  )
  const thirdRow = new ActionRowBuilder().addComponents(
    blank_3,
    downBtn,
    blank_4,
    bonusBtn
  )

  if (isGameOver) {
    deleteGameState(id)
    return await interaction.editReply({
      content: `
        Vous êtes mort ! 😵
        Score : **${score}** points
        --- Fin de la partie ---
        `,
      components: [mainRow],
    })
  }

  await interaction.editReply({
    content: drawInterface(),
    components: [firstRow, secondRow, thirdRow, statsRow],
  })
}

function getIndexSymbolByLife() {
  const healthPercentage = player.health / 100
  const symbolIndex = Math.floor(
    (1 - healthPercentage) * (player.symbol.length - 1)
  )
  return player.symbol[symbolIndex]
}

async function movePlayer(dx, dy, interaction) {
  const id = interaction.user.id
  const newX = player.x + dx
  const newY = player.y + dy

  if (
    newX >= 0 &&
    newX < mapWidth &&
    newY >= 0 &&
    newY < mapHeight &&
    map[newY][newX] !== wallEmoji
  ) {
    if (
      map[newY][newX] === enemySymbols.virus ||
      map[newY][newX] === enemySymbols.popup ||
      map[newY][newX] === enemySymbols.troll
    ) {
      const enemy = enemies.find((e) => e.x === newX && e.y === newY)
      await fightEnemy(enemy, interaction)
      if (player.health <= 0) return
    } else if (Object.values(itemSymbols).includes(map[newY][newX])) {
      collectItem(map[newY][newX], newX, newY, id)
    } else if (map[newY][newX] === exitEmoji) {
      nextLevel(id)
    } else if (map[newY][newX] === depotEmoji) {
      depositItems(id)
    } else {
      map[player.y][player.x] = floorEmoji
      player.x = newX
      player.y = newY
      map[player.y][player.x] = getIndexSymbolByLife()
      revealArea(player.x, player.y)
    }
    moveVisibleEnemies()
    drawInterface() // Mettre à jour l'interface après le déplacement
  }
}

async function fightEnemy(enemy, interaction) {
  const id = interaction.user.id
  while (player.health > 0 && enemy.health > 0) {
    enemy.health -= Math.max(player.attack - enemy.defense, 0)
    if (enemy.health > 0)
      player.health -= Math.max(enemy.attack - player.defense, 0)
  }

  if (player.health > 0) {
    map[enemy.y][enemy.x] = deathEmoji
    enemies = enemies.filter((e) => e !== enemy)
  } else {
    isGameOver = true
    save(id)
    return await interaction.editReply({
      content: `
Vous êtes mort ! 😵
Score : **${score}** points
 
--- Fin de la partie ---
`,
      components: [mainRow],
    })
  }
  drawInterface()
}

function collectItem(item, x, y, id) {
  player.inventory[item]++
  map[player.y][player.x] = floorEmoji
  player.x = x
  player.y = y
  map[player.y][player.x] = getIndexSymbolByLife()
  console.log(player, item, x, y)
  save(id)
  drawInterface()
}

function placeEnemies(enemyCount, closeToPlayer = false) {
  for (let i = 0; i < enemyCount; i++) {
    let x, y
    if (closeToPlayer) {
      let attempts = 0
      do {
        x = player.x + Math.floor(Math.random() * 5) - 2
        y = player.y + Math.floor(Math.random() * 5) - 2
        attempts++
      } while (
        (x === player.x && y === player.y) || // Not on player's position
        (Math.abs(x - player.x) <= 1 && Math.abs(y - player.y) <= 1) || // At least 2 cells away
        x < 0 ||
        x >= mapWidth ||
        y < 0 ||
        y >= mapHeight || // Within map boundaries
        (map[y][x] !== floorEmoji && // On a floor tile
          attempts < 100) // Prevent infinite loop
      )
    } else {
      do {
        x = Math.floor(Math.random() * mapWidth)
        y = Math.floor(Math.random() * mapHeight)
      } while (map[y][x] !== floorEmoji)
    }

    const enemyType =
      Object.keys(enemySymbols)[
        Math.floor(Math.random() * Object.keys(enemySymbols).length)
      ]
    const enemy = {
      x: x,
      y: y,
      symbol: enemySymbols[enemyType],
      health: 50 + level * 10,
      attack: 8 + level * 2,
      defense: 3 + level,
    }

    enemies.push(enemy)
    map[y][x] = enemy.symbol
  }
}

function placeItems(itemCount) {
  for (let i = 0; i < itemCount; i++) {
    let x, y
    do {
      x = Math.floor(Math.random() * mapWidth)
      y = Math.floor(Math.random() * mapHeight)
    } while (map[y][x] !== floorEmoji)

    const itemType =
      Object.keys(itemSymbols)[
        Math.floor(Math.random() * Object.keys(itemSymbols).length)
      ]
    const item = {
      x: x,
      y: y,
      symbol: itemSymbols[itemType],
    }

    items.push(item)
    map[y][x] = item.symbol
  }
}

function resetGame(id) {
  initializeGameState()
  save(id)
  drawInterface()
}

function nextLevel(id) {
  level++
  player.x = Math.floor(mapWidth / 2)
  player.y = mapHeight - 1
  initializeMap()
  placeEnemies(5 + level)
  placeItems(3 + Math.floor(level / 2))
  placeExit()
  placeDepot()
  save(id)
  drawInterface()
}

function depositItems(id) {
  Object.keys(player.inventory).forEach((key) => {
    score += player.inventory[key] * 10 * level
    player.inventory[key] = 0
  })
  //Faire poper un ennemi
  placeEnemies(1, true)

  save(id)
  drawInterface()
}

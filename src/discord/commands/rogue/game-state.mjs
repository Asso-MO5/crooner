// gameState.js
import fs from 'fs'
const gameStateFile = './_temp/[ID].json'

function saveGameState(gameState, id) {
  fs.writeFileSync(gameStateFile.replace('[ID]', id), JSON.stringify(gameState))
}

function loadGameState(id) {
  const saveFile = gameStateFile.replace('[ID]', id)
  if (fs.existsSync(saveFile)) {
    const gameStateString = fs.readFileSync(saveFile)
    return JSON.parse(gameStateString)
  } else {
    fs.writeFileSync(gameStateFile.replace('[ID]', id), '{}')
  }
  return null
}

function deleteGameState(id) {
  const saveFile = gameStateFile.replace('[ID]', id)
  if (fs.existsSync(saveFile)) {
    fs.unlinkSync(saveFile)
  }
}

export { saveGameState, loadGameState, deleteGameState }

import { filter, reduce, size } from 'lodash'

export function byDungeons(progress, games) {
  if (!progress) return 0
  const numFinished = sum(progress, item => filter(item).length)
  const totalLevels = sum(games, size)
  return perc(numFinished / totalLevels)
}

export function byGames(progress, games) {
  if (!progress) return 0
  const numFinished = reduce(progress, (memo, item, key) => (
    filter(item).length !== size(games[key]) ? memo : memo + 1
  ), 0)
  const totalGames = size(games)
  return perc(numFinished / totalGames)
}

export function forGame(progress, levels) {
  if (!progress) return 0
  const numFinished = filter(progress).length
  const totalLevels = size(levels)
  return perc(numFinished / totalLevels)
}

function perc(num) {
  return Math.round(num * 100)
}

function sum(arr, fn) {
  return reduce(arr, (memo, item) => memo + fn(item), 0)
}

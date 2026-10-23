const hashCode = (value) => {
  let hash = 5381
  const text = String(value)
  for (let i = 0; i < text.length; i += 1) {
    hash = ((hash << 5) + hash + text.charCodeAt(i)) >>> 0
  }
  return hash
}

export const discountPercent = (id) => 20 + (hashCode(id) % 21)

export const discountedPrice = (price, id) => {
  if (price == null) return null
  return Math.round((price * (100 - discountPercent(id))) / 100 / 100) * 100
}

export const SEASON_LABEL = 'Temporada VikingDogs'
export const SEASON_RANGE = '-20% a -40%'

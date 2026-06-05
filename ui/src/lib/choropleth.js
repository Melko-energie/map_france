export const CHORO_SCALE = ['#C9DCC8', '#9DC29B', '#6FA86D', '#3F8A3D', '#2A5C29']
export const CHORO_ZERO = '#E9E4D8'

export function choroplethColor(count, max) {
  if (!count || !max) return CHORO_ZERO
  const idx = Math.min(CHORO_SCALE.length - 1, Math.floor((count / max) * CHORO_SCALE.length))
  return CHORO_SCALE[idx]
}

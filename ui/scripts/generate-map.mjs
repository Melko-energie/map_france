/**
 * Converts France departments GeoJSON to an array of SVG path data.
 * Run: node scripts/generate-map.mjs > src/data/france-paths.js
 */

const GEOJSON_URL = 'https://raw.githubusercontent.com/gregoiredavid/france-geojson/master/departements-version-simplifiee.geojson'

// Simple Mercator-like projection for metropolitan France
// Maps lon/lat to SVG coordinates
function project(lon, lat) {
  // Center roughly on France: lon ~2.5, lat ~46.5
  // Scale to fit in a ~800x800 viewBox
  const scale = 38
  const x = (lon - (-5.5)) * scale
  const y = (52 - lat) * scale
  return [Math.round(x * 10) / 10, Math.round(y * 10) / 10]
}

function coordsToPath(coords) {
  return coords.map((ring, ringIndex) => {
    return ring.map(([lon, lat], i) => {
      const [x, y] = project(lon, lat)
      return `${i === 0 ? 'M' : 'L'}${x},${y}`
    }).join(' ') + ' Z'
  }).join(' ')
}

async function main() {
  const res = await fetch(GEOJSON_URL)
  const data = await res.json()

  const departments = data.features.map(f => {
    const code = f.properties.code
    const name = f.properties.nom
    const geom = f.geometry
    let pathData

    if (geom.type === 'Polygon') {
      pathData = coordsToPath(geom.coordinates)
    } else if (geom.type === 'MultiPolygon') {
      pathData = geom.coordinates.map(poly => coordsToPath(poly)).join(' ')
    }

    return { id: code, name, d: pathData }
  })

  // Filter to only metropolitan + overseas codes we support
  const output = `// Auto-generated from france-geojson. Do not edit manually.
// Run: node scripts/generate-map.mjs > src/data/france-paths.js

const FRANCE_PATHS = ${JSON.stringify(departments, null, 2)}

export default FRANCE_PATHS
`

  console.log(output)
}

main().catch(console.error)

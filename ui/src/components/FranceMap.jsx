import { useNavigate } from 'react-router'
import { getDepartmentName } from '../data/departments'
import FRANCE_PATHS from '../data/france-paths'
import { choroplethColor } from '../lib/choropleth'

export default function FranceMap({ counts = {} }) {
  const navigate = useNavigate()
  const max = Math.max(0, ...Object.values(counts))

  return (
    <svg viewBox="130 50 400 380" className="w-full h-full max-h-[600px]">
      <g>
        {FRANCE_PATHS.map((dept) => (
          <g key={dept.id} onClick={() => navigate(`/department/${dept.id}`)}>
            <title>
              {`${getDepartmentName(dept.id) || dept.name} (${dept.id}) — ${counts[dept.id] || 0} refus`}
            </title>
            <path
              d={dept.d}
              className="map-department"
              fill={choroplethColor(counts[dept.id], max)}
              stroke="#FAF8F4"
              strokeWidth="0.8"
            />
          </g>
        ))}
      </g>
    </svg>
  )
}

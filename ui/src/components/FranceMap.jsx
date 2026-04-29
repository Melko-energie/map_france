import { useNavigate } from 'react-router'
import { getDepartmentName } from '../data/departments'
import FRANCE_PATHS from '../data/france-paths'

export default function FranceMap() {
  const navigate = useNavigate()

  return (
    <svg viewBox="130 50 400 380" className="w-full h-full max-h-[600px]">
      <g>
        {FRANCE_PATHS.map((dept) => (
          <g key={dept.id} onClick={() => navigate(`/department/${dept.id}`)}>
            <title>{getDepartmentName(dept.id) || dept.name} ({dept.id})</title>
            <path
              d={dept.d}
              className="map-department"
              fill="#48626e"
              stroke="#ffffff"
              strokeWidth="0.8"
            />
          </g>
        ))}
      </g>
    </svg>
  )
}

import { createBrowserRouter } from 'react-router'
import App from './App'
import HomePage from './pages/HomePage'
import DepartmentPage from './pages/DepartmentPage'

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      { index: true, element: <HomePage /> },
      { path: 'department/:id', element: <DepartmentPage /> },
    ],
  },
])

export default router

import { createBrowserRouter } from 'react-router'
import App from './App'
import HomePage from './pages/HomePage'
import DepartmentPage from './pages/DepartmentPage'
import AdminLayout from './pages/admin/AdminLayout'
import LoginPage from './pages/admin/LoginPage'
import DashboardPage from './pages/admin/DashboardPage'
import RefusalsPage from './pages/admin/RefusalsPage'
import DepartmentsAdminPage from './pages/admin/DepartmentsAdminPage'

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      { index: true, element: <HomePage /> },
      { path: 'department/:id', element: <DepartmentPage /> },
    ],
  },
  { path: '/admin/login', element: <LoginPage /> },
  {
    path: '/admin',
    element: <AdminLayout />,
    children: [
      { index: true, element: <DashboardPage /> },
      { path: 'refusals', element: <RefusalsPage /> },
      { path: 'departments', element: <DepartmentsAdminPage /> },
    ],
  },
])

export default router

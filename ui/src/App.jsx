import { Outlet } from 'react-router'
import Header from './components/Header'
import Footer from './components/Footer'

export default function App() {
  return (
    <div className="min-h-screen flex flex-col relative z-[1]">
      <Header />
      <main className="pt-20 flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}

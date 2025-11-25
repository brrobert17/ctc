import { Outlet } from '@tanstack/react-router'
import { Header } from './Header'
import { Footer } from './Footer'
import { ChatAssistantDrawer } from '../ai/ChatAssistantDrawer'

export default function AppLayout() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100 font-sans antialiased selection:bg-sky-500/30">
      <Header />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
      <ChatAssistantDrawer />
    </div>
  )
}

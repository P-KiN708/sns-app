import { useState, useEffect } from "react";
import type { Session } from "@supabase/supabase-js";
import { Routes, Route } from 'react-router-dom';
import { supabase } from "./lib/supabase";
import  Auth  from "./components/Auth";
import  Layout from "./components/Layout";
import Home from "./pages/Home"
import Settings from './pages/Settings';
import PostDetail from './pages/PostDetail'

function App() {
  const [session, setSession] = useState<Session | null>(null)

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session)
    })

    const {data: listener} = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })

    return () => listener.subscription.unsubscribe()
  }, [])

  if (!session) {
    return <Auth />
  }

  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="settings" element={<Settings />} />
        <Route path="posts/:id" element={<PostDetail />} />
      </Route>
    </Routes>
  )
}

export default App
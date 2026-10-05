import { Outlet, Link } from "react-router-dom";
import { supabase } from "../lib/supabase";
import "./Layout.css"

function Layout() {
    return (
        <div className="layout">

            <nav className="sidebar">
                <h2>SNS App</h2>
                
                <Link to="/" className="nav-link">🏠 ホーム</Link>
                <Link to="/settings" className="nav-link">⚙️ 設定</Link>

                <button onClick={() => supabase.auth.signOut()} className="logout-button">
                    ログアウト
                </button>
            </nav>

            <main className="main-content">
                <Outlet />
            </main>
        </div>
    )
}

export default Layout
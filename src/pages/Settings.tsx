import { useEffect, useState } from "react"
import { supabase } from "../lib/supabase"
import "./settings.css"

function Settings() {
    const [userId, setUserId] = useState<string | null>(null)
    const [username, setUsername] = useState('')
    const [loading, setLoading] = useState(false)
    const [message, setMessage] = useState('')

    const fetchProfile = async () => {
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) return
        setUserId(user.id)

        const { data, error } = await supabase
        .from('profiles')
        .select('username')
        .eq('id', user.id)
        .single()

        if (error) {
            console.error(error.message)
            return
        }
        setUsername(data.username)
    }

    useEffect(() => {
        fetchProfile()
    }, [])

    const handleSave = async () => {
        if (!userId || !username.trim()) return
        setLoading(true)
        setMessage('')

        const { error } = await supabase
        .from('profiles')
        .update({ username })
        .eq('id', userId)

        if (error) {
            setMessage(`更新エラー: ${error.message}`)
        } else {
            setMessage('保存しました！')
        }
        setLoading(false)
    }

    return (
        <div className="settings-page">
            <div className="home-header">
                <h1>設定</h1>
            </div>

            <div className="settings-form">
                <label className="settings-label">ユーザー名</label>
                <input 
                    type="text" 
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    maxLength={20}
                />
                <button onClick={handleSave} disabled={loading} className="post-submit-button">
                    保存
                </button>
                {message && <p className="settings-message">{message}</p>}
            </div>
        </div>
    )
}



export default Settings
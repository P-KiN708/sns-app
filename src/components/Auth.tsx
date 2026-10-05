import { useState } from "react";
import { supabase } from "../lib/supabase";

function Auth() {

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [loading, setLoading] = useState(false)
    const [message, setMessage] = useState('')

    const handleSignUp = async () => {
        setLoading(true)
        setMessage('')

        const { data, error } = await supabase.auth.signUp({ email, password })
        if (error) {
            setMessage(`登録エラー: ${error.message}`)
            setLoading(false)
            return
        }
        
        if (data.user) {
            const username = email.split('@')[0]
            await supabase.from('profiles').insert({ id: data.user.id, username})
        }

        setMessage('登録しました！確認メールをご確認ください。')
        setLoading(false)
    }

    const handleSignIn = async () => {
        setLoading(true)
        setMessage('')

        const { error } = await supabase.auth.signInWithPassword({ email, password })
        if (error) {
            setMessage(`ログインエラー: ${error.message}`)         
        } else {
            setMessage('ログインしました！')
        }
        setLoading(false)
    }

    return (
        <div style={{ maxWidth: 320, margin: '80px auto'}}>
            <h2>ログイン / 新規登録</h2>
            <input 
                type="email"
                placeholder="メールアドレス"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{display: 'block', width: '100%', marginBottom: 8 }}
            />
            <input 
                type="password"
                placeholder="パスワード"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{display: 'block', width: '100%', marginBottom: 8 }}
            />
            <button onClick={handleSignIn} disabled={loading}>ログイン</button>
            <button onClick={handleSignUp} disabled={loading}>新規登録</button>
            {message && <p>{message}</p>}
        </div>
    )
}

export default Auth
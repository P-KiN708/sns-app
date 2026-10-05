import { useEffect, useState } from "react"
import { useParams, Link } from "react-router-dom"
import { supabase } from "../lib/supabase"
import "./PostDetail.css"
import { formatRelativeTime } from "../lib/formatTime";

type Comment = {
    id: string
    user_id: string
    content: string
    created_at: string
    profiles: { username: string } | null
}

function PostDetail() {
    const { id } = useParams<{ id: string }>()

    const [comments, setComments] = useState<Comment[]>([])
    const [content, setContent] = useState('')
    const [myUserId, setMyUserId] = useState<string | null>(null)
    const [commenting, setCommenting] = useState(false)

    const fetchComments = async () => {
        const { data: { user }} = await supabase.auth.getUser()
        setMyUserId(user?.id ?? null)

        const { data, error } = await supabase
            .from('comments')
            .select('*, profiles(username)')
            .eq('post_id', id)
            .order('created_at', { ascending: true })
    
        if (error) {
            console.error(error.message)
            return
        }
        setComments(data)    
    }

    useEffect(() => {
        fetchComments()
    }, [id])

    const handleComment = async () => {
        if (!content.trim()) return
        const { error } = await supabase
            .from('comments')
            .insert({ post_id: id, content })
        
        if (error) {
            console.error(error.message)
            return
        }
        setContent('')
        fetchComments()
        setCommenting(false)
    }

    const handleDeleteComment = async (commentId: string) => {
        const ok = window.confirm('このコメントを削除しますか？')
        if (!ok) return

        const { error } = await supabase.from('comments').delete().eq('id', commentId)
        if (error) {
            console.error(error.message)
        }
        fetchComments()
    }

    return (
        <div>
            <div className="home-header">
                <Link to="/" className="back-link">← 戻る</Link>
                <h1>投稿詳細</h1>
            </div>

            <div className="post-form">
                <textarea 
                    placeholder="コメントする"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    maxLength={280}
                    rows={2}
                />
                <div className="post-form-footer">
                    <button onClick={handleComment} disabled={commenting || !content.trim()} className="post-submit-button">
                        {commenting ? '送信中...' : '送信'}
                    </button>
                </div>
            </div>

            <ul className="post-list">
                {comments.map((comment) => (
                    <li key={comment.id} className="post-item">
                        <strong>{comment.profiles?.username ?? '名無し'}</strong>
                        <p>{comment.content}</p>
                        <small className="post-time">
                            {formatRelativeTime(comment.created_at)}
                        </small>

                        {comment.user_id === myUserId && (
                            <button
                                onClick={() => handleDeleteComment(comment.id)}
                                className="delete-button"
                            >
                                削除
                            </button>
                        )}
                    </li>
                ))}
            </ul>
        </div>
    )
}

export default PostDetail
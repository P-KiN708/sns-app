import { useEffect, useState } from "react"
import { supabase } from "../lib/supabase"
import "./Home.css"
import { formatRelativeTime } from "../lib/formatTime";
import { useNavigate } from "react-router-dom";

type Post = {
    id: string
    user_id: string
    content: string
    created_at: string
    profiles: { username: string} | null
    like_count: number
    liked_by_me: boolean
}

function Home() {
    const [posts, setPosts] = useState<Post[]>([])
    const [content, setContent] = useState('')
    const [myUserId, setMyUserId] = useState<string | null>(null)
    const [posting, setPosting] = useState(false)
    const navigate = useNavigate() 

    const fetchPosts = async () => {
        const { data: {user} } = await supabase.auth.getUser()
        setMyUserId(user?.id ?? null)

        const { data, error } = await supabase
            .from('posts')
            .select('*, profiles(username), likes(user_id)')
            .order('created_at', { ascending: false })

        if (error) {
            console.error(error.message)
            return
        }

        const formatted = data.map((post) => ({
            ...post,
            like_count: post.likes.length,
            liked_by_me: post.likes.some((like: { user_id: string}) => like.user_id === user?.id),
        }))
        setPosts(formatted)
    }

    const handleLike = async (postId: string, likedByMe: boolean) => {
        const { data: {user} } = await supabase.auth.getUser()
        if (!user) return

        if (likedByMe) {
            await supabase.from('likes').delete().eq('post_id', postId).eq('user_id', user.id)
        } else {
            await supabase.from('likes').insert({ post_id: postId, user_id: user.id })
        }
        fetchPosts()
    }

    const handleDelete = async (postId: string) => {
        const ok = window.confirm('この投稿を削除しますか？')
        if (!ok) return

        const {error} = await supabase.from('posts').delete().eq('id', postId)
        if (error) {
            console.error(error.message)
            return
        }
        fetchPosts()
    }

    useEffect(() => {
        fetchPosts()
    }, [])

    const handlePost = async () => {
        if (!content.trim()) return
        setPosting(true)
        const { error } = await supabase.from('posts').insert({ content })
        if (error) {
            console.error(error.message)
            setPosting(false)
            return
        }
        setContent('')
        fetchPosts()
        setPosting(false)
    }

    return (
        <div>
            <div className="home-header">
                <h1>ホーム</h1>
            </div>

            <div className="post-form">
                <textarea
                    placeholder="いまどうしてる？"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    maxLength={280}
                    rows={3}
                />
                <div className="post-form-footer">
                    <button onClick={handlePost} disabled={posting || !content.trim()} className="post-submit-button">
                        {posting ? '投稿中...' : '投稿'}
                    </button>
                </div>
            </div>

            <ul className="post-list">
                {posts.map((post) => (
                    <li 
                        key={post.id} 
                        className="post-item"
                        onClick={() => navigate(`/posts/${post.id}`)}
                    >                       
                        <strong>{post.profiles?.username ?? '名無し'}</strong>
                        <p>{post.content}</p>
                        <small className="post-time">
                            {formatRelativeTime(post.created_at)}
                        </small>
                
                        <div>
                            <button 
                                onClick={(e) => {
                                    e.stopPropagation()
                                    handleLike(post.id, post.liked_by_me)
                                }}
                                className={`like-button ${post.liked_by_me ? 'liked' : ''}`}
                            >
                                {post.liked_by_me ? '♥' : '♡'} {post.like_count}
                            </button>

                            {post.user_id === myUserId && (
                                <button 
                                    onClick={(e) => {
                                        e.stopPropagation()
                                        handleDelete(post.id)
                                    }}                              
                                    className="delete-button"
                                >
                                    削除
                                </button>
                            )}
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    )

}


export default Home
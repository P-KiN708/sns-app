// ① 日時を「〇分前」のような表示に変換する関数
export function formatRelativeTime(dateString: string): string {
    const date = new Date(dateString)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffSec = Math.floor(diffMs / 1000)

    // ② 経過時間に応じて表示を変える
    if (diffSec < 60) return 'たった今'
    const diffMin = Math.floor(diffSec / 60)
    if (diffMin < 60) return `${diffMin}分前`
    const diffHour = Math.floor(diffMin / 60)
    if (diffHour < 24) return `${diffHour}時間前`
    const diffDay = Math.floor(diffHour / 24)
    if (diffDay < 7) return `${diffDay}日前`

    // ③ 1週間以上前は通常の日付表示にする
    return date.toLocaleDateString('ja-JP')
}
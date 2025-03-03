export interface ChattingInfo {
    id: string
    role: 'ai' | 'user',
    type: 'thinking' | 'info' | 'question'
    info: string
}
export interface Chatting {
    id: string
    title: string
    info: ChattingInfo[]
}
export interface ChattingStream {
    
}
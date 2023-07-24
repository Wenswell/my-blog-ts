export interface CNotice {
  notice: {
    info: (text: string, duration?: number) => void
    success: (text: string, duration?: number) => void
    warning: (text: string, duration?: number) => void
    error: (text: string, duration?: number) => void
  }
}

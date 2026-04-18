export interface MoodLog {
  id: number
  mood_tag: string
  mood_score: number
  logged_at: string
}

export interface MoodLogResponse {
  message: string
  mood_log: MoodLog
  coping_tip: CopingTip
}

export interface CopingTip {
  id: number
  tip_text: string
}
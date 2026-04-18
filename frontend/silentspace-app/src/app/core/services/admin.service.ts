import { Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { Observable } from 'rxjs'
import { environment } from '../../../environments/environment'

export interface MoodTrend {
  mood_tag: string
  total_logs: number
}

export interface AdminMoodLog {
  id: number
  user_ref: string
  mood_tag: string
  mood_score: number
  logged_at: string
}

export interface AdminStats {
  total_logs_this_week: number
  most_common_mood: string | null
  active_users_this_week: number
}

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  private apiUrl = environment.apiUrl

  constructor(private http: HttpClient) {}

  // Get weekly mood trend counts per tag
  getMoodTrends(): Observable<{ trends: MoodTrend[] }> {
    return this.http.get<{ trends: MoodTrend[] }>(
      `${this.apiUrl}/api/admin/mood-trends`
    )
  }

  // Get all mood logs anonymized with stats
  getAllMoodLogs(): Observable<{ mood_logs: AdminMoodLog[], stats: AdminStats }> {
    return this.http.get<{ mood_logs: AdminMoodLog[], stats: AdminStats }>(
      `${this.apiUrl}/api/admin/mood-logs`
    )
  }
}
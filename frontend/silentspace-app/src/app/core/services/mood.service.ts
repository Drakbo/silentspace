import { Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { Observable } from 'rxjs'
import { environment } from '../../../environments/environment'
import { MoodLog, MoodLogResponse } from '../../shared/models/mood-log.model'

@Injectable({
  providedIn: 'root'
})
export class MoodService {
  private apiUrl = environment.apiUrl

  constructor(private http: HttpClient) {}

  // Submit a mood log with a mood tag
  logMood(mood_tag: string): Observable<MoodLogResponse> {
    return this.http.post<MoodLogResponse>(`${this.apiUrl}/api/mood-logs`, { mood_tag })
  }

  // Get all mood logs for current user
  getMoodLogs(): Observable<{ mood_logs: MoodLog[] }> {
    return this.http.get<{ mood_logs: MoodLog[] }>(`${this.apiUrl}/api/mood-logs`)
  }

  // Get past 7 days mood logs for current user
  getWeeklyMoodLogs(): Observable<{ mood_logs: MoodLog[] }> {
    return this.http.get<{ mood_logs: MoodLog[] }>(`${this.apiUrl}/api/mood-logs/weekly`)
  }
}
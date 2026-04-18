import { Component, OnInit } from '@angular/core'
import { CommonModule } from '@angular/common'
import { RouterLink } from '@angular/router'
import { AdminService, AdminMoodLog, AdminStats } from '../../../core/services/admin.service'
import { AuthService } from '../../../core/services/auth.service'

@Component({
  selector: 'app-admin-mood-logs',
  imports: [CommonModule, RouterLink],
  templateUrl: './mood-logs.html',
  styleUrl: './mood-logs.scss'
})
export class MoodLogs implements OnInit {
  moodLogs: AdminMoodLog[] = []
  stats: AdminStats = {
    total_logs_this_week: 0,
    most_common_mood: null,
    active_users_this_week: 0
  }
  isLoading = true

  moodEmojis: Record<string, string> = {
    Happy: '😊',
    Calm: '😌',
    Anxious: '😰',
    Sad: '😢',
    Angry: '😠'
  }

  moodColors: Record<string, string> = {
    Happy: '#7DAF7A',
    Calm: '#7A9EAF',
    Anxious: '#D4956A',
    Sad: '#8A7AAF',
    Angry: '#C1614A'
  }

  constructor(
    private adminService: AdminService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.loadData()
  }

  loadData(): void {
    this.adminService.getAllMoodLogs().subscribe({
      next: (response) => {
        this.moodLogs = response.mood_logs
        this.stats = response.stats
        this.isLoading = false
      },
      error: () => {
        this.isLoading = false
      }
    })
  }

  logout(): void {
    this.authService.logout()
  }
}
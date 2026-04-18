import { Component, OnInit } from '@angular/core'
import { CommonModule } from '@angular/common'
import { RouterLink } from '@angular/router'
import { AdminService, MoodTrend, AdminStats } from '../../../core/services/admin.service'
import { AuthService } from '../../../core/services/auth.service'

@Component({
  selector: 'app-admin-dashboard',
  imports: [CommonModule, RouterLink],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss'
})
export class Dashboard implements OnInit {
  trends: MoodTrend[] = []
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
    this.adminService.getMoodTrends().subscribe({
      next: (response) => {
        this.trends = response.trends
        this.isLoading = false
      },
      error: () => {
        this.isLoading = false
      }
    })

    this.adminService.getAllMoodLogs().subscribe({
      next: (response) => {
        this.stats = response.stats
      },
      error: () => {}
    })
  }

  logout(): void {
    this.authService.logout()
  }

  // Get the highest log count for chart scaling
  getMaxLogs(): number {
    if (this.trends.length === 0) return 1
    return Math.max(...this.trends.map(t => t.total_logs), 1)
  }
}
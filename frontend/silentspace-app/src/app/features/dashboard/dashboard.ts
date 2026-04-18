import { Component, OnInit } from '@angular/core'
import { CommonModule } from '@angular/common'
import { Router, RouterLink } from '@angular/router'
import { AuthService } from '../../core/services/auth.service'
import { MoodService } from '../../core/services/mood.service'
import { ResourceService } from '../../core/services/resource.service'
import { MoodLog } from '../../shared/models/mood-log.model'
import { Resource } from '../../shared/models/resource.model'
import { User } from '../../shared/models/user.model'

@Component({
  selector: 'app-dashboard',
  imports: [CommonModule, RouterLink],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss'
})
export class Dashboard implements OnInit {
  currentUser: User | null = null
  todayLog: MoodLog | null = null
  weeklyLogs: MoodLog[] = []
  resources: Resource[] = []
  isLoading = true

  // Mood tag colors for display
  moodColors: Record<string, string> = {
    Happy: '#7DAF7A',
    Calm: '#7A9EAF',
    Anxious: '#D4956A',
    Sad: '#8A7AAF',
    Angry: '#C1614A'
  }

  // Mood emojis for display
  moodEmojis: Record<string, string> = {
    Happy: '😊',
    Calm: '😌',
    Anxious: '😰',
    Sad: '😢',
    Angry: '😠'
  }

  constructor(
    private authService: AuthService,
    private moodService: MoodService,
    private resourceService: ResourceService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.currentUser = this.authService.getCurrentUser()
    this.loadData()
  }

  loadData(): void {
    // Load weekly mood logs
    this.moodService.getWeeklyMoodLogs().subscribe({
      next: (response) => {
        this.weeklyLogs = response.mood_logs

        // Check if user already logged today
        const today = new Date().toDateString()
        this.todayLog = this.weeklyLogs.find(log => {
          return new Date(log.logged_at).toDateString() === today
        }) || null

        this.isLoading = false
      },
      error: () => {
        this.isLoading = false
      }
    })

    // Load first 2 resources for sidebar
    this.resourceService.getResources().subscribe({
      next: (response) => {
        this.resources = response.resources.slice(0, 2)
      },
      error: () => {}
    })
  }

  // Get greeting based on time of day
  getGreeting(): string {
    const hour = new Date().getHours()
    if (hour < 12) return 'Good morning'
    if (hour < 18) return 'Good afternoon'
    return 'Good evening'
  }

  logout(): void {
    this.authService.logout()
  }
}
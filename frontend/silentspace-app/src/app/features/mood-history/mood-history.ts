import { Component, OnInit } from '@angular/core'
import { CommonModule } from '@angular/common'
import { RouterLink } from '@angular/router'
import { MoodService } from '../../core/services/mood.service'
import { AuthService } from '../../core/services/auth.service'
import { MoodLog } from '../../shared/models/mood-log.model'

@Component({
  selector: 'app-mood-history',
  imports: [CommonModule, RouterLink],
  templateUrl: './mood-history.html',
  styleUrl: './mood-history.scss'
})
export class MoodHistory implements OnInit {
  allLogs: MoodLog[] = []
  weeklyLogs: MoodLog[] = []
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

  // Summary counts per mood tag for this week
  moodSummary: { tag: string, emoji: string, count: number }[] = []

  constructor(
    private moodService: MoodService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.loadData()
  }

  loadData(): void {
    // Load all mood logs
    this.moodService.getMoodLogs().subscribe({
      next: (response) => {
        this.allLogs = response.mood_logs
        this.isLoading = false
      },
      error: () => {
        this.isLoading = false
      }
    })

    // Load weekly logs for chart and summary
    this.moodService.getWeeklyMoodLogs().subscribe({
      next: (response) => {
        this.weeklyLogs = response.mood_logs
        this.buildMoodSummary()
      },
      error: () => {}
    })
  }

  buildMoodSummary(): void {
    const tags = ['Happy', 'Calm', 'Anxious', 'Sad', 'Angry']
    this.moodSummary = tags.map(tag => ({
      tag,
      emoji: this.moodEmojis[tag],
      count: this.weeklyLogs.filter(log => log.mood_tag === tag).length
    }))
  }

  logout(): void {
    this.authService.logout()
  }
}
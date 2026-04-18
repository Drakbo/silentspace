import { Component } from '@angular/core'
import { CommonModule } from '@angular/common'
import { Router, RouterLink } from '@angular/router'
import { MoodService } from '../../core/services/mood.service'
import { AuthService } from '../../core/services/auth.service'
import { MoodLogResponse } from '../../shared/models/mood-log.model'

@Component({
  selector: 'app-mood-log',
  imports: [CommonModule, RouterLink],
  templateUrl: './mood-log.html',
  styleUrl: './mood-log.scss'
})
export class MoodLog {
  selectedMood: string | null = null
  isLoading = false
  errorMessage = ''
  alreadyLoggedToday = false

  moods = [
    { tag: 'Happy', emoji: '😊', color: '#7DAF7A' },
    { tag: 'Calm', emoji: '😌', color: '#7A9EAF' },
    { tag: 'Anxious', emoji: '😰', color: '#D4956A' },
    { tag: 'Sad', emoji: '😢', color: '#8A7AAF' },
    { tag: 'Angry', emoji: '😠', color: '#C1614A' },
  ]

  constructor(
    private moodService: MoodService,
    private router: Router,
    private authService: AuthService
  ) {}

  selectMood(tag: string): void {
    this.selectedMood = tag
    this.errorMessage = ''
  }

  logout(): void {
    this.authService.logout()
  }

  onSubmit(): void {
    if (!this.selectedMood) {
      this.errorMessage = 'Please select a mood tag first.'
      return
    }

    this.isLoading = true
    this.errorMessage = ''

    this.moodService.logMood(this.selectedMood).subscribe({
      next: (response: MoodLogResponse) => {
        this.isLoading = false
        this.router.navigate(['/coping-tip'], {
          state: {
            mood_tag: response.mood_log.mood_tag,
            mood_score: response.mood_log.mood_score,
            tip_text: response.coping_tip.tip_text
          }
        })
      },
      error: (err) => {
        this.isLoading = false
        if (err.status === 409) {
          this.alreadyLoggedToday = true
          this.errorMessage = 'You have already logged your mood today.'
        } else {
          this.errorMessage = err.error?.error || 'Something went wrong. Please try again.'
        }
      }
    })
  }
}
import { Component, OnInit } from '@angular/core'
import { CommonModule } from '@angular/common'
import { Router, RouterLink } from '@angular/router'
import { HttpClient } from '@angular/common/http'
import { environment } from '../../../environments/environment'

@Component({
  selector: 'app-coping-tip',
  imports: [CommonModule, RouterLink],
  templateUrl: './coping-tip.html',
  styleUrl: './coping-tip.scss'
})
export class CopingTip implements OnInit {
  moodTag = ''
  moodScore = 0
  tipText = ''

  moodEmojis: Record<string, string> = {
    Happy: '😊',
    Calm: '😌',
    Anxious: '😰',
    Sad: '😢',
    Angry: '😠'
  }

  constructor(
    private router: Router,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    const state = this.router.getCurrentNavigation()?.extras.state
      || history.state

    if (state?.mood_tag) {
      this.moodTag = state.mood_tag
      this.moodScore = state.mood_score
      this.tipText = state.tip_text
    } else {
      this.router.navigate(['/log-mood'])
    }
  }

  // Fetch a new random tip for the same mood tag
  showAnotherTip(): void {
    if (!this.moodTag) return

    this.http.get<any>(
      `${environment.apiUrl}/api/coping-tips/${this.moodTag}`
    ).subscribe({
      next: (response) => {
        this.tipText = response.tip.tip_text
      },
      error: () => {}
    })
  }

  goToDashboard(): void {
    this.router.navigate(['/dashboard'])
  }

  logout(): void {
    this.router.navigate(['/login'])
  }
}
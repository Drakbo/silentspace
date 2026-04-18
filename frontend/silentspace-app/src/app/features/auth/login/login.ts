import { Component } from '@angular/core'
import { CommonModule } from '@angular/common'
import { FormsModule } from '@angular/forms'
import { Router, RouterLink } from '@angular/router'
import { AuthService } from '../../../core/services/auth.service'

@Component({
  selector: 'app-login',
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './login.html',
  styleUrl: './login.scss'
})
export class Login {
  email = ''
  password = ''
  errorMessage = ''
  isLoading = false

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  onSubmit(): void {
    // Clear previous errors
    this.errorMessage = ''

    // Basic validation
    if (!this.email || !this.password) {
      this.errorMessage = 'Please fill in all fields.'
      return
    }

    this.isLoading = true

    this.authService.login(this.email, this.password).subscribe({
      next: (response) => {
        this.isLoading = false
        // Redirect based on user type
        if (response.user.user_type_id === 2) {
          this.router.navigate(['/admin/dashboard'])
        } else {
          this.router.navigate(['/dashboard'])
        }
      },
      error: (err) => {
        this.isLoading = false
        this.errorMessage = err.error?.error || 'Login failed. Please try again.'
      }
    })
  }
}
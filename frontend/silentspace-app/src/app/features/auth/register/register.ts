import { Component } from '@angular/core'
import { CommonModule } from '@angular/common'
import { FormsModule } from '@angular/forms'
import { Router, RouterLink } from '@angular/router'
import { AuthService } from '../../../core/services/auth.service'

@Component({
  selector: 'app-register',
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './register.html',
  styleUrl: './register.scss'
})
export class Register {
  firstName = ''
  lastName = ''
  email = ''
  password = ''
  confirmPassword = ''
  errorMessage = ''
  isLoading = false

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  onSubmit(): void {
    this.errorMessage = ''

    // Validate all fields are filled
    if (!this.firstName || !this.lastName || !this.email || !this.password || !this.confirmPassword) {
      this.errorMessage = 'Please fill in all fields.'
      return
    }

    // Validate passwords match
    if (this.password !== this.confirmPassword) {
      this.errorMessage = 'Passwords do not match.'
      return
    }

    // Validate password length
    if (this.password.length < 6) {
      this.errorMessage = 'Password must be at least 6 characters.'
      return
    }

    this.isLoading = true

    this.authService.register({
      first_name: this.firstName,
      last_name: this.lastName,
      email: this.email,
      password: this.password
    }).subscribe({
      next: () => {
        this.isLoading = false
        this.router.navigate(['/dashboard'])
      },
      error: (err) => {
        this.isLoading = false
        this.errorMessage = err.error?.error || 'Registration failed. Please try again.'
      }
    })
  }
}
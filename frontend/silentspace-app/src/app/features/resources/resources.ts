import { Component, OnInit } from '@angular/core'
import { CommonModule } from '@angular/common'
import { RouterLink } from '@angular/router'
import { ResourceService } from '../../core/services/resource.service'
import { AuthService } from '../../core/services/auth.service'
import { Resource } from '../../shared/models/resource.model'

@Component({
  selector: 'app-resources',
  imports: [CommonModule, RouterLink],
  templateUrl: './resources.html',
  styleUrl: './resources.scss'
})
export class Resources implements OnInit {
  allResources: Resource[] = []
  filteredResources: Resource[] = []
  activeFilter = 'All'
  isLoading = true
  isLoggedIn = false

  filters = ['All', 'Counselor', 'Hotline', 'Wellness Org']

  constructor(
    private resourceService: ResourceService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.isLoggedIn = this.authService.isLoggedIn()
    this.loadResources()
  }

  loadResources(): void {
    this.resourceService.getResources().subscribe({
      next: (response) => {
        this.allResources = response.resources
        this.filteredResources = response.resources
        this.isLoading = false
      },
      error: () => {
        this.isLoading = false
      }
    })
  }

  setFilter(filter: string): void {
    this.activeFilter = filter
    if (filter === 'All') {
      this.filteredResources = this.allResources
    } else {
      this.filteredResources = this.allResources.filter(
        r => r.type === filter
      )
    }
  }

  logout(): void {
    this.authService.logout()
  }
}
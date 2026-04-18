import { Component, OnInit } from '@angular/core'
import { CommonModule } from '@angular/common'
import { FormsModule } from '@angular/forms'
import { RouterLink } from '@angular/router'
import { ResourceService } from '../../../core/services/resource.service'
import { AuthService } from '../../../core/services/auth.service'
import { Resource } from '../../../shared/models/resource.model'

@Component({
  selector: 'app-resource-management',
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './resource-management.html',
  styleUrl: './resource-management.scss'
})
export class ResourceManagement implements OnInit {
  resources: Resource[] = []
  isLoading = true
  showModal = false
  isEditing = false
  isSaving = false
  deleteConfirmId: number | null = null

  // Form fields
  formId: number | null = null
  formName = ''
  formType = ''
  formAddress = ''
  formContact = ''
  formDescription = ''
  formError = ''

  resourceTypes = ['Counselor', 'Hotline', 'Wellness Org']

  constructor(
    private resourceService: ResourceService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.loadResources()
  }

  loadResources(): void {
    this.resourceService.getResources().subscribe({
      next: (response) => {
        this.resources = response.resources
        this.isLoading = false
      },
      error: () => {
        this.isLoading = false
      }
    })
  }

  openAddModal(): void {
    this.isEditing = false
    this.resetForm()
    this.showModal = true
  }

  openEditModal(resource: Resource): void {
    this.isEditing = true
    this.formId = resource.id
    this.formName = resource.name
    this.formType = resource.type
    this.formAddress = resource.address
    this.formContact = resource.contact
    this.formDescription = resource.description || ''
    this.formError = ''
    this.showModal = true
  }

  closeModal(): void {
    this.showModal = false
    this.resetForm()
  }

  resetForm(): void {
    this.formId = null
    this.formName = ''
    this.formType = ''
    this.formAddress = ''
    this.formContact = ''
    this.formDescription = ''
    this.formError = ''
  }

  saveResource(): void {
    if (!this.formName || !this.formType || !this.formAddress || !this.formContact) {
      this.formError = 'Please fill in all required fields.'
      return
    }

    this.isSaving = true
    this.formError = ''

    const data = {
      name: this.formName,
      type: this.formType,
      address: this.formAddress,
      contact: this.formContact,
      description: this.formDescription || null
    }

    if (this.isEditing && this.formId) {
      this.resourceService.updateResource(this.formId, data).subscribe({
        next: () => {
          this.isSaving = false
          this.closeModal()
          this.loadResources()
        },
        error: (err) => {
          this.isSaving = false
          this.formError = err.error?.error || 'Failed to update resource.'
        }
      })
    } else {
      this.resourceService.addResource(data).subscribe({
        next: () => {
          this.isSaving = false
          this.closeModal()
          this.loadResources()
        },
        error: (err) => {
          this.isSaving = false
          this.formError = err.error?.error || 'Failed to add resource.'
        }
      })
    }
  }

  confirmDelete(id: number): void {
    this.deleteConfirmId = id
  }

  cancelDelete(): void {
    this.deleteConfirmId = null
  }

  deleteResource(id: number): void {
    this.resourceService.deleteResource(id).subscribe({
      next: () => {
        this.deleteConfirmId = null
        this.loadResources()
      },
      error: () => {
        this.deleteConfirmId = null
      }
    })
  }

  logout(): void {
    this.authService.logout()
  }
}
import { Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { Observable } from 'rxjs'
import { environment } from '../../../environments/environment'
import { Resource } from '../../shared/models/resource.model'

@Injectable({
  providedIn: 'root'
})
export class ResourceService {
  private apiUrl = environment.apiUrl

  constructor(private http: HttpClient) {}

  // Get all resources, optionally filtered by type
  getResources(type?: string): Observable<{ resources: Resource[] }> {
    const url = type
      ? `${this.apiUrl}/api/resources?type=${type}`
      : `${this.apiUrl}/api/resources`
    return this.http.get<{ resources: Resource[] }>(url)
  }

  // Add a new resource (admin only)
  addResource(data: Omit<Resource, 'id'>): Observable<{ message: string, resource: Resource }> {
    return this.http.post<{ message: string, resource: Resource }>(`${this.apiUrl}/api/resources`, data)
  }

  // Edit an existing resource (admin only)
  updateResource(id: number, data: Omit<Resource, 'id'>): Observable<{ message: string }> {
    return this.http.put<{ message: string }>(`${this.apiUrl}/api/resources/${id}`, data)
  }

  // Delete a resource (admin only)
  deleteResource(id: number): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.apiUrl}/api/resources/${id}`)
  }
}
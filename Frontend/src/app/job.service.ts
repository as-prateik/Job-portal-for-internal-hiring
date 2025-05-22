import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class JobService {
  private apiUrl = 'http://localhost:3000/jobs';  // Backend API endpoint

  constructor(private http: HttpClient) {}

  getJobs(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  createJob(job: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/create`, job);  // Send POST request to create a job
  }

  updateJob(id: string, job: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${id}`, job);
  }

  deleteJob(id: string): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`);
  }

  manageApplicant(jobId: string, applicantId: string, status: string): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${jobId}/applicant/${applicantId}`, { status });
  }
}

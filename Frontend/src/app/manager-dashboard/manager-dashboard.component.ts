import { Component } from '@angular/core';
import { JobService } from '../job.service';
@Component({
  selector: 'app-manager-dashboard',
  templateUrl: './manager-dashboard.component.html',
  styleUrls: ['./manager-dashboard.component.css']
})
export class ManagerDashboardComponent {
  jobs: any[] = [];
  newJob: any = {  // Define the object for the new job details
    title: '',
    name: '',
    location: '',
    description: '',
    department: '',
    postedAt: new Date(),
    status: 'open'  // Default status is 'open'
  };

  constructor(private jobService: JobService) {}

  ngOnInit(): void {
    this.loadJobs();
  }

  loadJobs(): void {
    this.jobService.getJobs().subscribe(
      (data) => {
        this.jobs = data;
      },
      (error) => {
        console.error('Error loading jobs:', error);
      }
    );
  }

  createJob(): void {
    if (this.newJob.title && this.newJob.name && this.newJob.location && this.newJob.description && this.newJob.department) {
      this.jobService.createJob(this.newJob).subscribe(
        (data) => {
          console.log('Job created successfully:', data);
          this.loadJobs();  // Refresh job list after creation
          this.resetForm();  // Clear the form after job is created
        },
        (error) => {
          console.error('Error creating job:', error);
        }
      );
    }
  }

  resetForm(): void {
    this.newJob = {
      title: '',
      name: '',
      location: '',
      description: '',
      department: '',
      postedAt: new Date(),
      status: 'open'
    };
  }

  deleteJob(id: string): void {
    this.jobService.deleteJob(id).subscribe(() => {
      this.loadJobs();  // Refresh after delete
    });
  }
}

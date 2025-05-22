import { Component, OnInit } from '@angular/core';
import { JobService } from '../job.service';
import { Router } from '@angular/router';
declare var bootstrap: any;

@Component({
  selector: 'app-employee-dashboard',
  templateUrl: './employee-dashboard.component.html',
  styleUrls: ['./employee-dashboard.component.css']
})
export class EmployeeDashboardComponent implements OnInit {
  jobs: any[] = [];
  applications: any[] = [];  // For applied jobs
  employeeName: string = '';
  employeeSkills: string[] = ['Angular', 'Node.js', 'MongoDB']; // Example
  employeeCertifications: string[] = ['Scrum Master', 'AWS Certified', 'Azure Fundamentals','dbms','azure']; // Or fetch dynamically
  searchQuery: string = '';
  locationFilter: string = '';
  skillsFilter: string = '';

  constructor(private jobService: JobService,private router: Router) {}

  ngOnInit(): void {
    this.employeeName=localStorage.getItem('name') || 'Employee'
    this.loadJobs();
  }

  loadJobs(): void {
    this.jobService.getJobs().subscribe(
      (data) => {
        this.jobs = data;
      },
      (error) => {
        console.error('Error fetching jobs:', error);
      }
    );
  }

  // Filter logic for UI
  filteredJobs(): any[] {
    return this.jobs.filter(job => {
      return job.title.toLowerCase().includes(this.searchQuery.toLowerCase()) &&
             job.location.toLowerCase().includes(this.locationFilter.toLowerCase());
    });
  }

  // applyJob(job: any): void {
  //   const email = localStorage.getItem('email') || 'employee@example.com'; // adjust for real auth
  //   if (!email) {
  //     alert('Please login');
  //     return;
  //   }

  //   // Simulate adding to applications list
  //   this.applications.push(job);
  //   alert(`Applied to ${job.title} at ${job.name}`);
  //   // You can add API logic to persist this (see note below)
  // }

  selectedJob: any = null;

applyJob(job: any): void {
  const email = localStorage.getItem('email') || 'employee@example.com';
  if (!this.isApplied(job)) {
    this.applications.push(job);
    const modal = new bootstrap.Modal(document.getElementById('applySuccessModal')!);
    modal.show();
  }
}
  
  
withdrawJob(): void {
  if (this.selectedApplication) {
    this.applications = this.applications.filter(
      (job) => job.title !== this.selectedApplication.title
    );
    this.selectedApplication = null;
  }
  const modal = bootstrap.Modal.getInstance(document.getElementById('withdrawConfirmModal')!);
  modal?.hide();
}
  
  selectedApplication: any = null;

confirmWithdraw(application: any): void {
  this.selectedApplication = application;
  const modal = new bootstrap.Modal(document.getElementById('withdrawConfirmModal')!);
  modal.show();
}

  
isApplied(job: any): boolean {
  return this.applications.some(app => app._id === job._id);
}
  

viewJobDescription(job: any): void {
  this.selectedJob = job;
  const modal = new bootstrap.Modal(document.getElementById('jobDetailsModal')!);
  modal.show();
}

notifications: string[] = ['Application approved', 'New job posted', 'Deadline extended'];
showNotifications = false;

toggleNotifications(event: MouseEvent): void {
  event.preventDefault();
  this.showNotifications = !this.showNotifications;
}


  logout(){
    this.router.navigate(['/login'])
  }
  onTouch(){
    this.router.navigate(['/edit-profile'])
  }


}

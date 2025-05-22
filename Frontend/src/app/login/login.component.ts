
import { Component } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import { Router } from '@angular/router';



@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  email: string = '';
  password: string = '';
  showPassword: boolean = false;
  showSuccessAnimation: boolean = false; // <-- Add this

  constructor(private http: HttpClient, private router: Router) {}

  onLogin() {
    const payload = { email: this.email, password: this.password };
    this.http.post<any>('http://localhost:3000/auth/login', payload).subscribe({
      next: (response) => {
        localStorage.setItem('token', response.token);
        localStorage.setItem('name',response.name)
        localStorage.setItem('email',response.email)
        this.showSuccessAnimation = true;

        setTimeout(() => {
          if (response.role === 'Employee') {
            console.log(response.role)
            this.router.navigate(['/employee-dashboard']);
          } else if (response.role === 'HR') {
            console.log(response.role)
            this.router.navigate(['/hr-dashboard']);
          } else if (response.role === 'Manager') {
            console.log(response.role)
            this.router.navigate(['/manager-dashboard']);
          }
        }, 1000); // 2 seconds before navigating
      },
      error: (err) => {
        // Optional: show error toast or message
        console.log(err.message);
        
      }
    });
  }
}

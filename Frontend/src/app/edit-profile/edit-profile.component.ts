import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component } from '@angular/core';
import { OnInit } from '@angular/core';

@Component({
  selector: 'app-edit-profile',
  templateUrl: './edit-profile.component.html',
  styleUrls: ['./edit-profile.component.css']
})
export class EditProfileComponent implements OnInit {
    name = '';
    email = '';
    role = '';
    id = '';
    gender = '';
    location = '';
    phone = '';

    editingField : string | null = null; //Used to track which field is being edited

  constructor(private http:HttpClient){ }

  ngOnInit():void {
    const token = localStorage.getItem('token');
    // const name = localStorage.getItem('name');
    // const email = localStorage.getItem('email');
    // console.log(email);
    if(token){
      try{
        const payload = JSON.parse(atob(token.split('.')[1]));
        this.name = payload.name;
        this.email = payload.email;
        this.role = payload.role;
        console.log("Decoded from token:", this.name, this.email);
        
      }catch(err){
        console.error("Error decoding token: ", err);
        
      }
    }
  }

  editField(field:string):void {
    this.editingField = field;
  }

  uploadFile(type:string):void {
    console.log("Uploading file to:", type);
    
  }

  isEditing : boolean = false;

  togglEdit():void {
    this.isEditing = !this.isEditing;
  }

  onFileUpload(event: any, section:string):void {
    const file = event.target.files[0];
    if(file){
      console.log(`Uploaded file for ${section}: `, file.name);
      
    }
  }
 

  // getUserProfile(email:string):void{
  //   this.http.get<any>(`http://localhost:3000/auth`).subscribe({
  //     next:(data) => {
  //       console.log("hello");
  //       this.name = data.name;
  //       this.email = data.email;
  //       console.log("name is",this.name);
        
  //     },
  //     error:(error)=>{
  //       console.log("Error fetching user", error);
  //     }
  //   });
  // }

  onSubmit(): void{
    console.log("Updated Profile");
    console.log({
      name : this.name,
      email : this.email,
      gender : this.gender,
      role : this.role,
      id: this.id,
      location : this.location,
      phone : this.phone
    });
    
    
  }
}

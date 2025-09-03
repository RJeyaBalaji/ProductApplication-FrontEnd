import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../../service/user';
import { UserProfile } from '../../model/profile.model';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-profile',
  imports: [ FormsModule],
  templateUrl: './profile.html',
  styleUrl: './profile.css'
})
export class Profile implements OnInit{

  profile: UserProfile = {
    name: '',
    email: '',
    phone: '',
    gender: '',
    dateOfBirth: '',
    profilePic: ''
  };
  editMode = false;
  email = '';

  defaultPic: string = 'https://sl.bing.net/bkCOZWLVI1k';

  constructor(private router: Router, private userService: UserService) {}

  ngOnInit(): void {
    this.email = sessionStorage.getItem('email') || '';
    this.loadProfile();
  }

  loadProfile() {
    this.userService.getUser(this.email).subscribe(data => {
      this.profile = data;
    });
  }

  saveProfile() {
    this.userService.updateProfile(this.email, this.profile).subscribe({
      next: (res) => {
        alert('Profile updated successfully');
        this.editMode = false;
      },
      error: (err) => {
        console.error('Error updating profile', err);
      }
    });
  }


}


  

  

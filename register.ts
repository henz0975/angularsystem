import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-register',
  standalone: true,

  imports: [
    FormsModule,
    CommonModule,
    RouterLink
  ],

  templateUrl: './register.html',
  styleUrl: './register.css'
})

export class Register {

  // ==========================
  // ACCOUNT INFO
  // ==========================

  fullName = '';
  studentId = '';
  username = '';
  password = '';

  // ==========================
  // PERSONAL INFO
  // ==========================

  sex = 'Male';
  birth = '';
  age = '';
  city = '';
  phone = '';

  // ==========================
  // EXTRA INFO
  // ==========================

  bio = '';
  interests = '';
  role = '';
  adminKey = '';

  // ==========================
  // PROFILE IMAGE
  // ==========================

  profileImage: string =
    'https://i.imgur.com/6VBx3io.png';

  constructor(private router: Router) {}

  // ==========================
  // IMAGE UPLOAD
  // ==========================

  onImageSelected(event: any) {

    const file = event.target.files[0];

    if (!file) return;

    const reader = new FileReader();

    reader.onload = () => {

      this.profileImage =
        reader.result as string;

    };

    reader.readAsDataURL(file);
  }

  // ==========================
  // REGISTER
  // ==========================

  register() {

  const ADMIN_KEY = 'USTPADMIN123';

  if (
    this.role &&
    this.role.toLowerCase() === 'admin'
  ) {

    if (
      !this.adminKey ||
      this.adminKey.trim() !== ADMIN_KEY
    ) {

      alert('Invalid Admin Secret Key');
      return;

    }

  }

  const users = JSON.parse(
    localStorage.getItem('users') || '[]'
  );

  const userData = {

    fullName: this.fullName,
    username: this.username,
    password: this.password,
    role: this.role,
    sex: this.sex,
    age: this.age,
    city: this.city,
    phone: this.phone,
    bio: this.bio,
    interests: this.interests,
    studentId: this.studentId,
    profileImage: this.profileImage || ''

  };

  users.push(userData);

  localStorage.setItem(
    'users',
    JSON.stringify(users)
  );

  alert('Account Created Successfully');

  window.location.href = '/login';

}

  goLogin() {

    this.router.navigate(['/login']);

  }

}
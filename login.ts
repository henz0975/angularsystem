import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterLink
  ],
  templateUrl: './login.html',
  styleUrls: ['./login.css']
})
export class Login implements OnInit {

  username = '';
  password = '';

  constructor(private router: Router) {}

  ngOnInit(): void {

    document.body.classList.add('login-body');

    const users = JSON.parse(
      localStorage.getItem('users') || '[]'
    );

    const adminExists = users.find(
      (u: any) => u.role === 'admin'
    );

    if (!adminExists) {

      users.push({
        username: 'admin',
        id: 'admin',
        password: 'admin',
        role: 'admin'
      });

      localStorage.setItem(
        'users',
        JSON.stringify(users)
      );
    }
  }

  login() {

    const users = JSON.parse(
      localStorage.getItem('users') || '[]'
    );

    const foundUser = users.find(
      (u: any) =>

        (
          u.username === this.username ||
          u.id === this.username
        ) &&

        u.password === this.password
    );

    if (!foundUser) {
      alert('Invalid account');
      return;
    }

    localStorage.setItem(
      'currentUser',
      JSON.stringify(foundUser)
    );

    this.router.navigate(['/dashboard']);
  }
}
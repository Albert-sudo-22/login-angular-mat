import { Component, signal } from '@angular/core';
import { FormControl, FormGroupDirective, FormsModule, NgForm, ReactiveFormsModule, Validators } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import { User } from '../user/user.model';
import { UserService } from '../user/user.service';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

/** Error when invalid control is dirty, touched, or submitted. */
export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
}

@Component({
  selector: 'app-login',
  templateUrl: 'login.component.html',
  styleUrls: ['login.component.scss'],
  standalone: true,
  imports: [MatFormFieldModule, MatInputModule, FormsModule, 
    ReactiveFormsModule, MatButtonModule, MatIconModule, CommonModule],
})
export class LoginComponent {
  hide = signal(true);
  clickEvent(event: MouseEvent) {
    this.hide.set(!this.hide());
    event.stopPropagation();
  }

  emailFormControl = new FormControl('', [Validators.required, Validators.email, 
    Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$")]);
  passwordFormControl = new FormControl('', [Validators.required]);

  matcher = new MyErrorStateMatcher();

  users: User[] = [];

  constructor(private userService: UserService, private router: Router) {}

  ngOnInit(): void {
    this.fetchUsers();
  }

  fetchUsers(): void {
    this.userService.fetchUsers().subscribe({
      next: (data) => {
        this.users = data.users; 
      },
      error: (err) => {
        console.error('Error fetching users:', err);
      },
    });
  }

  login(): void {
    const email = this.emailFormControl.value;
    const password = this.passwordFormControl.value;
  
    if (this.emailFormControl.invalid || this.passwordFormControl.invalid) {
      alert('Please fill in all required fields with valid information.');
      return;
    }
  
    const user = this.users.find((u) => u.email === email && u.password === password);
  
    if (user) {
      this.router.navigate(['/user', user.id]);
    } else {
      alert('Wrong email or password. Please try again.');
    }
  }
  
}

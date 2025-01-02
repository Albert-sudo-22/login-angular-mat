import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from '../user/user.service';
import { User } from './user.model';
import {MatButtonModule} from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatIconModule} from '@angular/material/icon';
import { ErrorStateMatcher } from '@angular/material/core';
import { FormControl, FormGroup, FormGroupDirective, FormsModule, 
  NgForm, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import {MatGridListModule} from '@angular/material/grid-list';


export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
}

@Component({
  selector: 'app-user',
  imports: [CommonModule, MatButtonModule, MatCardModule, MatToolbarModule, MatIconModule,
    MatFormFieldModule, MatInputModule, FormsModule, ReactiveFormsModule, MatGridListModule,
  ],
  templateUrl: './user.component.html',
  styleUrl: './user.component.scss'
})
export class UserComponent {
  user!: User;
  Id?: number;

  pForm: FormGroup = new FormGroup({
    firstName: new FormControl('', [Validators.required, Validators.pattern("^[a-zA-Z\s]+$")]),
    lastName: new FormControl('', [Validators.required, Validators.pattern("^[a-zA-Z\s]+$")]),
    phone: new FormControl('', [Validators.required, 
      Validators.pattern("^[+]*[(]?[0-9]{1,4}[)]?[-\s./0-9]*$")
    ]),
    address: new FormControl('', [Validators.required]),
    city: new FormControl('', [Validators.required]),
    email: new FormControl('', [Validators.required, Validators.email, 
      Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$")])
  });

  matcher = new MyErrorStateMatcher();

  constructor(private router: Router, private userService: UserService, private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.Id = params['id'];
    });

    this.userService.fetchUsers().subscribe(
      (data) => {
        this.user = data.users.find((u: User) => u.id == this.Id);
        this.pForm.setValue({
          firstName: this.user.firstName,
          lastName: this.user.lastName,
          phone: this.user.phone,
          address: this.user.address.address,
          city: this.user.address.city,
          email: this.user.email
        });
      },
      (error) => {
        console.error('Error fetching users', error);
      }
    );
  }

  logOut(): void {
    this.router.navigate(['/login']);
  }
}


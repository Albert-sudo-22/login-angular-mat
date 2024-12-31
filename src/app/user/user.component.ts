import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from '../user/user.service';
import { User } from './user.model';
import {MatButtonModule} from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatIconModule} from '@angular/material/icon';

@Component({
  selector: 'app-user',
  imports: [CommonModule, MatButtonModule, MatCardModule, MatToolbarModule, MatIconModule],
  templateUrl: './user.component.html',
  styleUrl: './user.component.scss'
})
export class UserComponent {
  user!: User;
  Id?: number;
  constructor(private router: Router, private userService: UserService, private route: ActivatedRoute,) {}


  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.Id = params['id'];
    });

    this.userService.fetchUsers().subscribe(
      (data) => {
        this.user = data.users.find((u: User) => u.id == this.Id);
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

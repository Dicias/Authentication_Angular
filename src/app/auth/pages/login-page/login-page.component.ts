import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';

@Component({
  templateUrl: './login-page.component.html',
  styleUrl: './login-page.component.css'
})
export class LoginPageComponent {

  //que mejor se use inject en vez de inyectar los servicios y esas cosas en el constructor
  private fb = inject( FormBuilder );
  private AuthService = inject (AuthService)
  private router = inject(Router)

  public myForm: FormGroup = this.fb.group({
    email: ['dicias3@mail.com', [Validators.required, Validators.email] ],
    password: ['123456',[Validators.required,Validators.minLength(6)]],
  });

  login() {
    const {email, password} = this.myForm.value
    this.AuthService.login(email, password)
    .subscribe({
    next: () => this.router.navigateByUrl('/dashboard'),
    error: (msg) => {
      Swal.fire('Error', msg,'error')

    }

    })

  }

}

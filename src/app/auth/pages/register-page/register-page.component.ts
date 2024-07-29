import { Component, inject } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  templateUrl: './register-page.component.html',
  styleUrl: './register-page.component.css'
})
export class RegisterPageComponent {

  private authService = inject(AuthService);
  private fb = inject(FormBuilder);
  private router = inject(Router);

  public myForm = this.fb.group({
    email: ['', [Validators.required, Validators.email] ],
    name: ['',[Validators.required, Validators.minLength(3)]],
    password: ['',[Validators.required,Validators.minLength(6)]],
  });

  register(){
    const {email, name, password} = this.myForm.value;
    if( ! email || !name || !password) return;
    this.authService.register({email, name, password})
    .subscribe({
      next: () => this.router.navigateByUrl('/dashboard'),
      error: (msg) =>{
        Swal.fire('Error', msg, 'warning');
      }
    })

  }
  
}

import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { MessageService } from 'primeng/api';
import { Router } from '@angular/router';
import { jwtDecode } from 'jwt-decode';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {

  private passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&.])[A-Za-z\d@$!%*?&.]{8,}$/;

  loginForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: [
      '',
      [
        Validators.required,
        Validators.minLength(8),
        Validators.pattern(this.passwordPattern)
      ]
    ],
  })

  constructor(private fb:FormBuilder, private authService: AuthService,
    private messageService: MessageService,
    private router: Router) {

  }

  get email() {
    return this.loginForm.controls['email'];
  }

  get password() {
    return this.loginForm.controls['password'];
  }

  login() {  
    console.log('Login')
    const {email, password} = this.loginForm.value;

    this.authService.login(email as string, password as string).subscribe(
      response => {
        if (response.code === 0) {
           console.log('Login exitoso', response);
              // Guardar token en sessionStorage
          sessionStorage.setItem('token', response.token);

          // Decodificar token para extraer idUsuario e idRol
          const decodedToken: any = jwtDecode(response.token);
          sessionStorage.setItem('idUsuario', decodedToken.idUsuario);
          sessionStorage.setItem('idRol', decodedToken.idRol);
          sessionStorage.setItem('email',  email as string);
          sessionStorage.setItem('terminos', decodedToken.terminos);
            this.router.navigate(['/home']);
          } else {
            this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Email o Contraseña Incorrecta' });
          }
      },
      error =>{ 
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Email o Contraseña Incorrecta' });
      }
    )

  }
}

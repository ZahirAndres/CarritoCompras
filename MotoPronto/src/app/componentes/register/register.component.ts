import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { passwordMatchValidator } from '../../shared/password-match.directive';
import { AuthService } from '../../services/auth.service';
import { User } from '../../interfaces/auth';
import { MessageService } from 'primeng/api';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  loading = false;

  registerForm = this.fb.group({
    nombreUsuario: ['', Validators.required],
    apellidoP: ['', Validators.required],
    apellidoM: ['', Validators.required],
    telefono: ['', [Validators.required, Validators.pattern('^[0-9]+$')]],
    ciudad: ['', Validators.required],
    codigoPostal: ['', [Validators.required, Validators.pattern('^[0-9]{5}$')]],
    calleNumero: ['', Validators.required],
    colonia: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
    confirmPassword: ['', Validators.required],
    avatar: ['', Validators.required]
  }, {
    validators: passwordMatchValidator
  });

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private messageService: MessageService,
    private router: Router
  ) {}

  // Getters para facilitar la lectura de errores en la vista
  get nombreUsuario() { return this.registerForm.get('nombreUsuario')!; }
  get apellidoP() { return this.registerForm.get('apellidoP')!; }
  get apellidoM() { return this.registerForm.get('apellidoM')!; }
  get telefono() { return this.registerForm.get('telefono')!; }
  get ciudad() { return this.registerForm.get('ciudad')!; }
  get codigoPostal() { return this.registerForm.get('codigoPostal')!; }
  get calleNumero() { return this.registerForm.get('calleNumero')!; }
  get colonia() { return this.registerForm.get('colonia')!; }
  get email() { return this.registerForm.get('email')!; }
  get password() { return this.registerForm.get('password')!; }
  get confirmPassword() { return this.registerForm.get('confirmPassword')!; }
  get avatar() { return this.registerForm.get('avatar')!; }

  async enviarRegistro() {
    if (this.registerForm.invalid || this.loading) return;

    this.loading = true;
    const formValues = { ...this.registerForm.value };

    const usuarioData = {
      nombreUsuario: formValues.nombreUsuario || "",
      apellidoP: formValues.apellidoP || "",
      apellidoM: formValues.apellidoM || "",
      telefono: formValues.telefono || "",
      ciudad: formValues.ciudad || "",
      codigoPostal: formValues.codigoPostal || "",
      calleNumero: formValues.calleNumero || "",
      colonia: formValues.colonia || "",
      email: formValues.email,
      password: formValues.password, // Aquí podrías encriptarla según tus necesidades
      avatar: formValues.avatar || "",
      role: 2 // Valor por defecto para el rol de motociclista
    };

    this.authService.registerUser(usuarioData as User).subscribe(
      response => {
        this.messageService.add({ severity: 'success', summary: 'Éxito', detail: 'Usuario registrado correctamente' });
        this.router.navigate(['login']);
      },
      error => {
        console.error('Error en la respuesta del backend:', error);
        // Intentamos obtener un mensaje de error específico enviado desde el backend
        let errorMsg = 'Error al registrar usuario';
        if (error.error && error.error.message) {
          errorMsg = error.error.message;
        } else if (error.message) {
          errorMsg = error.message;
        }
        
        this.messageService.add({ severity: 'error', summary: 'Error', detail: errorMsg });
      }
    ).add(() => this.loading = false);
  }
}

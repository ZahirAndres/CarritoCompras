import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { Router } from '@angular/router';
import { UsuarioService } from '../../services/usuario.service';
import { Usuario } from '../../models/usuario';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrl: './nav-bar.component.css'
})
export class NavBarComponent implements OnInit {
  usuario: Usuario = {
    idUsuario: 0,
    nombreUsuario: '',
    apellidoP: '',
    apellidoM: '',
    telefono: '',
    correoElectronico: '',
    ciudad: '',
    codigoPostal: '',
    calleNumero: '',
    password: '',
    colonia: '',
    idRol: 0,
    avatar: ''
  };

  constructor(private router: Router,
    private usuarioService: UsuarioService,
    @Inject(PLATFORM_ID) private platformId: Object) { }

  ngOnInit(): void {
    this.getUsuario();
  }

  logOut() {
    sessionStorage.clear()
    this.router.navigate(['login'])
  }
  getUsuario(): void {
    if (!isPlatformBrowser(this.platformId)) {
      console.warn('Intentando acceder a sessionStorage en un entorno no navegador.');
      return;
    }

    const idUsuarioLocal = Number(sessionStorage.getItem('idUsuario'));

    if (!idUsuarioLocal) {
      console.error('No hay usuario autenticado');
      return;
    }


    this.usuarioService.getUsuarioById(idUsuarioLocal).subscribe({
      next: (data) => {
        this.usuario = data.usuario;

      },
      error: (error) => {
        console.error('Error al obtener el usuario:', error);
      }
    });
  }
}

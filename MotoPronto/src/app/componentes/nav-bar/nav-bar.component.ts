import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { Router } from '@angular/router';
import { UsuarioService } from '../../services/usuario.service';
import { Usuario } from '../../models/usuario';
import { isPlatformBrowser } from '@angular/common';
import { PerfilService } from '../../services/perfil.service';
import { CategoriaService } from '../../services/categoria.service';

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

  categorias: any[] = [];
  errorMessage: string = '';



  constructor(private router: Router,
    private perfilService: PerfilService,
    @Inject(PLATFORM_ID) private platformId: Object, private categoriaService: CategoriaService) { }

  ngOnInit(): void {
    this.getUsuario();
    this.obtenerCategorias();
  }

  obtenerCategorias(): void {
    this.categoriaService.listarCategorias().subscribe({
      next: (response) => {
        if (response.code === 200) {
          this.categorias = response.categorias;
        } else {
          this.errorMessage = 'Error al obtener categorías';
        }
      },
      error: (error) => {
        console.error('Error al obtener categorías:', error);
        this.errorMessage = 'No se pudo cargar la lista de categorías';
      }
    });
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

    const idUsuarioLocal = sessionStorage.getItem('idUsuario');

    if (!idUsuarioLocal) {
      console.error('No hay usuario autenticado');
      return;
    }

    this.perfilService.getOnlyUsuario(idUsuarioLocal).subscribe({
      next: (data) => {
        // Acceder al primer elemento de 'usuario' que es un array
        if (data.usuario && data.usuario.length > 0) {
          this.usuario = data.usuario[0];
        } else {
          console.error('Usuario no encontrado');
        }
      },
      error: (error) => {
        console.error('Error al obtener el usuario:', error);
      }
    });
  }

  perfil() {
    this.router.navigate(['perfil'])
  }

  historial() {
    this.router.navigate(['historial'])
  }

  inicio() {
    this.router.navigate(['home'])
  }

  carrito() {
    this.router.navigate(['carrito-compras'])
  }
}

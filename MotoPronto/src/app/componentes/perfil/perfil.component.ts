import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { PerfilService } from '../../services/perfil.service';
import { get } from 'http';
import { NavBarComponent } from '../nav-bar/nav-bar.component';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.component.html',
  styleUrl: './perfil.component.css'
})
export class PerfilComponent implements OnInit {
  usuario: any;
  editMode: boolean = false; 


  constructor(private perfilService: PerfilService) { }
  ngOnInit() {
    // Verificar si estamos en el navegador antes de usar sessionStorage
    if (typeof window !== 'undefined') {
      const idUsuario = sessionStorage.getItem('idUsuario'); // Obtener ID del usuario logueado
      if (idUsuario) {
        this.getOnlyUsuario(idUsuario);
      } else {
        console.error("No se encontró el ID de usuario");
      }
    } else {
      console.error("sessionStorage no está disponible");
    }
  }
  

  getOnlyUsuario(idUsuario: string) {
    this.perfilService.getOnlyUsuario(idUsuario).subscribe(
      (response) => {
        if (response.code === 200) {
          this.usuario = response.usuario[0];
        } else {
          console.error('Error al obtener el usuario:', response.message);
        }
      },
      (error) => {
        console.error('Error en la solicitud:', error);
      }
    );
  }

  activarEdicion() {
    console.log('Se ha activado el modo edición');
    this.editMode = true;
  }
  
  // Guardar cambios del usuario
  guardarEdicion() {
    this.usuario.correoElectronicoC = sessionStorage.getItem('email'); // Asignar el correo electrónico al campo correspondiente
    this.perfilService.editarUsuario(this.usuario).subscribe(
      (response) => {
        if (response.code === 0) {
          this.editMode = false;
        } else {
          console.error('Error al guardar el usuario:', response.message);
        }
      },
      (error) => {
        console.error('Error al guardar los cambios:', error);
      }
    );
  }
}

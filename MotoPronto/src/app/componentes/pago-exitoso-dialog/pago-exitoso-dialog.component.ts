import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';


@Component({
  selector: 'app-pago-exitoso-dialog',
  templateUrl: './pago-exitoso-dialog.component.html',
  styleUrls: ['./pago-exitoso-dialog.component.css']
})
export class PagoExitosoDialogComponent {
  constructor(private dialogRef: MatDialogRef<PagoExitosoDialogComponent>) {}

  cerrar() {
    this.dialogRef.close();
  }
}
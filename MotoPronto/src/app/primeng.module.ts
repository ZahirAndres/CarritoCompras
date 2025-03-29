import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';


const modPrimeng: any = [
  CardModule,
  InputTextModule,
  ButtonModule,
  ToastModule
];

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    modPrimeng
  ],
  exports: [
    modPrimeng
  ]
})
export class PrimengModule { }

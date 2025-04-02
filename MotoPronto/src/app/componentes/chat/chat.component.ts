import { Component } from '@angular/core';

interface Message {
  text: string;
  sender: 'user' | 'bot';
}

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent {
  messages: Message[] = [];
  userInput: string = '';

  // Envía el mensaje del usuario y agrega la respuesta del bot
  sendMessage(): void {
    if (this.userInput.trim() === '') {
      return;
    }
    // Agrega el mensaje del usuario a la lista
    this.messages.push({ text: this.userInput, sender: 'user' });
    // Obtiene la respuesta del bot basada en el input del usuario
    const response = this.getBotResponse(this.userInput);
    // Simula un retardo para mostrar la respuesta del bot
    setTimeout(() => {
      this.messages.push({ text: response, sender: 'bot' });
    }, 500);
    // Limpia el campo de entrada
    this.userInput = '';
  }

  // Lógica simple para generar respuestas según palabras clave
  getBotResponse(input: string): string {
    const lowerInput = input.toLowerCase();
    if (lowerInput.includes('hola')) {
      return '¡Hola! ¿Cómo puedo ayudarte?';
    } else if (lowerInput.includes('adiós')) {
      return '¡Adiós! Que tengas un buen día.';
    } else if (lowerInput.includes('ayuda')) {
      return 'Claro, dime en qué te puedo ayudar.';
    } else {
      return 'Lo siento, no entendí tu mensaje.';
    }
  }
}

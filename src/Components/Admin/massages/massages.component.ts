import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MessageService } from '../../../Services/message.service';

interface Message {
  id: string;
  NomComplet: string;
  email: string;
  Sujet: string;
  Message: string;
  Status: 'PRIVATE' | 'PUBLIC';
  createdAt: Date;
}

@Component({
  selector: 'app-massages',
  standalone: true,
  imports: [FormsModule,CommonModule],
  templateUrl: './massages.component.html',
  styleUrl: './massages.component.css'
})
export class MassagesComponent {
  messages: Message[] = [];

  selectedMessage: Message | null = null;
  replyMode = false;
  replySubject = '';
  replyContent = '';
  currentFilter: 'TOUS' | 'PUBLIC' | 'PRIVATE' = 'TOUS';
  searchQuery = '';

  constructor(private messagesService: MessageService) {}

  ngOnInit(): void {
    this.messagesService.getAll().subscribe({
      next: (data) => {
        this.messages = data;
      },
      error: (err) => {
        console.error('Erreur lors de la récupération des messages :', err);
      }
    });
  }
  get filteredMessages(): Message[] {
    let filtered = this.messages;
    
    if (this.currentFilter !== 'TOUS') {
      filtered = filtered.filter(m => m.Status === this.currentFilter);
    }
    
    if (this.searchQuery) {
      const query = this.searchQuery.toLowerCase();
      filtered = filtered.filter(m => 
        m.NomComplet.toLowerCase().includes(query) || 
        m.email.toLowerCase().includes(query) || 
        m.Sujet.toLowerCase().includes(query) ||
        m.Message.toLowerCase().includes(query)
      );
    }
    
    return filtered;
  }

  get pendingCount(): number {
    return this.messages.filter(m => m.Status === 'PRIVATE').length;
  }

  get publicCount(): number {
    return this.messages.filter(m => m.Status === 'PUBLIC').length;
  }

  selectMessage(msg: Message): void {
    this.selectedMessage = msg;
    this.replyMode = false;
  }

  showReplyForm(): void {
    if (this.selectedMessage) {
      this.replySubject = `Re: ${this.selectedMessage.Sujet}`;
      this.replyContent = '';
      this.replyMode = true;
    }
  }

  sendReply(): void {
    if (!this.selectedMessage) return;
  
    const id = this.selectedMessage.id;
  
    this.messagesService.replyToMessage(id, this.replySubject, this.replyContent).subscribe({
      next: () => {
        console.log('Réponse envoyée avec succès.');
        alert('Email envoyé avec succès.');
        this.replyMode = false;
      },
      error: (err) => {
        console.error('Erreur lors de l’envoi de la réponse :', err);
      }
    });
  }
  

  cancelReply(): void {
    this.replyMode = false;
  }

  markAsPublic(): void {
    if (!this.selectedMessage) return;
  
    const id = this.selectedMessage.id;
  
    this.messagesService.updateStatus(id).subscribe({
      next: (updatedMsg) => {
        this.selectedMessage!.Status = updatedMsg.Status;
        console.log('Statut mis à jour avec succès.');
      },
      error: (err) => {
        console.error('Erreur lors de la mise à jour du statut :', err);
      }
    });
  }
  

  deleteMessage(): void {
    if (!this.selectedMessage) return;
  
    const id = this.selectedMessage.id;
  
    this.messagesService.delete(id).subscribe({
      next: () => {
        this.messages = this.messages.filter(m => m.id !== id);
        this.selectedMessage = null;
        this.replyMode = false;
        console.log('Message supprimé avec succès.');
      },
      error: (err) => {
        console.error('Erreur lors de la suppression du message :', err);
      }
    });
  }
  

  setFilter(filter: 'TOUS' | 'PUBLIC' | 'PRIVATE'): void {
    this.currentFilter = filter;
    this.selectedMessage = null;
    this.replyMode = false;
  }
}

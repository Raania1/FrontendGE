import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MessageService } from '../../../Services/message.service';
import { AdminService } from '../../../Services/admin.service';

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
adminInfo: any = {};
formData = {
      nom: '',
      prenom: '',
      email: ''
    };
  constructor(private messagesService: MessageService,private adminService: AdminService) {}

  ngOnInit(): void {
            this.fetchAdminInfo();

    this.messagesService.getAll().subscribe({
      next: (data) => {
        this.messages = data;
      },
      error: (err) => {
        console.error('Erreur lors de la récupération des messages :', err);
      }
    });
  }
    fetchAdminInfo() {
  const user = JSON.parse(localStorage.getItem('user') || '{}');  
    const adminId = user.Id; 
  if (adminId) {
    this.adminService.getAdminById(adminId).subscribe(
      (response) => {
        this.adminInfo = response.admin;
                  this.formData = { ...this.adminInfo };  

        console.log('Admin récupéré:', this.adminInfo);
      },
      (error) => {
        console.error('Erreur lors de la récupération de l’admin:', error);
      }
    );
  }
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
  
  successMessage = '';

  sendReply(): void {
    if (!this.selectedMessage) return;
  
    const id = this.selectedMessage.id;
  
    this.messagesService.replyToMessage(id, this.replySubject, this.replyContent).subscribe({
      next: () => {
        console.log('Réponse envoyée avec succès.');
        this.successMessage = 'Email envoyé avec succès.';
        setTimeout(() => {
          this.successMessage = '';
          this.replyMode = false;
        }, 1500);
      },
      error: (err) => {
        console.error('Erreur lors de l’envoi de la réponse :', err);
      }
    });
  }
  

  cancelReply(): void {
    this.replyMode = false;
  }

  isActiveDialogOpen = false;
  messageToActivate: any = null;
  openActivateDialog(message: Message): void {
    this.messageToActivate = message;
    this.isActiveDialogOpen = true;
  }

  markAsPublic(): void {
    if (!this.messageToActivate) return;
  
    const id = this.messageToActivate.id;
  
    this.messagesService.updateStatus(id).subscribe({
      next: (updatedMsg) => {
        const index = this.messages.findIndex(m => m.id === id);
        if (index !== -1) {
          this.messages[index].Status = updatedMsg.Status;
        }
  
        this.messageToActivate = null;
        this.isActiveDialogOpen = false;
        console.log('Message publié avec succès.');
      },
      error: (err) => {
        console.error('Erreur lors de la publication du message :', err);
      }
    });
  }
  
  isDeleteDialogOpen = false;
  messageToDelete: any = null;
  openDeleteDialog(message: Message): void {
    this.messageToDelete = message;
    this.isDeleteDialogOpen = true;
  }
  
  

  deleteMessage(): void {
    if (!this.messageToDelete) return;
  
    const id = this.messageToDelete.id;
  
    this.messagesService.delete(id).subscribe({
      next: () => {
        this.messages = this.messages.filter(m => m.id !== id);
        this.selectedMessage = null;
        this.messageToDelete = null;
        this.isDeleteDialogOpen = false;
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

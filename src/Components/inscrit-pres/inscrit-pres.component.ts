// import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-inscrit-pres',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './inscrit-pres.component.html',
  styleUrl: './inscrit-pres.component.css'
})
export class InscritPresComponent {
  // selectedFiles: File[] = [];
  // fileCountError: boolean = false;

  // onFilesChange(event: any): void {
  //   const files = event.target.files;
  //   if (files.length >= 1 && files.length <= 5) {
  //     this.selectedFiles = Array.from(files);
  //     this.fileCountError = false; // Valide le nombre de fichiers
  //   } else {
  //     this.fileCountError = true; // Affiche l'erreur si le nombre de fichiers est invalide
  //   }
  // }

}

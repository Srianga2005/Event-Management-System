import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule, MatToolbarModule],
  template: `
    <footer class="footer">
      <mat-toolbar>
        <span>&copy; 2025 EventHub</span>
      </mat-toolbar>
    </footer>
  `,
  styles: [`
    .footer {
      margin-top: auto;
    }
    
    .footer mat-toolbar {
      background: #333;
      color: white;
      font-size: 14px;
      height: 48px;
      display: flex;
      justify-content: center;
      align-items: center;
    }
  `]
})
export class FooterComponent {
}

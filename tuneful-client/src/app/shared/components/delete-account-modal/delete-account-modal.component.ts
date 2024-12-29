import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TranslocoPipe } from '@jsverse/transloco';
import { CheckboxModule } from 'primeng/checkbox';
import { DialogModule } from 'primeng/dialog';
import { ModalService } from '../../../core/services/modal-service.service';

@Component({
  selector: 'app-delete-account-modal',
  standalone: true,
  imports: [DialogModule, TranslocoPipe, CheckboxModule, FormsModule],
  templateUrl: './delete-account-modal.component.html',
  styleUrl: './delete-account-modal.component.scss',
})
export class DeleteAccountModalComponent {
  isVisible!: boolean;
  isSure: boolean = false;
  constructor(private modalService: ModalService) {
    this.modalService.showDeleteAccountModal$.subscribe((state: boolean) => {
      this.isSure = false;
      this.isVisible = state;
    });
  }

  closeModal() {
    this.modalService.closeDeleteAccountModal();
  }
}

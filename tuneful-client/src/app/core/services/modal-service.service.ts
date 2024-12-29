import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ModalService {
  private showNewMelodyModalSubject: Subject<boolean> = new Subject<boolean>();
  private showPasswordModalSubject: Subject<boolean> = new Subject<boolean>();
  private showDeleteAccountModalSubject: Subject<boolean> =
    new Subject<boolean>();

  public showNewMelodyModal$: Observable<boolean> =
    this.showNewMelodyModalSubject.asObservable();
  public showPasswordModal$: Observable<boolean> =
    this.showPasswordModalSubject.asObservable();
  public showDeleteAccountModal$: Observable<boolean> =
    this.showDeleteAccountModalSubject.asObservable();

  constructor() {}

  openNewMelodyModal() {
    this.showNewMelodyModalSubject.next(true);
  }

  closeNewMelodyModal() {
    this.showNewMelodyModalSubject.next(false);
  }

  openPasswordModal() {
    this.showPasswordModalSubject.next(true);
  }

  closePasswordModal() {
    this.showPasswordModalSubject.next(false);
  }

  openDeleteAccountModal() {
    this.showDeleteAccountModalSubject.next(true);
  }

  closeDeleteAccountModal() {
    this.showDeleteAccountModalSubject.next(false);
  }
}

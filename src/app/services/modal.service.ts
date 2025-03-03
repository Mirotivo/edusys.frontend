import { Injectable, TemplateRef } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CustomModalComponent } from '../components/custom-modal/custom-modal.component';

@Injectable({
  providedIn: 'root',
})
export class ModalService {
  constructor(private modalService: NgbModal) { }

  open(
    title: string,
    content: TemplateRef<any>,
    onSaveCallback?: () => void,
    onCloseCallback?: () => void,
    saveLabel = 'Save',
    closeLabel = 'Close',
    size: 'sm' | 'lg' | 'xl' = 'lg') {
    const modalRef = this.modalService.open(CustomModalComponent,
      {
        size: size,
        backdrop: 'static',
        keyboard: false,
        centered: true
      });
    modalRef.componentInstance.title = title;
    modalRef.componentInstance.contentTemplate = content;
    modalRef.componentInstance.saveButtonLabel = saveLabel;
    modalRef.componentInstance.closeButtonLabel = closeLabel;

    if (onSaveCallback) {
      modalRef.componentInstance.onSave.subscribe(onSaveCallback);
    }

    if (onCloseCallback) {
      modalRef.componentInstance.onClose.subscribe(onCloseCallback);
    }
  }
}

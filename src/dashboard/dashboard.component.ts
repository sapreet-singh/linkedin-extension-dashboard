import { CommonModule, NgClass, NgFor, NgIf, SlicePipe } from '@angular/common';
import { Component, OnInit, TemplateRef } from '@angular/core';
import { LinkedinService } from '../services/linkedin.service';
import { ProfileDto, ServiceResult } from '../services/model';
import bootstrap from '../main.server';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-dashboard',
  imports: [NgFor, NgClass, SlicePipe, CommonModule, NgIf],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})


export class DashboardComponent implements OnInit {

  profiles: ProfileDto[] = [];
  modalTitle = '';
  modalContent = '';
  sendConnectCount = 0;
  failedConnectCount = 0;

  constructor(private linkedinService: LinkedinService,
    private modalService: NgbModal
  ) {}

  ngOnInit(): void {
      this.linkedinService.GetStatus().subscribe({
      next: (result) => {
        this.sendConnectCount = result.sendConnect;
        this.failedConnectCount = result.failedConnect;
        this.profiles = result.data;   // you can bind profiles directly from API
      },
      error: (err) => {
        console.error('Error fetching status', err);
      }
    });

    this.linkedinService.getAllProfiles().subscribe((result: ServiceResult<ProfileDto[]>) => {
      if (result.success) {
        this.profiles = result.data;
        console.log("profiles",this.profiles)
      } else {
        console.error(result.message);
        this.profiles = [];
      }
    });
  }

   openModal(title: string, content: string, modalTemplate: TemplateRef<any>) {
    this.modalTitle = title;
    this.modalContent = content;
    this.modalService.open(modalTemplate, { size: 'lg' });
  }

  get successCount() {
    return this.profiles.filter(p => p.status === 'accepted').length;
  }

  get pendingCount() {
    return this.sendConnectCount; // API "Invitation sent"
  }

  get failedCount() {
    return this.failedConnectCount; // API "not Invitation sent"
  }

  get totalCount() {
    return this.profiles.length;
  }

  get successRate(): number {
  return this.totalCount > 0 ? Math.round((this.successCount / this.totalCount) * 100) : 0;
}

get failedRate(): number {
  return this.totalCount > 0 ? Math.round((this.failedCount / this.totalCount) * 100) : 0;
}

getReasonClass(reason?: string): string {
  const normalized = (reason || '').toLowerCase();

  if (normalized === 'accepted') return 'bg-success';
  if (normalized === 'invitation sent') return 'bg-warning text-dark';
  return 'bg-danger'; // everything else = failed
}

getReasonLabel(reason?: string): string {
  const normalized = (reason || '').toLowerCase();

  if (normalized === 'accepted') return 'Accepted';
  if (normalized === 'invitation sent') return 'invitation sent';
  return 'Failed'; // hide raw error messages
}

}

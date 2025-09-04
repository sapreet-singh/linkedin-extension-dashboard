import { CommonModule, NgClass, NgFor, NgIf, SlicePipe } from '@angular/common';
import { Component, OnInit, TemplateRef } from '@angular/core';
import { LinkedinService } from '../services/linkedin.service';
import { ProfileDto, ServiceResult } from '../services/model';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-dashboard',
  imports: [NgFor, NgClass, CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent implements OnInit {
  profiles: ProfileDto[] = [];
  modalTitle = '';
  modalContent = '';
  sendConnectCount = 0;
  failedConnectCount = 0;
  selectedProfile: any = null;

  constructor(
    private linkedinService: LinkedinService,
    private modalService: NgbModal
  ) {}

  ngOnInit(): void {
    this.getAllProfiles()
    this.GetStatus()
  }

  getAllProfiles()
  {
    this.linkedinService.getAllProfiles().subscribe(
      (result: ServiceResult<ProfileDto[]>) => {
        if (result.success) {
          this.profiles = result.data || [];
          console.log('profiles', this.profiles);
        } else {
          console.error(result.message);
          this.profiles = [];
        }
      }
    );
  }

  GetStatus()
  {
    this.linkedinService.GetStatus().subscribe({
      next: (result) => {
        this.sendConnectCount = result.sendConnect || 0;
        this.failedConnectCount = result.failedConnect || 0;
      },
      error: (err) => {
        console.error('Error fetching status', err);
      }
    });
  }

  openModal(title: string, content: string, modalTemplate: TemplateRef<any>) {
    this.modalTitle = title;
    this.modalContent = content;
    this.modalService.open(modalTemplate, { size: 'lg' });
  }

    openRowModal(profile: any, modalTemplate: any) {
    this.selectedProfile = profile;
    this.modalService.open(modalTemplate, { size: 'lg' });
  }

  get successCount() {
    return this.profiles.filter((p) => p.status?.toLowerCase() === 'accepted').length;
  }

  get pendingCount() {
    return this.sendConnectCount;
  }

  get failedCount() {
    return this.failedConnectCount;
  }

  get totalCount() {
    return this.profiles.length;
  }

  get successRate(): number {
    return this.totalCount > 0
      ? Math.round((this.successCount / this.totalCount) * 100)
      : 0;
  }

  get failedRate(): number {
    return this.totalCount > 0
      ? Math.round((this.failedCount / this.totalCount) * 100)
      : 0;
  }

  getReasonClass(reason?: string): string {
    const normalized = (reason || '').toLowerCase();
    if (normalized === 'accepted') return 'bg-success';
    if (normalized === 'invitation sent') return 'bg-warning text-dark';
    return 'bg-danger';
  }

  getReasonLabel(reason?: string): string {
    const normalized = (reason || '').toLowerCase();
    if (normalized === 'accepted') return 'Accepted';
    if (normalized === 'invitation sent') return 'Invitation Sent';
    return 'Failed';
  }
}

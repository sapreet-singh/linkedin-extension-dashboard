import { CommonModule, NgClass, NgFor, NgIf, SlicePipe } from '@angular/common';
import { Component, OnInit, TemplateRef } from '@angular/core';
import { LinkedinService } from '../services/linkedin.service';
import { ProfileDto, ServiceResult } from '../services/model';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-dashboard',
  imports: [NgFor, NgClass, CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
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
    private modalService: NgbModal,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.getAllProfiles();
    this.GetStatus();
  }

  getAllProfiles() {
    this.linkedinService
      .getAllProfiles()
      .subscribe((result: ServiceResult<ProfileDto[]>) => {
        if (result.success) {
          this.profiles = result.data || [];
          console.log('profiles', this.profiles);
        } else {
          console.error(result.message);
          this.profiles = [];
        }
      });
  }

  GetStatus() {
    this.linkedinService.GetStatus().subscribe({
      next: (result) => {
        this.sendConnectCount = result.sendConnect || 0;
        this.failedConnectCount = result.failedConnect || 0;
      },
      error: (err) => {
        console.error('Error fetching status', err);
      },
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
    return this.profiles.filter((p) => {
      const normalizedStatus = (p.status || '').toLowerCase();
      const normalizedReason = (p.reason || '').toLowerCase();
      return (
        normalizedStatus === 'accepted' ||
        normalizedStatus === 'connected' ||
        normalizedReason === 'accepted' ||
        normalizedReason === 'connected'
      );
    }).length;
  }

  get pendingCount() {
    return this.profiles.filter((p) => {
      const normalized = (p.reason || p.status || '').toLowerCase();
      return normalized === 'invitation sent' || normalized === 'pending';
    }).length;
  }

  get failedCount() {
    return this.profiles.filter((p) => {
      const normalized = (p.reason || p.status || '').toLowerCase();
      return normalized === 'failed';
    }).length;
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
    if (normalized === 'accepted' || normalized === 'connected')
      return 'bg-success';
    if (normalized === 'invitation sent' || normalized === 'pending')
      return 'bg-warning text-dark';
    return 'bg-danger';
  }

  getReasonLabel(reason?: string): string {
    const normalized = (reason || '').toLowerCase();
    if (normalized === 'accepted' || normalized === 'connected')
      return 'Connected';
    if (normalized === 'invitation sent' || normalized === 'pending')
      return 'Invitation Sent';
    return 'Failed';
  }

  toggleAutomation(profile: ProfileDto) {
    const newValue = !profile.isAutomated;
    profile.isAutomated = newValue;

    this.linkedinService
      .updateAutomationProfile(profile.id, newValue)
      .subscribe({
        next: () => {
          this.toastr.success(
            `Automation ${newValue ? 'enabled' : 'disabled'} for ${
              profile.name
            }`,
            'Success',
            {
              timeOut: 3000,
              positionClass: 'toast-top-right',
              closeButton: true,
            }
          );
        },
        error: (err) => {
          this.toastr.error('Failed to update automation', 'Error', {
            timeOut: 5000,
            positionClass: 'toast-top-right',
            closeButton: true,
            progressBar: true,
          });
          console.error('Failed to update automation', err);
          profile.isAutomated = !newValue;
        },
      });
  }
}

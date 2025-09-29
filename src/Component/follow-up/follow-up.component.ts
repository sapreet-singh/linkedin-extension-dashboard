import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LinkedinService } from '../../services/linkedin.service';
import { finalize } from 'rxjs/operators';
import { FollowUpLog } from '../../services/model';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-follow-up',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './follow-up.component.html',
  styleUrls: ['./follow-up.component.scss']
})
export class FollowUpComponent implements OnInit {
  logs: FollowUpLog[] = [];
  filteredLogs: FollowUpLog[] = [];
  filterStatus: string = 'all';
  currentPage: number = 1;
  pageSize: number = 10;
  totalPages: number = 1;
  isLoading: boolean = false;
  error: string | null = null;
  expandedLogs: Set<number> = new Set();
  selectedProfile: any = null;
  selectedLog: FollowUpLog | null = null;
  modalTitle = '';
  modalContent = '';
  
  @ViewChild('followUpDetailsModal') followUpDetailsModal!: TemplateRef<any>;

  constructor(private linkedinService: LinkedinService,
     private modalService: NgbModal,
  ) {}

  ngOnInit(): void {
    this.loadLogs();
  }

  loadLogs(): void {
    this.isLoading = true;
    this.error = null;
    
    this.linkedinService.getAllFollowUps()
      .pipe(
        finalize(() => {
          this.isLoading = false;
        })
      )
      .subscribe({
        next: (response) => {
          if (response && response.success && response.data) {
            this.logs = response.data;
            this.filterLogs();
            this.calculatePagination();
          } else {
            this.error = response?.message || 'Invalid response format';
            this.logs = [];
            this.filterLogs();
          }
        },
        error: (err) => {
          console.error('Error fetching follow-up logs:', err);
          this.error = 'Failed to load follow-up logs. Please try again.';
          this.logs = [];
          this.filterLogs();
        }
      });
  }

  refreshLogs(): void {
    console.log('Refreshing logs...');
    this.loadLogs();
  }

  filterLogs(): void {
    if (this.filterStatus === 'all') {
      this.filteredLogs = [...this.logs];
    } else if (this.filterStatus === 'pending') {
      this.filteredLogs = this.logs.filter(log => log.totalFollowUps < 3);
    } else if (this.filterStatus === 'completed') {
      this.filteredLogs = this.logs.filter(log => log.totalFollowUps === 3);
    } else if (this.filterStatus === 'failed') {
      this.filteredLogs = [];
    }
    this.calculatePagination();
    this.currentPage = 1;
  }

  calculatePagination(): void {
    this.totalPages = Math.ceil(this.filteredLogs.length / this.pageSize);
  }

  changePage(page: number): void {
    this.currentPage = page;
  }
  
  viewDetails(log: FollowUpLog): void {
    console.log('Viewing details for log:', log);
  }

  resendMessage(log: FollowUpLog): void {
    console.log('Resending message for log:', log);
  }
  
  getCurrentMessage(log: FollowUpLog): string {
    if (log.followUp3) return log.followUp3;
    if (log.followUp2) return log.followUp2;
    if (log.followUp1) return log.followUp1;
    return '';
  }
  
  getStatus(log: FollowUpLog): string {
    if (log.totalFollowUps === 3) return 'completed';
    return 'pending';
  }
  handleImageError(event: any): void {
    event.target.src = 'assets/images/default-profile.png';
  }

  toggleExpand(index: number): void {
    if (this.expandedLogs.has(index)) {
      this.expandedLogs.delete(index);
    } else {
      this.expandedLogs.add(index);
    }
  }

  formatSentDate(log: FollowUpLog): string {
    const sd: any = (log as any)?.sentdate;
    if (!sd) return '-';
    const str = typeof sd === 'string' ? sd : sd.toString();
    return str.includes('.') ? str.split('.')[0] : str;
  }

  formatScheduledTime(log: FollowUpLog | null): string {
    if (!log || !log.scheduledTime) return 'Not scheduled';
    
    try {
      const scheduledDate = new Date(log.scheduledTime);
      if (isNaN(scheduledDate.getTime())) {
        return 'Invalid date';
      }
      
      // Format as readable date and time
      return scheduledDate.toLocaleString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      });
    } catch (error) {
      console.error('Error formatting scheduled time:', error);
      return 'Invalid date';
    }
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

  openLogDetails(log: FollowUpLog): void {
    console.log('Row clicked, opening modal for:', log);
    this.selectedLog = log;
    
    setTimeout(() => {
      if (this.followUpDetailsModal) {
        this.modalService.open(this.followUpDetailsModal, { size: 'lg' });
      } else {
        console.error('Modal template not found');
      }
    }, 0);
  }

  openLogDetailsWithTemplate(log: FollowUpLog, modalTemplate: TemplateRef<any>): void {
    console.log('Row clicked, opening modal for:', log);
    this.selectedLog = log;
    this.modalService.open(modalTemplate, { size: 'lg' });
  }

  getStatusText(log: FollowUpLog): string {
    if (log.totalFollowUps === 3) return 'Completed';
    if (log.totalFollowUps === 0) return 'Not Started';
    return 'In Progress';
  }

  getStatusBadgeClass(log: FollowUpLog): string {
    if (log.totalFollowUps === 3) return 'badge-success';
    if (log.totalFollowUps === 0) return 'badge-secondary';
    return 'badge-warning';
  }

  getScheduledTimeClass(log: FollowUpLog | null): string {
    if (!log || !log.scheduledTime) return 'scheduled-none';
    
    try {
      const scheduledDate = new Date(log.scheduledTime);
      const now = new Date();
      
      if (isNaN(scheduledDate.getTime())) {
        return 'scheduled-invalid';
      }
      
      if (scheduledDate < now) {
        return 'scheduled-overdue';
      } else if (scheduledDate.toDateString() === now.toDateString()) {
        return 'scheduled-today';
      } else {
        return 'scheduled-upcoming';
      }
    } catch (error) {
      return 'scheduled-invalid';
    }
  }
}

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LinkedinService } from '../../services/linkedin.service';
import { finalize } from 'rxjs/operators';
import { FollowUpLog } from '../../services/model';

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

  constructor(private linkedinService: LinkedinService) {}

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
          console.log("response", response);
          if (response && response.success && response.data) {
            this.logs = response.data;
            this.filterLogs();
            this.calculatePagination();
          } else {
            this.error = response?.message || 'Invalid response format';
            this.logs = [];
            this.filterLogs();
          }
          console.log("logs", this.logs);
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
    // Since we don't have a status field in the new API format,
    // we'll filter based on totalFollowUps for now
    if (this.filterStatus === 'all') {
      this.filteredLogs = [...this.logs];
    } else if (this.filterStatus === 'pending') {
      this.filteredLogs = this.logs.filter(log => log.totalFollowUps < 3);
    } else if (this.filterStatus === 'completed') {
      this.filteredLogs = this.logs.filter(log => log.totalFollowUps === 3);
    } else if (this.filterStatus === 'failed') {
      // For now, we don't have a failed status in the API
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
    // Implement view details functionality
  }

  resendMessage(log: FollowUpLog): void {
    console.log('Resending message for log:', log);
    // Implement resend functionality
  }
  
  // Helper method to get the current follow-up message
  getCurrentMessage(log: FollowUpLog): string {
    // Ensure we always return a string to avoid undefined in the template
    if (log.followUp3) return log.followUp3;
    if (log.followUp2) return log.followUp2;
    if (log.followUp1) return log.followUp1;
    return '';
  }
  
  // Helper method to get status based on totalFollowUps
  getStatus(log: FollowUpLog): string {
    if (log.totalFollowUps === 3) return 'completed';
    return 'pending';
  }
  // Helper method to handle image loading errors
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

  // Helper to render sent date safely without optional chaining in template
  formatSentDate(log: FollowUpLog): string {
    const sd: any = (log as any)?.sentdate;
    if (!sd) return '-';
    const str = typeof sd === 'string' ? sd : sd.toString();
    return str.includes('.') ? str.split('.')[0] : str;
  }
}

import { NgClass, NgFor } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { LinkedinService } from '../services/linkedin.service';
import { ProfileDto, ServiceResult } from '../services/model';

@Component({
  selector: 'app-dashboard',
  imports: [NgFor, NgClass],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})


export class DashboardComponent implements OnInit {

  profiles: ProfileDto[] = [];

  constructor(private linkedinService: LinkedinService) {}

  ngOnInit(): void {
    this.linkedinService.getAllProfiles().subscribe((result: ServiceResult<ProfileDto[]>) => {
      if (result.success) {
        this.profiles = result.data;
      } else {
        console.error(result.message);
        this.profiles = [];
      }
    });
  }

  get successCount() {
    return this.profiles.filter(p => p.status === 'accepted').length;
  }

  get failedCount() {
    return this.profiles.filter(p => p.status === 'failed').length;
  }

  get pendingCount() {
    return this.profiles.filter(p => p.status === 'pending').length;
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

}

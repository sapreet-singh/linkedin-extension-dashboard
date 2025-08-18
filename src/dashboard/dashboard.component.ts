import { NgClass, NgFor } from '@angular/common';
import { Component } from '@angular/core';

type Status = 'Pending' | 'Accepted' | 'Rejected' | 'Failed';

interface Profile {
  name: string;
  linkedin: string;
  status: Status;
}


@Component({
  selector: 'app-dashboard',
  imports: [NgFor, NgClass],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent {
  profiles = [
    { name: 'John Doe', linkedin: 'https://linkedin.com/in/johndoe', status: 'Pending' },
    { name: 'Jane Smith', linkedin: 'https://linkedin.com/in/janesmith', status: 'Accepted' },
  ];

  get successCount() {
    return this.profiles.filter(p => p.status === 'Accepted').length;
  }

  get failedCount() {
    return this.profiles.filter(p => p.status === 'Failed').length;
  }

  get pendingCount() {
    return this.profiles.filter(p => p.status === 'Pending').length;
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

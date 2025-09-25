import { Routes } from '@angular/router';
import { DashboardComponent } from '../Component/dashboard/dashboard.component';
import { FollowUpComponent } from '../Component/follow-up/follow-up.component';


export const routes: Routes = [
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  { path: 'dashboard', component: DashboardComponent },
  {path:'follow-Up', component:FollowUpComponent},
  { path: '**', redirectTo: 'dashboard' }
];

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ProfileDto, ServiceResult, FollowUpLog } from './model';

 

@Injectable({
  providedIn: 'root',
})
export class LinkedinService {
  private APIURL = 'https://localhost:7120/api';

  constructor(private http: HttpClient) {}

  /** Get all LinkedIn profiles */
  getAllProfiles(): Observable<ServiceResult<ProfileDto[]>> {
    return this.http.get<ServiceResult<ProfileDto[]>>(
      `${this.APIURL}/linkedin/profiles`
    );
  }

  /** Get connection status summary */
  GetStatus(): Observable<any> {
    return this.http.get<any>(`${this.APIURL}/linkedin/GetStatus`);
  }

  /** Get all follow-up logs */
  getAllFollowUps(): Observable<ServiceResult<FollowUpLog[]>> {
    return this.http.get<ServiceResult<FollowUpLog[]>>(
      `${this.APIURL}/linkedin/GetAll-FollowUp`
    );
  }

  updateAutomationProfile(profileId: number, enabled: boolean) {
    return this.http.post(
      `${this.APIURL}/linkedin/${profileId}/automation/${enabled}`, // <-- use path param
      {}
    );
  }
}

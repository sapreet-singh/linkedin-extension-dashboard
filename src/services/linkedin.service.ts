import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ProfileDto, ServiceResult } from './model';

@Injectable({
  providedIn: 'root'
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
    return this.http.get<any>(
      `${this.APIURL}/linkedin/GetStatus`
    );
  }
}

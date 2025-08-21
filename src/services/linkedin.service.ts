import { Injectable } from '@angular/core';
import { API_BASE_URL  } from './config';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ProfileDto, ServiceResult } from './model';

@Injectable({
  providedIn: 'root'
})
export class LinkedinService {

 constructor(private http: HttpClient) {}

 getAllProfiles(): Observable<ServiceResult<ProfileDto[]>> {
    return this.http.get<ServiceResult<ProfileDto[]>>(`${API_BASE_URL}/linkedin/profiles`);
  }

  GetStatus():Observable<any>
  {
    return this.http.get<any>(`${API_BASE_URL}/linkedin/GetStatus`);
  }
}

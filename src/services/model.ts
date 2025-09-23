export interface ProfileDto {
  id:number;
  linkedinUrl: string;
  name: string;
  title: string;
  location: string;
  profilePicUrl: string;
  createdAt: string;
  prompt?: string;
  message?: string;
  reason?: string;
  isAutomated:boolean;
  status?: 'accepted' | 'failed' | 'pending';
}

export interface ServiceResult<T> {
  success: boolean;
  message: string;
  data: T;
}
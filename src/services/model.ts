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

export interface FollowUpLog {
  name: string;
  title: string;
  profileimg?: string;
  sentdate: string;
  followUp1: string;
  followUp2: string | null;
  followUp3: string | null;
  totalFollowUps: number;
  scheduledTime:string;
}

export interface ServiceResult<T> {
  success: boolean;
  message: string;
  data: T;
}
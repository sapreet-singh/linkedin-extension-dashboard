export interface ProfileDto {
  linkedinUrl: string;
  name: string;
  title: string;
  location: string;
  profilePicUrl: string;
  createdAt: string;
  prompt?: string;
  message?: string;
  reason?: string;
  status?: string;
}

export interface ServiceResult<T> {
  success: boolean;
  message: string;
  data: T;
}
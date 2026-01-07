
export type CourtStatus = 'Available' | 'Event' | 'Locked';

export interface Court {
  id: string;
  name: string;
  status: CourtStatus;
}

export interface Activity {
  id: string;
  userName: string;
  courtNumber: number;
  timeAgo: string;
}

export interface EventRequest {
  id: string;
  requesterName: string;
  eventName: string;
  dateTime: string;
  courtsRequested: string[];
  status: 'pending' | 'approved' | 'declined';
}

export interface User {
  uid: string;
  email: string | null;
  displayName: string | null;
  role: 'admin' | 'user';
}

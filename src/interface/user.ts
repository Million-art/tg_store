import { Timestamp } from "firebase/firestore";

export type User = {
    id: string;
    firstName: string;
    lastName?: string;
    userImage?: string | null;
    username?: string;
    languageCode?: string;
    referrals?: string[];
    referredBy?: string | null;
    isPremium?: boolean;
    balance?: number;
    daily?: {
      claimedTime: Timestamp | Date | string | null;
      claimedDay: number;
    };
    
  };
  
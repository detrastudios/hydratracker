export type IntakeRecord = {
  id: string;
  amount: number;
  timestamp: string;
};

export type Reminder = {
  time: string;
  message: string;
};

export type UserSettings = {
  name: string;
  dob: string;
  height: number;
  weight: number;
  gender: 'male' | 'female' | 'other' | 'preferNotToSay';
  profilePhoto: string;
  dailyGoal: number;
  wakeUpTime: string;
  bedTime: string;
  activityLevel: 'sedentary' | 'lightlyActive' | 'moderatelyActive' | 'veryActive' | 'extraActive';
  climate: string;
  reminders: Reminder[];
};

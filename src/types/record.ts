export interface DailyRecord {
  id: string;
  date: string;
  goalId: string;
  value: number;
  completed: boolean;
  note?: string;
  createdAt: string;
  updatedAt: string;
}

export type UpsertRecordDTO = {
  date: string;
  goalId: string;
  value: number;
  completed?: boolean;
  note?: string;
};

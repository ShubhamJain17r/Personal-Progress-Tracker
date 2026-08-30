import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../db/database';
import { recordRepo } from '../db/repositories/recordRepo';
import { UpsertRecordDTO } from '../types/record';

export function useDailyRecords(selectedDate?: string) {
  const records = useLiveQuery(
    () => {
      if (selectedDate) {
        return db.dailyRecords.where('date').equals(selectedDate).toArray();
      }
      return db.dailyRecords.toArray();
    },
    [selectedDate]
  ) || [];

  return {
    records,
    isLoading: records === undefined,
    upsertRecord: (dto: UpsertRecordDTO) => recordRepo.upsert(dto),
    deleteRecord: (id: string) => recordRepo.delete(id),
  };
}

export function useDateRangeRecords(startDate: string, endDate: string) {
  const records = useLiveQuery(
    () => db.dailyRecords.where('date').between(startDate, endDate, true, true).toArray(),
    [startDate, endDate]
  ) || [];

  return {
    records,
    isLoading: records === undefined,
  };
}

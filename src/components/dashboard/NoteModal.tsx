import React, { useState, useEffect } from 'react';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { Goal } from '../../types/goal';

export interface NoteModalProps {
  isOpen: boolean;
  onClose: () => void;
  goal: Goal | null;
  date: string;
  initialNote?: string;
  onSave: (note: string) => void;
}

export const NoteModal: React.FC<NoteModalProps> = ({
  isOpen,
  onClose,
  goal,
  date,
  initialNote = '',
  onSave,
}) => {
  const [note, setNote] = useState(initialNote);

  useEffect(() => {
    setNote(initialNote);
  }, [initialNote, isOpen]);

  const handleSave = () => {
    onSave(note.trim());
    onClose();
  };

  if (!goal) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Daily Note: ${goal.name}`}
      maxWidth="md"
    >
      <div className="space-y-4">
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Reflect or record context for <span className="font-semibold text-slate-700 dark:text-slate-300">{date}</span>
        </p>

        <textarea
          rows={4}
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="e.g. Felt strong during workout, completed chapter 4 of algorithms..."
          className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 p-3.5 text-sm text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20 resize-none"
        />

        <div className="flex items-center justify-end gap-3 pt-2">
          <Button variant="secondary" onClick={onClose} size="sm">
            Cancel
          </Button>
          <Button onClick={handleSave} size="sm">
            Save Note
          </Button>
        </div>
      </div>
    </Modal>
  );
};

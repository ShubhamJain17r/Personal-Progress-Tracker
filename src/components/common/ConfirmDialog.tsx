import React from 'react';
import { Modal } from './Modal';
import { Button } from './Button';
import { AlertTriangle } from 'lucide-react';

export interface ConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  isDestructive?: boolean;
  isLoading?: boolean;
}

export const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  isDestructive = true,
  isLoading = false,
}) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} maxWidth="sm">
      <div className="flex items-start gap-4">
        {isDestructive && (
          <div className="p-2.5 rounded-xl bg-red-50 dark:bg-red-950/50 text-red-600 dark:text-red-400 shrink-0">
            <AlertTriangle className="w-5 h-5" />
          </div>
        )}
        <div>
          <p className="text-sm text-slate-600 dark:text-slate-300 mb-6 leading-relaxed">
            {message}
          </p>
          <div className="flex items-center justify-end gap-3">
            <Button variant="secondary" onClick={onClose} disabled={isLoading} size="sm">
              {cancelLabel}
            </Button>
            <Button
              variant={isDestructive ? 'danger' : 'primary'}
              onClick={onConfirm}
              isLoading={isLoading}
              size="sm"
            >
              {confirmLabel}
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  );
};

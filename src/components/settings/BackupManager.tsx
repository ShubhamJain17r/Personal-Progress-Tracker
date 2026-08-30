import React, { useState, useRef } from 'react';
import {
  Download,
  Upload,
  FileSpreadsheet,
  Trash2,
  ShieldCheck,
  AlertTriangle,
  CheckCircle2,
} from 'lucide-react';
import { Card } from '../common/Card';
import { Button } from '../common/Button';
import { ConfirmDialog } from '../common/ConfirmDialog';
import { Modal } from '../common/Modal';
import { exportService } from '../../services/exportService';
import { BackupValidationResult } from '../../types/backup';

export const BackupManager: React.FC = () => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isExportingJSON, setIsExportingJSON] = useState(false);
  const [isExportingCSV, setIsExportingCSV] = useState(false);
  const [isClearModalOpen, setIsClearModalOpen] = useState(false);
  const [isClearing, setIsClearing] = useState(false);

  const [validationResult, setValidationResult] = useState<BackupValidationResult | null>(null);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [isRestoring, setIsRestoring] = useState(false);
  const [importMode, setImportMode] = useState<'replace' | 'merge'>('replace');
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleExportJSON = async () => {
    setIsExportingJSON(true);
    try {
      await exportService.exportJSON();
      setSuccessMessage('JSON backup generated and downloaded successfully.');
    } catch (err: any) {
      alert(`Export failed: ${err.message}`);
    } finally {
      setIsExportingJSON(false);
    }
  };

  const handleExportCSV = async () => {
    setIsExportingCSV(true);
    try {
      await exportService.exportCSV();
      setSuccessMessage('CSV log file exported successfully.');
    } catch (err: any) {
      alert(`CSV export failed: ${err.message}`);
    } finally {
      setIsExportingCSV(false);
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const result = await exportService.parseAndValidateBackupFile(file);
    setValidationResult(result);
    setIsImportModalOpen(true);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleConfirmRestore = async () => {
    if (!validationResult || !validationResult.payload) return;

    setIsRestoring(true);
    try {
      await exportService.restoreBackup(validationResult.payload, importMode);
      setIsImportModalOpen(false);
      setValidationResult(null);
      setSuccessMessage('Database successfully restored from backup!');
    } catch (err: any) {
      alert(`Restore failed: ${err.message}`);
    } finally {
      setIsRestoring(false);
    }
  };

  const handleConfirmClear = async () => {
    setIsClearing(true);
    try {
      await exportService.clearAllData();
      setIsClearModalOpen(false);
      setSuccessMessage('All data has been cleared from local storage.');
    } catch (err: any) {
      alert(`Clear failed: ${err.message}`);
    } finally {
      setIsClearing(false);
    }
  };

  return (
    <div className="space-y-6">
      {successMessage && (
        <div className="flex items-center justify-between rounded-xl bg-emerald-50 dark:bg-emerald-950/50 p-4 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200 text-xs font-semibold">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
            <span>{successMessage}</span>
          </div>
          <button
            onClick={() => setSuccessMessage(null)}
            className="text-emerald-600 hover:text-emerald-900 dark:text-emerald-400"
          >
            Dismiss
          </button>
        </div>
      )}

      <Card className="p-5 border-brand-200 dark:border-brand-900/50 bg-brand-50/30 dark:bg-brand-950/20">
        <div className="flex items-start gap-3">
          <div className="p-2 rounded-xl bg-brand-100 dark:bg-brand-900/50 text-brand-700 dark:text-brand-300 shrink-0">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              Data Privacy & Local Storage
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 leading-relaxed">
              Your tracking data is stored 100% locally in your browser's IndexedDB. No external servers or cloud accounts receive your progress logs. To prevent accidental data loss from browser cache clearing, we recommend downloading regular JSON backups.
            </p>
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Download className="w-5 h-5 text-brand-600 dark:text-brand-400" />
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                JSON Database Backup
              </h3>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-4 leading-relaxed">
              Save your complete progress history, custom categories, and goal configurations to a portable JSON file.
            </p>
          </div>

          <Button
            onClick={handleExportJSON}
            isLoading={isExportingJSON}
            leftIcon={<Download className="w-4 h-4" />}
            size="sm"
          >
            Export JSON Backup
          </Button>
        </Card>

        <Card className="p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Upload className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Restore from Backup
              </h3>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-4 leading-relaxed">
              Restore goals, records, and categories from a previously saved JSON backup file.
            </p>
          </div>

          <div>
            <input
              ref={fileInputRef}
              type="file"
              accept=".json"
              onChange={handleFileChange}
              className="hidden"
            />
            <Button
              variant="secondary"
              onClick={() => fileInputRef.current?.click()}
              leftIcon={<Upload className="w-4 h-4" />}
              size="sm"
            >
              Select Backup File
            </Button>
          </div>
        </Card>

        <Card className="p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <FileSpreadsheet className="w-5 h-5 text-purple-600 dark:text-purple-400" />
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                CSV Records Export
              </h3>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-4 leading-relaxed">
              Export all your daily records, notes, and targets into a formatted CSV spreadsheet for Excel or Google Sheets.
            </p>
          </div>

          <Button
            variant="outline"
            onClick={handleExportCSV}
            isLoading={isExportingCSV}
            leftIcon={<FileSpreadsheet className="w-4 h-4" />}
            size="sm"
          >
            Export CSV Records
          </Button>
        </Card>

        <Card className="p-5 flex flex-col justify-between border-red-200 dark:border-red-900/40 bg-red-50/20 dark:bg-red-950/10">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Trash2 className="w-5 h-5 text-red-600 dark:text-red-400" />
              <h3 className="text-base font-bold text-red-600 dark:text-red-400">
                Reset Local Database
              </h3>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-4 leading-relaxed">
              Permanently delete all goals, records, and categories stored in this browser.
            </p>
          </div>

          <Button
            variant="danger"
            onClick={() => setIsClearModalOpen(true)}
            leftIcon={<Trash2 className="w-4 h-4" />}
            size="sm"
          >
            Clear All Data
          </Button>
        </Card>
      </div>

      <ConfirmDialog
        isOpen={isClearModalOpen}
        onClose={() => setIsClearModalOpen(false)}
        onConfirm={handleConfirmClear}
        title="Clear All Local Data?"
        message="Are you sure you want to delete all goals, categories, and tracking history? This action cannot be undone unless you have a JSON backup."
        confirmLabel="Yes, Delete Everything"
        isLoading={isClearing}
      />

      {validationResult && (
        <Modal
          isOpen={isImportModalOpen}
          onClose={() => setIsImportModalOpen(false)}
          title="Restore Backup"
          maxWidth="md"
        >
          {validationResult.valid && validationResult.summary ? (
            <div className="space-y-4">
              <div className="rounded-xl bg-emerald-50 dark:bg-emerald-950/50 p-4 border border-emerald-200 dark:border-emerald-800">
                <h4 className="text-sm font-bold text-emerald-800 dark:text-emerald-200 mb-1">
                  Valid Backup File Verified
                </h4>
                <div className="text-xs text-slate-600 dark:text-slate-300 space-y-1 mt-2">
                  <p>• Categories: <strong>{validationResult.summary.categoriesCount}</strong></p>
                  <p>• Goals: <strong>{validationResult.summary.goalsCount}</strong></p>
                  <p>• Historical Records: <strong>{validationResult.summary.recordsCount}</strong></p>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-2">
                  Restore Mode
                </label>
                <div className="space-y-2">
                  <label className="flex items-center gap-3 p-3 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50 cursor-pointer">
                    <input
                      type="radio"
                      name="importMode"
                      value="replace"
                      checked={importMode === 'replace'}
                      onChange={() => setImportMode('replace')}
                      className="text-brand-600"
                    />
                    <div>
                      <span className="text-xs font-bold text-slate-800 dark:text-slate-200 block">
                        Replace existing database
                      </span>
                      <span className="text-[11px] text-slate-500">
                        Clears current database and restores exactly what is in this backup.
                      </span>
                    </div>
                  </label>

                  <label className="flex items-center gap-3 p-3 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50 cursor-pointer">
                    <input
                      type="radio"
                      name="importMode"
                      value="merge"
                      checked={importMode === 'merge'}
                      onChange={() => setImportMode('merge')}
                      className="text-brand-600"
                    />
                    <div>
                      <span className="text-xs font-bold text-slate-800 dark:text-slate-200 block">
                        Merge with existing data
                      </span>
                      <span className="text-[11px] text-slate-500">
                        Keeps existing items and adds or updates items from backup.
                      </span>
                    </div>
                  </label>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
                <Button
                  variant="secondary"
                  onClick={() => setIsImportModalOpen(false)}
                  size="sm"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleConfirmRestore}
                  isLoading={isRestoring}
                  size="sm"
                >
                  Confirm Restore
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="rounded-xl bg-red-50 dark:bg-red-950/50 p-4 border border-red-200 dark:border-red-800">
                <div className="flex items-start gap-2 text-red-600 dark:text-red-400">
                  <AlertTriangle className="w-5 h-5 shrink-0" />
                  <div>
                    <h4 className="text-sm font-bold">Invalid Backup File</h4>
                    <p className="text-xs mt-1">{validationResult.error}</p>
                  </div>
                </div>
              </div>

              <div className="flex justify-end pt-2">
                <Button variant="secondary" onClick={() => setIsImportModalOpen(false)} size="sm">
                  Close
                </Button>
              </div>
            </div>
          )}
        </Modal>
      )}
    </div>
  );
};

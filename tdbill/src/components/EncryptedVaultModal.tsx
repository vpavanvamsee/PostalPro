import React, { useState, useRef } from 'react';
import { 
  ShieldCheck, 
  X, 
  Download, 
  Upload, 
  Key, 
  CheckCircle2, 
  AlertCircle, 
  Lock, 
  Unlock, 
  Trash2, 
  Database,
  FileCheck,
  RefreshCw,
  Sparkles
} from 'lucide-react';
import { OfficeProfile, TDAccountItem } from '../types';
import { encryptVaultData, decryptVaultData, VaultBackupPayload } from '../utils/cryptoVault';

interface EncryptedVaultModalProps {
  isOpen: boolean;
  onClose: () => void;
  accounts: TDAccountItem[];
  office: OfficeProfile;
  onRestoreData: (accounts: TDAccountItem[], office: OfficeProfile) => void;
  onClearData: () => void;
}

export const EncryptedVaultModal: React.FC<EncryptedVaultModalProps> = ({
  isOpen,
  onClose,
  accounts,
  office,
  onRestoreData,
  onClearData
}) => {
  const [passphrase, setPassphrase] = useState('');
  const [customKeyEnabled, setCustomKeyEnabled] = useState(false);
  const [statusMsg, setStatusMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  // Handle Export Encrypted Backup
  const handleExportBackup = async () => {
    setIsProcessing(true);
    setStatusMsg(null);

    try {
      const payload: VaultBackupPayload = {
        version: '2.0-AES-GCM',
        createdAt: new Date().toISOString(),
        app: 'PostalPro TD Commission Generator',
        accounts,
        office
      };

      const keyToUse = passphrase.trim() || 'POSTALPRO_TD_SECURE_VAULT_2026';
      const encryptedData = await encryptVaultData(payload, keyToUse);

      const blob = new Blob([encryptedData], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      const dateStr = new Date().toISOString().split('T')[0];
      link.href = url;
      link.download = `PostalPro_TD_Vault_${(office.boName || 'BO').replace(/\s+/g, '_')}_${dateStr}.enc`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      setStatusMsg({
        type: 'success',
        text: `Encrypted backup file exported successfully (${accounts.length} accounts backed up with 256-bit AES-GCM).`
      });
    } catch (err: unknown) {
      const error = err as Error;
      setStatusMsg({
        type: 'error',
        text: `Export failed: ${error.message || 'Error creating secure backup'}`
      });
    } finally {
      setIsProcessing(false);
    }
  };

  // Handle Import / Restore Encrypted File
  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsProcessing(true);
    setStatusMsg(null);

    try {
      const text = await file.text();
      const keyToUse = passphrase.trim() || 'POSTALPRO_TD_SECURE_VAULT_2026';
      const restored = await decryptVaultData(text, keyToUse);

      if (restored && Array.isArray(restored.accounts) && restored.office) {
        onRestoreData(restored.accounts, restored.office);
        setStatusMsg({
          type: 'success',
          text: `Successfully restored ${restored.accounts.length} TD accounts and Branch Profile from encrypted backup!`
        });
      } else {
        throw new Error('Invalid vault backup payload structure.');
      }
    } catch (err: unknown) {
      const error = err as Error;
      setStatusMsg({
        type: 'error',
        text: `Restore failed: ${error.message || 'Incorrect passphrase or corrupted file.'}`
      });
    } finally {
      setIsProcessing(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/75 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full overflow-hidden border border-slate-200 animate-in fade-in zoom-in-95 duration-150">
        
        {/* Header */}
        <div className="bg-emerald-950 px-5 py-4 text-white flex items-center justify-between border-b border-emerald-800">
          <div className="flex items-center gap-3">
            <div className="bg-amber-400 text-slate-950 p-2.5 rounded-xl font-bold shadow-xs">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
                <span>Encrypted Vault & Data Management</span>
              </h2>
              <p className="text-xs text-emerald-300">
                256-bit AES-GCM Encrypted Local Storage
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Close modal"
            className="p-1.5 rounded-xl bg-emerald-900/80 hover:bg-emerald-800 text-emerald-200 hover:text-white cursor-pointer transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-5 sm:p-6 space-y-5 max-h-[80vh] overflow-y-auto text-xs">
          
          {/* Security Notice */}
          <div className="bg-emerald-50 border border-emerald-300 p-3.5 rounded-2xl flex items-start gap-3">
            <ShieldCheck className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5" />
            <div className="text-emerald-950 leading-relaxed">
              <p className="font-bold text-sm">Encrypted Vault & Data Management</p>
              <p className="text-xs text-emerald-800 mt-0.5">
                All leads are 256-bit AES-GCM encrypted locally. You can export a secure backup file or restore on another device.
              </p>
            </div>
          </div>

          {/* Status Message */}
          {statusMsg && (
            <div className={`p-3.5 rounded-2xl flex items-center gap-2.5 text-xs font-bold ${
              statusMsg.type === 'success'
                ? 'bg-emerald-100 border border-emerald-300 text-emerald-900'
                : 'bg-red-100 border border-red-300 text-red-900'
            }`}>
              {statusMsg.type === 'success' ? (
                <CheckCircle2 className="w-5 h-5 text-emerald-700 shrink-0" />
              ) : (
                <AlertCircle className="w-5 h-5 text-red-700 shrink-0" />
              )}
              <span>{statusMsg.text}</span>
            </div>
          )}

          {/* Vault Overview Stats */}
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 grid grid-cols-2 gap-3 text-center">
            <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-xs">
              <p className="text-[10px] uppercase font-bold text-slate-500">Vault TD Accounts</p>
              <p className="text-xl font-black text-slate-900 font-mono mt-0.5">{accounts.length}</p>
            </div>
            <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-xs">
              <p className="text-[10px] uppercase font-bold text-slate-500">Branch Office</p>
              <p className="text-sm font-black text-emerald-800 truncate mt-1">{office.boName || 'vadlamudi'}</p>
            </div>
          </div>

          {/* Custom Password Protection (Optional) */}
          <div className="border border-slate-200 rounded-2xl p-3.5 space-y-2.5 bg-slate-50/50">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                <Key className="w-3.5 h-3.5 text-emerald-700" />
                <span>Custom Passphrase (Optional)</span>
              </label>
              <button
                type="button"
                onClick={() => setCustomKeyEnabled(!customKeyEnabled)}
                className="text-[11px] font-bold text-emerald-700 hover:underline cursor-pointer"
              >
                {customKeyEnabled ? 'Use Default System Key' : '+ Set Custom Password'}
              </button>
            </div>

            {customKeyEnabled && (
              <div className="space-y-1">
                <input
                  type="password"
                  value={passphrase}
                  onChange={(e) => setPassphrase(e.target.value)}
                  placeholder="Enter secret passphrase for backup encryption"
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:outline-none focus:border-emerald-600 font-mono"
                />
                <p className="text-[10px] text-slate-500">
                  Note: Remember this passphrase to restore on other phones or PCs.
                </p>
              </div>
            )}
          </div>

          {/* Action 1: Export Secure Backup File */}
          <div className="space-y-2">
            <p className="text-xs font-bold text-slate-700 uppercase tracking-wider">
              1. Export Encrypted Backup
            </p>
            <button
              id="export-vault-backup-btn"
              type="button"
              disabled={isProcessing || accounts.length === 0}
              onClick={handleExportBackup}
              className="w-full bg-emerald-800 hover:bg-emerald-700 active:bg-emerald-900 disabled:opacity-50 text-white font-bold py-3 px-4 rounded-2xl text-xs transition-all shadow-sm flex items-center justify-center gap-2 cursor-pointer"
            >
              <Download className="w-4 h-4" />
              <span>Export Secure 256-Bit Encrypted Backup (.enc)</span>
            </button>
          </div>

          {/* Action 2: Restore from Backup File */}
          <div className="space-y-2 pt-2 border-t border-slate-200">
            <p className="text-xs font-bold text-slate-700 uppercase tracking-wider">
              2. Restore Backup on This Device
            </p>
            <input
              type="file"
              ref={fileInputRef}
              accept=".enc,.json"
              onChange={handleFileSelect}
              className="hidden"
            />
            <button
              id="import-vault-backup-btn"
              type="button"
              disabled={isProcessing}
              onClick={() => fileInputRef.current?.click()}
              className="w-full bg-slate-900 hover:bg-slate-800 active:bg-slate-950 text-white font-bold py-3 px-4 rounded-2xl text-xs transition-all shadow-sm flex items-center justify-center gap-2 cursor-pointer"
            >
              <Upload className="w-4 h-4 text-amber-400" />
              <span>Select Encrypted Backup File to Restore</span>
            </button>
          </div>

          {/* Action 3: Wipe / Reset Data */}
          <div className="pt-2 border-t border-slate-200 flex items-center justify-between">
            <button
              type="button"
              onClick={() => {
                if (confirm('Are you sure you want to clear all TD accounts from local vault? Make sure you have exported a backup first.')) {
                  onClearData();
                  setStatusMsg({ type: 'success', text: 'Local vault cleared successfully.' });
                }
              }}
              className="text-red-600 hover:text-red-700 text-xs font-semibold flex items-center gap-1 cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Clear Local Storage</span>
            </button>

            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 font-bold hover:bg-slate-200 cursor-pointer"
            >
              Close
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};

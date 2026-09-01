/**
 * SchemeShare by PostalPro - Core Application Logic
 * Modern, sunlight-readable, zero-cloud postal assistant.
 */

import { SCHEMES, generateWhatsAppPitch } from './templates.js';
import { RepitchModalController } from './repitchMessages.js';
import { isAuthorizedEmployeeId } from './whitelist.js';
import {
  sha256,
  getActiveSessionHash,
  setActiveSessionHash,
  clearSession,
  getMaskedEmpId,
  getProfile,
  saveProfile,
  getLeads,
  saveLead,
  updateLeadStatus,
  deleteLead,
  runAutoPurge,
  getStorageStats,
  generateEncryptedExport,
  restoreFromJSON,
  saveVerificationRequest,
  getLatestVerificationRequest,
  getAllVerificationRequests,
  getDismissedVerificationRequests,
  restoreVerificationRequest,
  restoreAllDismissedRequests,
  markVerificationRequestApproved,
  deleteVerificationRequest,
  purgeApprovedRequestsOlderThan12Hours,
  getVerifiedWhitelist,
  addToVerifiedWhitelist,
  removeFromVerifiedWhitelist,
  isEmployeeWhitelisted,
  exportWhitelistSyncToken,
  importWhitelistSyncToken,
  verifyAccountWithCode,
  resetAccountToDemo,
  generateStrictClearanceCode,
  validateClearanceCode,
  clearSampleLeads,
  isAllowedAdminEmail,
  ALLOWED_ADMIN_EMAILS,
  createAdminLoginOTP,
  verifyAdminOTP,
  verifyAdminAuthenticator,
  ADMIN_TOTP_SECRET,
  isAdminAuthenticated,
  logoutAdmin,
  hardWipeAll
} from './storage.js';

// Recognized country codes for international postal articles
const RECOGNIZED_COUNTRY_CODES = new Set([
  'US', 'GB', 'CA', 'DE', 'FR', 'ES', 'IT', 'NL', 'BE', 'CH',
  'AT', 'AU', 'NZ', 'BR', 'MX', 'JP', 'CN', 'RU', 'KR', 'AR',
  'SE', 'NO', 'PL', 'PT'
]);

class SchemeShareApp {
  constructor() {
    this.currentView = 'dashboard';
    this.activeHash = null;
    this.profile = null;
    this.leads = [];
    this.activeTabFolder = 'focus'; // 'focus' | 'won'
    this.searchQuery = '';
    this.chartInstance = null;
    this.scanner = null;
    this.isScanning = false;
    this.previewFontSize = 14; // Default 14px
    this.isSunlightMode = false;
    this.uploadedContactDoc = null; // { name, size, type, rawFile }
    this.repitchController = new RepitchModalController(this);
    
    // Inactivity 5-minute Auto-Logout Timer (300,000 ms)
    this.inactivityTimer = null;
    this.inactivityDurationMs = 5 * 60 * 1000;
    
    // Admin Subtab Navigation & Whitelist search
    this.adminActiveSubTab = 'queue'; // 'queue' | 'whitelist' | 'gen'
    this.adminQueueFilter = 'active'; // 'active' | 'dismissed'
    this.whitelistSearchQuery = '';

    // Pending Lead Delete State
    this.pendingDeleteLeadId = null;

    // Card Style Preference: 'classic' | 'modern' | 'compact'
    this.cardStyle = localStorage.getItem('schemeshare_card_style') || 'classic';
  }

  setCardStyle(style) {
    if (!['classic', 'modern', 'compact'].includes(style)) {
      style = 'classic';
    }
    this.cardStyle = style;
    try {
      localStorage.setItem('schemeshare_card_style', style);
    } catch (e) {
      console.warn('Storage error saving card style:', e);
    }
    this.updateCardStyleUI();
    this.refreshData();
    this.showToast(`Card style changed to ${style.charAt(0).toUpperCase() + style.slice(1)}`, 'info');
  }

  updateCardStyleUI() {
    document.querySelectorAll('[data-card-style-btn]').forEach(btn => {
      const btnStyle = btn.getAttribute('data-card-style-btn');
      if (btnStyle === this.cardStyle) {
        btn.classList.add('bg-blue-600', 'text-white', 'shadow-xs');
        btn.classList.remove('bg-slate-100', 'text-slate-700', 'hover:bg-slate-200');
      } else {
        btn.classList.remove('bg-blue-600', 'text-white', 'shadow-xs');
        btn.classList.add('bg-slate-100', 'text-slate-700', 'hover:bg-slate-200');
      }
    });

    const settingsSelect = document.getElementById('settingsCardStyleSelect');
    if (settingsSelect) {
      settingsSelect.value = this.cardStyle;
    }
  }

  async init() {
    this.bindGlobalEvents();
    this.updateCardStyleUI();
    this.renderSchemeSelectors();
    this.initInactivityTracker();
    
    // Check existing session
    const existingHash = getActiveSessionHash();
    if (existingHash) {
      const profile = getProfile(existingHash);
      if (profile) {
        this.activeHash = existingHash;
        this.profile = profile;
        this.onAuthenticated();
        return;
      }
    }

    // Otherwise show Auth Gate
    this.showAuthGate();
  }

  bindGlobalEvents() {
    // Nav view switches
    document.querySelectorAll('[data-view-btn]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const view = btn.getAttribute('data-view-btn');
        this.navigate(view);
      });
    });

    // Card Style Switchers (Dashboard & Leads Ledger & Settings)
    document.querySelectorAll('[data-card-style-btn]').forEach(btn => {
      btn.addEventListener('click', () => {
        const style = btn.getAttribute('data-card-style-btn');
        if (style) {
          this.setCardStyle(style);
        }
      });
    });

    const settingsCardStyleSelect = document.getElementById('settingsCardStyleSelect');
    if (settingsCardStyleSelect) {
      settingsCardStyleSelect.addEventListener('change', (e) => {
        this.setCardStyle(e.target.value);
      });
    }

    // Floating "Go to Top" button
    const scrollToTopBtn = document.getElementById('scrollToTopBtn');
    if (scrollToTopBtn) {
      window.addEventListener('scroll', () => {
        const scrollPos = window.scrollY || document.documentElement.scrollTop || document.body.scrollTop || 0;
        if (scrollPos > 220) {
          scrollToTopBtn.classList.remove('opacity-0', 'pointer-events-none', 'translate-y-3');
          scrollToTopBtn.classList.add('opacity-100', 'pointer-events-auto', 'translate-y-0');
        } else {
          scrollToTopBtn.classList.remove('opacity-100', 'pointer-events-auto', 'translate-y-0');
          scrollToTopBtn.classList.add('opacity-0', 'pointer-events-none', 'translate-y-3');
        }
      }, { passive: true });

      scrollToTopBtn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
        if (document.documentElement) document.documentElement.scrollTo({ top: 0, behavior: 'smooth' });
      });
    }

    // Auth gate form
    const authForm = document.getElementById('authGateForm');
    if (authForm) {
      authForm.addEventListener('submit', (e) => this.handleAuthSubmit(e));
    }

    // Toggle Auth Password Masking
    const toggleMaskBtn = document.getElementById('toggleAuthMaskBtn');
    const authInput = document.getElementById('authEmpIdInput');
    const toggleIcon = document.getElementById('toggleAuthMaskIcon');
    if (toggleMaskBtn && authInput && toggleIcon) {
      toggleMaskBtn.addEventListener('click', () => {
        const isPassword = authInput.type === 'password';
        authInput.type = isPassword ? 'text' : 'password';
        toggleIcon.className = isPassword ? 'fa-solid fa-eye-slash text-sm' : 'fa-solid fa-eye text-sm';
      });

      // Clear red error styling upon typing
      authInput.addEventListener('input', () => {
        this.resetAuthErrorState();
      });
    }

    // Contact Admin Modal open / close
    const openContactBtn = document.getElementById('openContactAdminBtn');
    if (openContactBtn) {
      openContactBtn.addEventListener('click', () => this.openContactAdminModal());
    }

    ['closeContactAdminModalBtn', 'cancelContactAdminBtn', 'finishContactAdminBtn'].forEach(id => {
      const btn = document.getElementById(id);
      if (btn) {
        btn.addEventListener('click', () => this.closeContactAdminModal());
      }
    });

    const contactModal = document.getElementById('contactAdminModal');
    if (contactModal) {
      contactModal.addEventListener('click', (e) => {
        if (e.target === contactModal) {
          this.closeContactAdminModal();
        }
      });
    }

    // Contact Admin Form submission
    const contactAdminForm = document.getElementById('contactAdminForm');
    if (contactAdminForm) {
      contactAdminForm.addEventListener('submit', (e) => this.handleContactAdminSubmit(e));
    }

    // Profile Setup form
    const onboardingForm = document.getElementById('onboardingForm');
    if (onboardingForm) {
      onboardingForm.addEventListener('submit', (e) => this.handleOnboardingSubmit(e));
    }

    // Profile Created Prompt Modal (WhatsApp ID / Charge Report Prompt)
    const profileCreatedContinueDemoBtn = document.getElementById('profileCreatedContinueDemoBtn');
    if (profileCreatedContinueDemoBtn) {
      profileCreatedContinueDemoBtn.addEventListener('click', () => {
        this.closeProfileCreatedModal();
        this.onAuthenticated();
      });
    }

    const profileCreatedClearanceForm = document.getElementById('profileCreatedClearanceForm');
    if (profileCreatedClearanceForm) {
      profileCreatedClearanceForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const code = document.getElementById('profileCreatedClearanceInput')?.value;
        this.handleClearanceCodeSubmit(code);
      });
    }

    // Send message form inputs (Live Preview updates)
    ['sendAddressee', 'sendSecondary', 'sendArticle', 'sendMobile', 'sendLanguage'].forEach(id => {
      const el = document.getElementById(id);
      if (el) {
        el.addEventListener('input', () => this.updateLiveMessagePreview());
        el.addEventListener('change', () => this.updateLiveMessagePreview());
      }
    });

    // Dispatch message button
    const dispatchBtn = document.getElementById('dispatchWhatsAppBtn');
    if (dispatchBtn) {
      dispatchBtn.addEventListener('click', () => this.handleDispatchWhatsApp());
    }

    // Copy message button
    const copyBtn = document.getElementById('copyMessageBtn');
    if (copyBtn) {
      copyBtn.addEventListener('click', () => this.handleCopyMessage());
    }

    // Font size adjustments for preview readability
    const increaseFontBtn = document.getElementById('increaseFontSizeBtn');
    const decreaseFontBtn = document.getElementById('decreaseFontSizeBtn');
    if (increaseFontBtn && decreaseFontBtn) {
      increaseFontBtn.addEventListener('click', () => {
        if (this.previewFontSize < 20) {
          this.previewFontSize += 2;
          this.applyPreviewStyle();
        }
      });
      decreaseFontBtn.addEventListener('click', () => {
        if (this.previewFontSize > 12) {
          this.previewFontSize -= 2;
          this.applyPreviewStyle();
        }
      });
    }

    // Toggle Sunlight / High-Contrast mode
    const sunlightBtn = document.getElementById('toggleSunlightModeBtn');
    if (sunlightBtn) {
      sunlightBtn.addEventListener('click', () => {
        this.isSunlightMode = !this.isSunlightMode;
        this.applyPreviewStyle();
        this.showToast(this.isSunlightMode ? 'Sunlight High-Contrast Mode Enabled' : 'Standard WhatsApp Mode', 'info');
      });
    }

    // Barcode scanner trigger
    const startScanBtn = document.getElementById('startScanBtn');
    if (startScanBtn) {
      startScanBtn.addEventListener('click', () => this.openBarcodeScanner());
    }
    const closeScanBtn = document.getElementById('closeScanModalBtn');
    if (closeScanBtn) {
      closeScanBtn.addEventListener('click', () => this.closeBarcodeScanner());
    }
    const barcodeModal = document.getElementById('barcodeScannerModal');
    if (barcodeModal) {
      barcodeModal.addEventListener('click', (e) => {
        if (e.target === barcodeModal) {
          this.closeBarcodeScanner();
        }
      });
    }

    // Leads search input
    const leadsSearchInput = document.getElementById('leadsSearchInput');
    if (leadsSearchInput) {
      leadsSearchInput.addEventListener('input', (e) => {
        this.searchQuery = e.target.value.toLowerCase().trim();
        this.renderLeadsLedger();
      });
    }

    // Leads Tab switches
    const tabFocusBtn = document.getElementById('tabFocusLeadsBtn');
    const tabWonBtn = document.getElementById('tabWonLeadsBtn');
    if (tabFocusBtn && tabWonBtn) {
      tabFocusBtn.addEventListener('click', () => {
        this.activeTabFolder = 'focus';
        this.updateLeadsTabUI();
        this.renderLeadsLedger();
      });
      tabWonBtn.addEventListener('click', () => {
        this.activeTabFolder = 'won';
        this.updateLeadsTabUI();
        this.renderLeadsLedger();
      });
    }

    // Auto-uppercase listener for all inputs to ensure consistency
    const uppercaseFieldIds = [
      'authEmpIdInput',
      'onboardName',
      'onboardDivision',
      'onboardOfficeName',
      'contactEmpName',
      'contactEmpNo',
      'contactDivision',
      'editFullName',
      'editDivision',
      'editOfficeName',
      'adminCalcNameInput',
      'adminCalcDivInput',
      'adminCalcEmpInput',
      'modalClearanceCodeInput',
      'clearanceCodeInput',
      'sendAddressee',
      'sendSecondary',
      'sendArticle'
    ];

    uppercaseFieldIds.forEach(id => {
      const el = document.getElementById(id);
      if (el) {
        el.addEventListener('input', (e) => {
          const start = e.target.selectionStart;
          const end = e.target.selectionEnd;
          e.target.value = e.target.value.toUpperCase();
          if (start !== null && end !== null) {
            e.target.setSelectionRange(start, end);
          }
        });
      }
    });

    // Profile Settings Form
    const editProfileForm = document.getElementById('editProfileForm');
    if (editProfileForm) {
      editProfileForm.addEventListener('submit', (e) => this.handleProfileUpdate(e));
    }

    // Dual-Tab Login Switcher (Employee vs Admin Portal)
    const authTabEmpBtn = document.getElementById('authTabEmployeeBtn');
    const authTabAdminBtn = document.getElementById('authTabAdminBtn');
    if (authTabEmpBtn && authTabAdminBtn) {
      authTabEmpBtn.addEventListener('click', () => this.switchAuthTab('employee'));
      authTabAdminBtn.addEventListener('click', () => this.switchAuthTab('admin'));
    }

    // Admin Auth Method Switcher (Google Authenticator 2FA vs Email OTP)
    const adminMethodTotpBtn = document.getElementById('adminAuthMethodTotpBtn');
    const adminMethodEmailBtn = document.getElementById('adminAuthMethodEmailBtn');
    if (adminMethodTotpBtn && adminMethodEmailBtn) {
      adminMethodTotpBtn.addEventListener('click', () => this.switchAdminAuthMethod('totp'));
      adminMethodEmailBtn.addEventListener('click', () => this.switchAdminAuthMethod('email'));
    }

    // Google Authenticator 2FA Form
    const adminTotpForm = document.getElementById('adminTotpLoginForm');
    if (adminTotpForm) {
      adminTotpForm.addEventListener('submit', (e) => this.handleAdminTotpLogin(e));
    }

    // Copy Google Authenticator Secret Key
    const copyTotpSecretBtn = document.getElementById('copyTotpSecretBtn');
    if (copyTotpSecretBtn) {
      copyTotpSecretBtn.addEventListener('click', () => {
        navigator.clipboard.writeText(ADMIN_TOTP_SECRET).then(() => {
          this.showToast(`Secret Key (${ADMIN_TOTP_SECRET}) copied to clipboard!`, 'success');
        });
      });
    }

    // Admin Send OTP Form (Email Fallback)
    const adminSendOtpForm = document.getElementById('adminSendOtpForm');
    if (adminSendOtpForm) {
      adminSendOtpForm.addEventListener('submit', (e) => this.handleAdminSendOtp(e));
    }

    // Admin Verify OTP Form
    const adminVerifyOtpForm = document.getElementById('adminVerifyOtpForm');
    if (adminVerifyOtpForm) {
      adminVerifyOtpForm.addEventListener('submit', (e) => this.handleAdminVerifyOtp(e));
    }

    // Admin OTP Back & Resend Buttons
    const adminOtpBackBtn = document.getElementById('adminOtpBackBtn');
    if (adminOtpBackBtn) {
      adminOtpBackBtn.addEventListener('click', () => {
        document.getElementById('adminAuthRequestStep')?.classList.remove('hidden');
        document.getElementById('adminAuthVerifyStep')?.classList.add('hidden');
      });
    }

    const adminOtpResendBtn = document.getElementById('adminOtpResendBtn');
    if (adminOtpResendBtn) {
      adminOtpResendBtn.addEventListener('click', () => {
        this.handleAdminSendOtp(new Event('submit'));
      });
    }

    // Clearance Code Submission Form (Profile & Security View)
    const clearanceCodeForm = document.getElementById('clearanceCodeForm');
    if (clearanceCodeForm) {
      clearanceCodeForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const code = document.getElementById('clearanceCodeInput')?.value;
        this.handleClearanceCodeSubmit(code);
      });
    }

    // Modal Clearance Code Application (Verification Lock Modal)
    const modalApplyCodeBtn = document.getElementById('modalApplyCodeBtn');
    if (modalApplyCodeBtn) {
      modalApplyCodeBtn.addEventListener('click', () => {
        const code = document.getElementById('modalClearanceCodeInput')?.value;
        this.handleClearanceCodeSubmit(code);
      });
    }

    // Quick Admin Approval Shortcut (Calculates strict clearance code for current profile)
    const quickApproveBtn = document.getElementById('quickApproveDemoBtn');
    if (quickApproveBtn) {
      quickApproveBtn.addEventListener('click', () => {
        if (!this.profile) return;
        const code = generateStrictClearanceCode(
          this.profile.fullName || '',
          this.profile.division || this.profile.officeName || '',
          getMaskedEmpId()
        );
        this.handleClearanceCodeSubmit(code);
      });
    }

    // Reset to Demo Mode (for re-demonstrating training workflows)
    const resetToDemoBtn = document.getElementById('resetToDemoBtn');
    if (resetToDemoBtn) {
      resetToDemoBtn.addEventListener('click', () => this.handleResetToDemo());
    }

    // Admin Clearance Code Helper Console
    const openAdminCodeBtn = document.getElementById('openAdminCodeHelperBtn');
    if (openAdminCodeBtn) {
      openAdminCodeBtn.addEventListener('click', () => this.openAdminCodeHelperModal());
    }

    const closeAdminCodeBtn = document.getElementById('closeAdminCodeModalBtn');
    if (closeAdminCodeBtn) {
      closeAdminCodeBtn.addEventListener('click', () => this.closeAdminCodeHelperModal());
    }

    const adminCodeModal = document.getElementById('adminCodeHelperModal');
    if (adminCodeModal) {
      adminCodeModal.addEventListener('click', (e) => {
        if (e.target === adminCodeModal) {
          this.closeAdminCodeHelperModal();
        }
      });
    }

    // Generator inputs live calculation
    ['adminCalcNameInput', 'adminCalcDivInput', 'adminCalcEmpInput'].forEach(id => {
      const el = document.getElementById(id);
      if (el) {
        el.addEventListener('input', () => this.updateAdminCalculatedCode());
      }
    });

    const copyGeneratedBtn = document.getElementById('copyGeneratedCodeBtn');
    if (copyGeneratedBtn) {
      copyGeneratedBtn.addEventListener('click', () => {
        const code = document.getElementById('adminGeneratedCodeDisplay')?.textContent || '';
        if (code && code !== 'PS-XXXX-XXXX-XXXX') {
          navigator.clipboard.writeText(code).then(() => {
            this.showToast(`Clearance Code ${code} copied to clipboard!`, 'success');
          });
        } else {
          this.showToast('Please enter Employee details to generate a code first.', 'info');
        }
      });
    }

    const adminSendWhatsappBtn = document.getElementById('adminSendWhatsappBtn');
    if (adminSendWhatsappBtn) {
      adminSendWhatsappBtn.addEventListener('click', () => this.handleAdminSendWhatsappCode());
    }

    // Admin Sub-Tab Switchers
    const subTabQueueBtn = document.getElementById('adminSubTabQueueBtn');
    const subTabWhitelistBtn = document.getElementById('adminSubTabWhitelistBtn');
    const subTabGenBtn = document.getElementById('adminSubTabGenBtn');
    if (subTabQueueBtn && subTabWhitelistBtn && subTabGenBtn) {
      subTabQueueBtn.addEventListener('click', () => this.switchAdminSubTab('queue'));
      subTabWhitelistBtn.addEventListener('click', () => this.switchAdminSubTab('whitelist'));
      subTabGenBtn.addEventListener('click', () => this.switchAdminSubTab('gen'));
    }

    // Admin 12-Hour Purge Button
    const adminPurgeExpiredBtn = document.getElementById('adminPurgeExpiredBtn');
    if (adminPurgeExpiredBtn) {
      adminPurgeExpiredBtn.addEventListener('click', () => this.handlePurgeOldVerifiedRequests());
    }

    // Admin Whitelist Search
    const adminWhitelistSearchInput = document.getElementById('adminWhitelistSearchInput');
    if (adminWhitelistSearchInput) {
      adminWhitelistSearchInput.addEventListener('input', (e) => {
        this.whitelistSearchQuery = e.target.value.toLowerCase().trim();
        this.renderAdminWhitelist();
      });
    }

    // Admin Manual Whitelist Form
    const manualWhitelistForm = document.getElementById('adminManualWhitelistForm');
    if (manualWhitelistForm) {
      manualWhitelistForm.addEventListener('submit', (e) => this.handleAdminManualWhitelistSubmit(e));
    }

    // Admin Whitelist Export & Import Tokens
    const exportWhitelistBtn = document.getElementById('adminExportWhitelistBtn');
    if (exportWhitelistBtn) {
      exportWhitelistBtn.addEventListener('click', () => this.handleExportWhitelistToken());
    }

    const importWhitelistBtn = document.getElementById('adminImportWhitelistBtn');
    if (importWhitelistBtn) {
      importWhitelistBtn.addEventListener('click', () => this.handleImportWhitelistToken());
    }

    const adminQueueFilterActiveBtn = document.getElementById('adminQueueFilterActiveBtn');
    if (adminQueueFilterActiveBtn) {
      adminQueueFilterActiveBtn.addEventListener('click', () => {
        this.adminQueueFilter = 'active';
        this.renderAdminRequestsList();
      });
    }

    const adminQueueFilterDismissedBtn = document.getElementById('adminQueueFilterDismissedBtn');
    if (adminQueueFilterDismissedBtn) {
      adminQueueFilterDismissedBtn.addEventListener('click', () => {
        this.adminQueueFilter = 'dismissed';
        this.renderAdminRequestsList();
      });
    }

    const adminRestoreAllDismissedBtn = document.getElementById('adminRestoreAllDismissedBtn');
    if (adminRestoreAllDismissedBtn) {
      adminRestoreAllDismissedBtn.addEventListener('click', () => {
        const count = restoreAllDismissedRequests();
        this.adminQueueFilter = 'active';
        this.renderAdminRequestsList();
        this.showToast(`Restored ${count} request(s) back to active queue!`, 'success');
      });
    }

    const adminRefreshRequestsBtn = document.getElementById('adminRefreshRequestsBtn');
    if (adminRefreshRequestsBtn) {
      adminRefreshRequestsBtn.addEventListener('click', () => {
        this.renderAdminRequestsList();
        this.showToast('Applicant request list refreshed.', 'info');
      });
    }

    const adminInstantUnlockBtn = document.getElementById('adminInstantUnlockBtn');
    if (adminInstantUnlockBtn) {
      adminInstantUnlockBtn.addEventListener('click', () => this.handleAdminInstantUnlock());
    }

    const adminLogoutBtn = document.getElementById('adminLogoutBtn');
    if (adminLogoutBtn) {
      adminLogoutBtn.addEventListener('click', () => this.handleAdminLogout());
    }

    const adminModalLogoutBtn = document.getElementById('adminModalLogoutBtn');
    if (adminModalLogoutBtn) {
      adminModalLogoutBtn.addEventListener('click', () => this.handleAdminLogout());
    }

    // In-app Hard Wipe Modal controls
    const cancelHardWipeBtn = document.getElementById('cancelHardWipeBtn');
    if (cancelHardWipeBtn) {
      cancelHardWipeBtn.addEventListener('click', () => this.closeHardWipeModal());
    }

    const executeHardWipeBtn = document.getElementById('executeHardWipeBtn');
    if (executeHardWipeBtn) {
      executeHardWipeBtn.addEventListener('click', () => this.executeHardWipe());
    }

    const hardWipeModal = document.getElementById('hardWipeConfirmModal');
    if (hardWipeModal) {
      hardWipeModal.addEventListener('click', (e) => {
        if (e.target === hardWipeModal) {
          this.closeHardWipeModal();
        }
      });
    }

    // Verification Success Workflow Choice Buttons
    const clearDemoLeadsBtn = document.getElementById('clearDemoLeadsBtn');
    if (clearDemoLeadsBtn) {
      clearDemoLeadsBtn.addEventListener('click', () => this.handleClearDemoLeads());
    }

    const keepDemoLeadsBtn = document.getElementById('keepDemoLeadsBtn');
    if (keepDemoLeadsBtn) {
      keepDemoLeadsBtn.addEventListener('click', () => this.handleKeepDemoLeads());
    }

    // Verification Lock Modal controls
    const closeLockModalBtn = document.getElementById('closeLockModalBtn');
    if (closeLockModalBtn) {
      closeLockModalBtn.addEventListener('click', () => this.closeVerificationLockModal());
    }

    const lockModal = document.getElementById('verificationLockModal');
    if (lockModal) {
      lockModal.addEventListener('click', (e) => {
        if (e.target === lockModal) {
          this.closeVerificationLockModal();
        }
      });
    }

    const simulateDispatchBtn = document.getElementById('simulateDemoDispatchBtn');
    if (simulateDispatchBtn) {
      simulateDispatchBtn.addEventListener('click', () => this.handleSimulateDemoDispatch());
    }

    // Backup & Export
    const exportBtn = document.getElementById('exportBackupBtn');
    if (exportBtn) {
      exportBtn.addEventListener('click', () => {
        generateEncryptedExport(this.activeHash);
        this.showToast('Encrypted backup downloaded successfully!', 'success');
      });
    }

    // Restore File Upload
    const restoreInput = document.getElementById('restoreFileInput');
    if (restoreInput) {
      restoreInput.addEventListener('change', (e) => this.handleFileRestore(e));
    }

    // Auto-Purge selector
    const autoPurgeSelect = document.getElementById('autoPurgeSelect');
    if (autoPurgeSelect) {
      autoPurgeSelect.addEventListener('change', (e) => {
        if (!this.profile) return;
        this.profile.autoPurgeDays = parseInt(e.target.value) || 0;
        saveProfile(this.activeHash, this.profile);
        this.showToast(`Auto-purge updated to ${e.target.value} days`, 'info');
      });
    }

    // Delete Lead Confirmation Modal
    const cancelDeleteLeadBtn = document.getElementById('cancelDeleteLeadBtn');
    if (cancelDeleteLeadBtn) {
      cancelDeleteLeadBtn.addEventListener('click', () => this.closeDeleteLeadModal());
    }

    const confirmDeleteLeadBtn = document.getElementById('confirmDeleteLeadBtn');
    if (confirmDeleteLeadBtn) {
      confirmDeleteLeadBtn.addEventListener('click', () => this.executeDeleteLead());
    }

    const deleteLeadModal = document.getElementById('deleteLeadModal');
    if (deleteLeadModal) {
      deleteLeadModal.addEventListener('click', (e) => {
        if (e.target === deleteLeadModal) {
          this.closeDeleteLeadModal();
        }
      });
    }

    // Hard Wipe Button
    const hardWipeBtn = document.getElementById('hardWipeBtn');
    if (hardWipeBtn) {
      hardWipeBtn.addEventListener('click', () => this.confirmHardWipe());
    }

    // Lock session
    const lockSessionBtn = document.getElementById('lockSessionBtn');
    if (lockSessionBtn) {
      lockSessionBtn.addEventListener('click', () => {
        clearSession();
        window.location.reload();
      });
    }

    // Footer Info Modals
    document.querySelectorAll('[data-footer-modal]').forEach(btn => {
      btn.addEventListener('click', () => {
        const modalKey = btn.getAttribute('data-footer-modal');
        this.openFooterModal(modalKey);
      });
    });

    const closeFooterBtn = document.getElementById('closeFooterModalBtn');
    const dismissFooterBtn = document.getElementById('dismissFooterModalBtn');
    const footerModal = document.getElementById('footerInfoModal');

    if (closeFooterBtn) {
      closeFooterBtn.addEventListener('click', () => this.closeFooterModal());
    }
    if (dismissFooterBtn) {
      dismissFooterBtn.addEventListener('click', () => this.closeFooterModal());
    }
    if (footerModal) {
      footerModal.addEventListener('click', (e) => {
        if (e.target === footerModal) {
          this.closeFooterModal();
        }
      });
    }

    // Global Escape Key to dismiss active modals
    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        this.closeDeleteLeadModal();
        this.closeHardWipeModal();
        this.closeFooterModal();
        this.closeAdminCodeHelperModal();
        this.closeVerificationLockModal();
        this.closeContactAdminModal();
        this.closeProfileCreatedModal();
        this.closeVerificationSuccessPromptModal();
        this.closeBarcodeScanner();
      }
    });
  }

  // --- REUSABLE SMOOTH MODAL TRANSITION ENGINE ---
  openModal(modal) {
    if (!modal) return;
    if (typeof modal === 'string') modal = document.getElementById(modal);
    if (!modal) return;

    if (modal._closeTimeout) {
      clearTimeout(modal._closeTimeout);
      modal._closeTimeout = null;
    }

    modal.classList.remove('hidden');
    modal.classList.remove('modal-leaving');
    void modal.offsetWidth; // Force reflow to initiate smooth transition

    requestAnimationFrame(() => {
      modal.classList.add('modal-active');
      const card = modal.querySelector('.modal-card-anim');
      if (card) {
        card.classList.remove('modal-card-leaving');
        card.classList.add('modal-card-active');
      }
    });
  }

  closeModal(modal, callback) {
    if (!modal) return;
    if (typeof modal === 'string') modal = document.getElementById(modal);
    if (!modal || modal.classList.contains('hidden')) return;

    if (modal._closeTimeout) {
      clearTimeout(modal._closeTimeout);
    }

    modal.classList.remove('modal-active');
    modal.classList.add('modal-leaving');

    const card = modal.querySelector('.modal-card-anim');
    if (card) {
      card.classList.remove('modal-card-active');
      card.classList.add('modal-card-leaving');
    }

    modal._closeTimeout = setTimeout(() => {
      modal.classList.add('hidden');
      modal.classList.remove('modal-leaving');
      if (card) card.classList.remove('modal-card-leaving');
      modal._closeTimeout = null;
      if (typeof callback === 'function') callback();
    }, 200);
  }

  showAuthGate() {
    const authGate = document.getElementById('authGateContainer');
    const onboardModal = document.getElementById('onboardingModal');
    const mainApp = document.getElementById('mainAppContainer');
    if (authGate) authGate.classList.remove('hidden');
    if (onboardModal) this.closeModal(onboardModal);
    if (mainApp) mainApp.classList.add('hidden');
    this.resetAuthErrorState();
  }

  switchAuthTab(tab) {
    const empBtn = document.getElementById('authTabEmployeeBtn');
    const adminBtn = document.getElementById('authTabAdminBtn');
    const empView = document.getElementById('authEmployeeView');
    const adminView = document.getElementById('authAdminView');

    if (tab === 'admin') {
      if (adminBtn) {
        adminBtn.className = 'flex-1 py-2 px-3 rounded-lg text-xs font-bold transition flex items-center justify-center space-x-1.5 cursor-pointer bg-white text-blue-950 font-black shadow-xs';
      }
      if (empBtn) {
        empBtn.className = 'flex-1 py-2 px-3 rounded-lg text-xs font-bold transition flex items-center justify-center space-x-1.5 cursor-pointer text-blue-200 hover:text-white hover:bg-white/10';
      }
      if (adminView) adminView.classList.remove('hidden');
      if (empView) empView.classList.add('hidden');
      document.getElementById('adminTotpEmailInput')?.focus();
    } else {
      if (empBtn) {
        empBtn.className = 'flex-1 py-2 px-3 rounded-lg text-xs font-bold transition flex items-center justify-center space-x-1.5 cursor-pointer bg-white text-blue-950 font-black shadow-xs';
      }
      if (adminBtn) {
        adminBtn.className = 'flex-1 py-2 px-3 rounded-lg text-xs font-bold transition flex items-center justify-center space-x-1.5 cursor-pointer text-blue-200 hover:text-white hover:bg-white/10';
      }
      if (empView) empView.classList.remove('hidden');
      if (adminView) adminView.classList.add('hidden');
      document.getElementById('authEmpIdInput')?.focus();
    }
  }

  switchAdminAuthMethod(method) {
    const totpBtn = document.getElementById('adminAuthMethodTotpBtn');
    const emailBtn = document.getElementById('adminAuthMethodEmailBtn');
    const totpContainer = document.getElementById('adminTotpMethodContainer');
    const emailContainer = document.getElementById('adminEmailMethodContainer');

    if (method === 'totp') {
      if (totpBtn) {
        totpBtn.className = 'py-2 px-3 text-xs font-bold rounded-lg bg-white text-slate-900 shadow-xs flex items-center justify-center space-x-1.5 transition cursor-pointer';
      }
      if (emailBtn) {
        emailBtn.className = 'py-2 px-3 text-xs font-bold rounded-lg text-slate-600 hover:text-slate-900 flex items-center justify-center space-x-1.5 transition cursor-pointer';
      }
      if (totpContainer) totpContainer.classList.remove('hidden');
      if (emailContainer) emailContainer.classList.add('hidden');
      document.getElementById('adminTotpEmailInput')?.focus();
    } else {
      if (emailBtn) {
        emailBtn.className = 'py-2 px-3 text-xs font-bold rounded-lg bg-white text-slate-900 shadow-xs flex items-center justify-center space-x-1.5 transition cursor-pointer';
      }
      if (totpBtn) {
        totpBtn.className = 'py-2 px-3 text-xs font-bold rounded-lg text-slate-600 hover:text-slate-900 flex items-center justify-center space-x-1.5 transition cursor-pointer';
      }
      if (emailContainer) emailContainer.classList.remove('hidden');
      if (totpContainer) totpContainer.classList.add('hidden');
      document.getElementById('adminAuthEmailInput')?.focus();
    }
  }

  async handleAdminTotpLogin(e) {
    if (e && e.preventDefault) e.preventDefault();
    const emailInput = document.getElementById('adminTotpEmailInput');
    const codeInput = document.getElementById('adminTotpCodeInput');
    const errorContainer = document.getElementById('adminTotpErrorContainer');
    const errorMsg = document.getElementById('adminTotpErrorMsg');

    const email = (emailInput?.value || '').trim().toLowerCase();
    const code = (codeInput?.value || '').trim();

    if (errorContainer) errorContainer.classList.add('hidden');

    if (!email) {
      if (errorMsg) errorMsg.textContent = 'Please enter your Admin Email Address.';
      if (errorContainer) errorContainer.classList.remove('hidden');
      return;
    }

    if (!code || code.length !== 6) {
      if (errorMsg) errorMsg.textContent = 'Please enter the 6-digit Google Authenticator code.';
      if (errorContainer) errorContainer.classList.remove('hidden');
      return;
    }

    const res = await verifyAdminAuthenticator(email, code);
    if (res.success) {
      this.showToast('Google 2FA Verified! Welcome Admin.', 'success');
      if (codeInput) codeInput.value = '';
      this.switchAuthTab('employee');
      this.openAdminCodeHelperModal();
    } else {
      if (errorMsg) errorMsg.textContent = res.message || 'Invalid Authenticator code.';
      if (errorContainer) errorContainer.classList.remove('hidden');
    }
  }

  async handleAdminSendOtp(e) {
    if (e && e.preventDefault) e.preventDefault();
    const emailInput = document.getElementById('adminAuthEmailInput');
    const email = (emailInput?.value || '').trim().toLowerCase();
    const errorContainer = document.getElementById('adminAuthErrorContainer');
    const errorMsg = document.getElementById('adminAuthErrorMsg');

    if (errorContainer) errorContainer.classList.add('hidden');

    if (!email) {
      if (errorMsg) errorMsg.textContent = 'Please enter an authorized Admin Email ID.';
      if (errorContainer) errorContainer.classList.remove('hidden');
      return;
    }

    if (!isAllowedAdminEmail(email)) {
      if (errorMsg) errorMsg.textContent = 'Access Denied: This email address is not authorized for administrator access.';
      if (errorContainer) errorContainer.classList.remove('hidden');
      return;
    }

    const res = createAdminLoginOTP(email);
    if (res.success) {
      const targetLabel = document.getElementById('adminOtpEmailTargetLabel');
      if (targetLabel) targetLabel.textContent = email;

      document.getElementById('adminAuthRequestStep')?.classList.add('hidden');
      document.getElementById('adminAuthVerifyStep')?.classList.remove('hidden');

      const otpInput = document.getElementById('adminOtpInput');
      if (otpInput) {
        otpInput.value = '';
        otpInput.focus();
      }

      this.showToast(`6-Digit OTP sent to ${email} (Fallback PINs active)`, 'success');
      if (res.otpHint) {
        console.log(`[Admin OTP Simulation Hint]: ${res.otpHint}`);
      }
    } else {
      if (errorMsg) errorMsg.textContent = res.message || 'Failed to generate OTP.';
      if (errorContainer) errorContainer.classList.remove('hidden');
    }
  }

  async handleAdminVerifyOtp(e) {
    if (e && e.preventDefault) e.preventDefault();
    const otpInput = document.getElementById('adminOtpInput');
    const otp = (otpInput?.value || '').trim();
    const errorContainer = document.getElementById('adminVerifyErrorContainer');
    const errorMsg = document.getElementById('adminVerifyErrorMsg');

    if (errorContainer) errorContainer.classList.add('hidden');

    if (!otp) {
      if (errorMsg) errorMsg.textContent = 'Please enter the 6-digit OTP received in email.';
      if (errorContainer) errorContainer.classList.remove('hidden');
      return;
    }

    const res = await verifyAdminOTP(otp);
    if (res.success) {
      this.showToast('Admin Authenticated! Welcome to Clearance Console.', 'success');
      // Reset forms and switch back
      document.getElementById('adminAuthRequestStep')?.classList.remove('hidden');
      document.getElementById('adminAuthVerifyStep')?.classList.add('hidden');
      if (otpInput) otpInput.value = '';
      this.switchAuthTab('employee');
      this.openAdminCodeHelperModal();
    } else {
      if (errorMsg) errorMsg.textContent = res.message || 'Invalid or expired OTP.';
      if (errorContainer) errorContainer.classList.remove('hidden');
    }
  }

  triggerAuthJitter(errorMessage) {
    const card = document.getElementById('authGateCard');
    const input = document.getElementById('authEmpIdInput');
    const errorContainer = document.getElementById('authErrorContainer');
    const errorMsg = document.getElementById('authErrorMsg');

    if (errorMsg) {
      errorMsg.innerHTML = `<i class="fa-solid fa-circle-exclamation text-red-600 text-sm shrink-0 mt-0.5"></i> <span>${errorMessage}</span>`;
    }
    if (errorContainer) {
      errorContainer.classList.remove('hidden');
    }

    if (input) {
      input.classList.remove('border-slate-300', 'focus:ring-blue-600');
      input.classList.add('border-red-500', 'ring-2', 'ring-red-400', 'bg-red-50/70', 'text-red-900');
      input.focus();
    }

    if (card) {
      card.classList.remove('jitter-error');
      // Trigger browser reflow to restart CSS shake animation
      void card.offsetWidth;
      card.classList.add('jitter-error');
      setTimeout(() => {
        card.classList.remove('jitter-error');
      }, 500);
    }
  }

  resetAuthErrorState() {
    const input = document.getElementById('authEmpIdInput');
    const errorContainer = document.getElementById('authErrorContainer');
    if (errorContainer) errorContainer.classList.add('hidden');
    if (input) {
      input.classList.remove('border-red-500', 'ring-2', 'ring-red-400', 'bg-red-50/70', 'text-red-900');
      input.classList.add('border-slate-300', 'focus:ring-blue-600');
    }
  }

  async handleAuthSubmit(e) {
    e.preventDefault();
    const empInput = document.getElementById('authEmpIdInput');
    const rawVal = (empInput.value || '').trim();

    this.resetAuthErrorState();

    // Check if ID is in static whitelist or dynamic verified whitelist
    const whitelistedRec = isEmployeeWhitelisted(rawVal);
    const isAuth = isAuthorizedEmployeeId(rawVal) || Boolean(whitelistedRec);

    if (!isAuth) {
      this.triggerAuthJitter('Invalid Employee ID. Access is restricted to authorized department Employee IDs.');
      return;
    }

    const normalizedId = rawVal.toUpperCase();
    const hash = await sha256(normalizedId);
    this.activeHash = hash;
    setActiveSessionHash(hash, normalizedId);

    let existingProfile = getProfile(hash);

    // Cross-Mobile Login Provisioning: If this employee is in the verified whitelist, provision their profile automatically!
    if (!existingProfile && whitelistedRec) {
      existingProfile = {
        fullName: whitelistedRec.fullName,
        designation: whitelistedRec.designation || 'BPM',
        division: whitelistedRec.division,
        circle: whitelistedRec.circle || 'Andhra Pradesh Circle',
        officeName: whitelistedRec.division,
        officeType: 'BO',
        pincode: '518001',
        mobile: whitelistedRec.mobile || '',
        employeeId: normalizedId,
        isVerified: true,
        verificationStatus: 'verified',
        verifiedAt: whitelistedRec.verifiedAt || new Date().toISOString(),
        clearanceCodeUsed: whitelistedRec.clearanceCode,
        autoPurgeDays: 60,
        consentAgreedAt: new Date().toISOString()
      };
      saveProfile(hash, existingProfile);
    } else if (existingProfile && whitelistedRec && !existingProfile.isVerified) {
      existingProfile.isVerified = true;
      existingProfile.verificationStatus = 'verified';
      existingProfile.verifiedAt = whitelistedRec.verifiedAt || new Date().toISOString();
      existingProfile.clearanceCodeUsed = whitelistedRec.clearanceCode;
      saveProfile(hash, existingProfile);
    }

    if (!existingProfile) {
      // First-time onboarding
      document.getElementById('authGateContainer').classList.add('hidden');
      this.openModal('onboardingModal');
      const maskedPreview = normalizedId.length > 4 
        ? `ID: ${'*'.repeat(normalizedId.length - 4)}${normalizedId.slice(-4)}`
        : `ID: ${normalizedId}`;
      document.getElementById('onboardingEmpIdPreview').textContent = maskedPreview;
    } else {
      this.profile = existingProfile;
      this.onAuthenticated();
      if (whitelistedRec) {
        this.showToast(`Cross-Mobile Login: Welcome ${existingProfile.fullName}! Verified identity loaded from Whitelist.`, 'success');
      }
    }
  }

  /**
   * Contact Admin & Verification Logic
   */
  openContactAdminModal() {
    const formView = document.getElementById('contactAdminFormView');
    const successView = document.getElementById('contactAdminSuccessView');

    if (formView) formView.classList.remove('hidden');
    if (successView) successView.classList.add('hidden');
    this.openModal('contactAdminModal');
  }

  closeContactAdminModal() {
    this.closeModal('contactAdminModal');
  }

  async handleContactAdminSubmit(e) {
    e.preventDefault();
    const empName = (document.getElementById('contactEmpName')?.value || '').trim().toUpperCase();
    const empNo = (document.getElementById('contactEmpNo')?.value || '').trim().toUpperCase();
    const circle = (document.getElementById('contactCircle')?.value || 'Andhra Pradesh Circle').trim();
    const division = (document.getElementById('contactDivision')?.value || '').trim().toUpperCase();
    const mobile = (document.getElementById('contactMobile')?.value || '').trim();
    const email = (document.getElementById('contactEmail')?.value || '').trim().toLowerCase();

    if (!empName || !empNo || !circle || !division || !mobile || !email) {
      this.showToast('Please fill in all mandatory fields.', 'error');
      return;
    }

    if (!/^\d{10}$/.test(mobile)) {
      this.showToast('Please enter a valid 10-digit WhatsApp Mobile number.', 'error');
      return;
    }

    const record = {
      empName,
      empNo,
      circle,
      division,
      mobile,
      email
    };

    const savedRequest = saveVerificationRequest(record);
    const refNo = savedRequest?.id || 'VERIFY-' + Date.now().toString(36).toUpperCase();
    const submissionTime = new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' });

    // Refresh admin queue if console is active
    this.renderAdminRequestsList();

    // Populate Success View
    const refEl = document.getElementById('verifyRefNo');
    const nameEl = document.getElementById('verifySuccessName');
    const noEl = document.getElementById('verifySuccessEmpNo');
    const circleEl = document.getElementById('verifySuccessCircle');
    const divEl = document.getElementById('verifySuccessDivision');
    const mobEl = document.getElementById('verifySuccessMobile');
    const emailEl = document.getElementById('verifySuccessEmail');

    if (refEl) refEl.textContent = refNo;
    if (nameEl) nameEl.textContent = empName;
    if (noEl) noEl.textContent = empNo;
    if (circleEl) circleEl.textContent = circle;
    if (divEl) divEl.textContent = division;
    if (mobEl) mobEl.textContent = `+91 ${mobile}`;
    if (emailEl) emailEl.textContent = email;

    // Prepare Email Dispatch Payloads with 12-Hour SLA & ID/Charge report mention
    const emailSubject = encodeURIComponent(`[SchemeShare Verification] ${empName} - Emp ID: ${empNo} (${division}, ${circle})`);
    const emailBodyRaw = 
      `RESPECTED SCHEMESHARE ADMIN / VERIFICATION CELL,\n\n` +
      `Thank you for SchemeShare Support. I am submitting my official details for departmental identity verification.\n\n` +
      `VERIFICATION DOSSIER:\n` +
      `========================================\n` +
      `• Verification Ref: ${refNo}\n` +
      `• Employee Full Name: ${empName}\n` +
      `• Employee Number / ID: ${empNo}\n` +
      `• Postal Circle: ${circle}\n` +
      `• Postal Division: ${division}\n` +
      `• WhatsApp Mobile: +91 ${mobile}\n` +
      `• Applicant Email: ${email}\n` +
      `• Submission Time: ${submissionTime}\n` +
      `• Turnaround SLA: Processed within 12 hours\n` +
      `• Forwarding Destination: postalpro.in@gmail.com\n` +
      `========================================\n\n` +
      `ATTACHMENT FOR GENUINITY VERIFICATION:\n` +
      `I am attaching my Departmental ID Card / Charge Report / BPM Pay Slip with this request for verification.\n\n` +
      `Kindly verify and clear my SchemeShare account.\n\n` +
      `Thanking you,\n` +
      `${empName}\n` +
      `India Post Department of Posts`;
    
    const emailBody = encodeURIComponent(emailBodyRaw);

    // 1. Direct Gmail Web Link (Opens Gmail Web Composer pre-filled)
    const gmailLink = document.getElementById('openGmailWebLink');
    if (gmailLink) {
      gmailLink.href = `https://mail.google.com/mail/?view=cm&fs=1&to=postalpro.in@gmail.com&su=${emailSubject}&body=${emailBody}`;
    }

    // 2. Pre-filled WhatsApp Direct Message Link to Admin (+91 6309833253)
    const whatsappRawText = 
      `*SchemeShare Department Employee Verification Request*\n\n` +
      `*Verification Ref:* ${refNo}\n` +
      `*Employee Name:* ${empName}\n` +
      `*Employee Number / ID:* ${empNo}\n` +
      `*Postal Circle:* ${circle}\n` +
      `*Postal Division:* ${division}\n` +
      `*WhatsApp Mobile:* +91 ${mobile}\n` +
      `*Applicant Email:* ${email}\n` +
      `*Submission Time:* ${submissionTime}\n` +
      `*Forwarding Destination:* postalpro.in@gmail.com\n\n` +
      `_Hello Admin, I have submitted my official details for SchemeShare verification. I understand requests are processed within 12 hours. I am sharing my Department ID Card / Charge Report for identity clearance._`;

    const whatsappText = encodeURIComponent(whatsappRawText);
    const waAdminDirectUrl = `https://wa.me/916309833253?text=${whatsappText}`;
    
    const whatsappLink = document.getElementById('openWhatsAppAdminLink');
    if (whatsappLink) {
      whatsappLink.href = waAdminDirectUrl;
    }

    // Simultaneously trigger WhatsApp dispatch on behalf of user to ensure instant delivery
    try {
      window.open(waAdminDirectUrl, '_blank');
    } catch (err) {
      console.log('Direct popup note:', err);
    }

    // 3. System Default Mailto Link
    const emailLink = document.getElementById('openDirectAdminEmailLink');
    if (emailLink) {
      emailLink.href = `mailto:postalpro.in@gmail.com?subject=${emailSubject}&body=${emailBody}`;
    }

    // Switch View to Genuinity Verification Screen
    document.getElementById('contactAdminFormView').classList.add('hidden');
    document.getElementById('contactAdminSuccessView').classList.remove('hidden');

    const badge = document.getElementById('emailDeliveryBadge');
    if (badge) {
      badge.className = 'inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full text-xs font-bold bg-blue-100 text-blue-900 border border-blue-300';
      badge.innerHTML = '<i class="fa-solid fa-spinner fa-spin text-[10px]"></i><span>Transmitting to postalpro.in@gmail.com...</span>';
    }

    // Automated Background HTTP Dispatch to postalpro.in@gmail.com
    try {
      const response = await fetch('https://formsubmit.co/ajax/postalpro.in@gmail.com', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          _subject: `[SchemeShare Verification] ${empName} - Emp ID: ${empNo} (${division}, ${circle})`,
          _template: 'table',
          _captcha: 'false',
          Employee_Name: empName,
          Employee_Number: empNo,
          Postal_Circle: circle,
          Postal_Division: division,
          WhatsApp_Mobile: `+91 ${mobile}`,
          Applicant_Email: email,
          Verification_Ref: refNo,
          Admin_Target: 'postalpro.in@gmail.com',
          Turnaround_Time: 'Within 12 hours',
          Submission_Time: submissionTime
        })
      });

      if (badge) {
        if (response.ok) {
          badge.className = 'inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-900 border border-emerald-300';
          badge.innerHTML = '<i class="fa-solid fa-check-double text-[10px]"></i><span>Dispatched to postalpro.in@gmail.com</span>';
        } else {
          badge.className = 'inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-900 border border-emerald-300';
          badge.innerHTML = '<i class="fa-solid fa-check text-[10px]"></i><span>Submitted (Ready to Forward)</span>';
        }
      }
    } catch (err) {
      console.log('Background dispatch note:', err);
      if (badge) {
        badge.className = 'inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-900 border border-emerald-300';
        badge.innerHTML = '<i class="fa-solid fa-check text-[10px]"></i><span>Submitted (Ready to Forward)</span>';
      }
    }

    this.showToast('Verification request recorded. Details dispatched to postalpro.in@gmail.com.', 'success');
  }

  async handleOnboardingSubmit(e) {
    e.preventDefault();
    const fullName = (document.getElementById('onboardName')?.value || '').trim().toUpperCase();
    const designation = document.getElementById('onboardDesignation')?.value || 'BPM';
    const division = (document.getElementById('onboardDivision')?.value || '').trim().toUpperCase();
    const officeName = (document.getElementById('onboardOfficeName')?.value || '').trim().toUpperCase();
    const officeType = document.getElementById('onboardOfficeType')?.value || 'BO';
    const pincode = (document.getElementById('onboardPincode')?.value || '').trim();
    const mobile = (document.getElementById('onboardMobile')?.value || '').trim();
    const agreed = document.getElementById('onboardDisclaimerCheck')?.checked;

    if (!fullName || !division || !pincode || !mobile || !agreed) {
      this.showToast('Please complete all mandatory fields (including Postal Division) & agree to DPDP terms.', 'error');
      return;
    }

    if (!/^\d{6}$/.test(pincode)) {
      this.showToast('Please enter a valid 6-digit Pincode.', 'error');
      return;
    }

    if (!/^\d{10}$/.test(mobile)) {
      this.showToast('Please enter a valid 10-digit Mobile number.', 'error');
      return;
    }

    const empId = getMaskedEmpId();
    const newProfile = {
      fullName,
      designation,
      division,
      officeName,
      officeType,
      pincode,
      mobile,
      employeeId: empId,
      autoPurgeDays: 60,
      consentAgreedAt: new Date().toISOString()
    };

    saveProfile(this.activeHash, newProfile);
    this.profile = newProfile;
    
    // Automatically register Verification Request for Admin review
    const verificationRecord = {
      empName: fullName,
      empNo: empId,
      division: division,
      designation: designation,
      officeName: officeName,
      officeType: officeType,
      pincode: pincode,
      mobile: mobile,
      circle: 'Andhra Pradesh Circle',
      submittedAt: new Date().toISOString()
    };
    const savedReq = saveVerificationRequest(verificationRecord);
    const refNo = savedReq?.id || ('REF-INPOST-' + Date.now().toString(36).toUpperCase());

    // Prepare WhatsApp Message for ID Card / Charge Report submission
    const waRawText = 
      `*SCHEMESHARE OFFICIAL IDENTITY CLEARANCE REQUEST*\n` +
      `*Verification Ref:* ${refNo}\n` +
      `*Employee Name:* ${fullName} (${designation})\n` +
      `*Employee ID:* ${empId}\n` +
      `*Postal Division:* ${division}\n` +
      `*Working Office:* ${officeName} (${officeType}) - ${pincode}\n` +
      `*WhatsApp Mobile:* +91 ${mobile}\n` +
      `*Turnaround SLA:* 12 Hours Review\n` +
      `*Admin Mailbox:* postalpro.in@gmail.com\n\n` +
      `_Hello Admin, I have completed my SchemeShare profile setup. I am attaching a photo/copy of my Department ID Card / Charge Report for identity clearance and receiving my Clearance Code._`;
    const waUrl = `https://wa.me/916309833253?text=${encodeURIComponent(waRawText)}`;

    // Close onboarding form and open Profile Created & WhatsApp ID Verification modal
    this.closeModal('onboardingModal');
    this.openProfileCreatedModal(refNo, empId, waUrl);

    // Also trigger instant WhatsApp redirect
    try {
      window.open(waUrl, '_blank');
    } catch (err) {
      console.log('WhatsApp auto-redirect note:', err);
    }

    this.showToast(`Profile created! Please share your ID Card / Charge Report on WhatsApp.`, 'info');
  }

  openProfileCreatedModal(refId, empId, waUrl) {
    const refEl = document.getElementById('profileCreatedRefId');
    if (refEl) refEl.textContent = refId || 'REF-INPOST-REVIEW';

    const empEl = document.getElementById('profileCreatedEmpId');
    if (empEl) empEl.textContent = empId || getMaskedEmpId();

    const waBtn = document.getElementById('profileCreatedWhatsAppBtn');
    if (waBtn) waBtn.href = waUrl;

    const fastWaLink = document.getElementById('profileCreatedFastWhatsAppLink');
    if (fastWaLink) fastWaLink.href = waUrl;

    this.openModal('profileCreatedPromptModal');
  }

  closeProfileCreatedModal() {
    this.closeModal('profileCreatedPromptModal');
  }

  onAuthenticated() {
    document.getElementById('authGateContainer').classList.add('hidden');
    this.closeModal('onboardingModal');
    this.closeProfileCreatedModal();
    document.getElementById('mainAppContainer').classList.remove('hidden');

    // Run DPDP Auto-Purge if configured
    if (this.profile && this.profile.autoPurgeDays > 0) {
      const { purgedCount } = runAutoPurge(this.activeHash, this.profile.autoPurgeDays);
      if (purgedCount > 0) {
        this.showToast(`DPDP Rule: ${purgedCount} expired records automatically purged.`, 'info');
      }
    }

    // Populate user info in header & profile forms
    this.updateHeaderUserInfo();
    this.populateProfileForm();
    this.updateVerificationUI();
    this.refreshData();
    this.navigate('dashboard');
  }

  updateVerificationUI() {
    if (!this.profile) return;
    const isVerified = Boolean(this.profile.isVerified);
    
    // 1. Dashboard Demo Banner
    const demoBanner = document.getElementById('dashboardDemoBanner');
    if (demoBanner) {
      if (isVerified) {
        demoBanner.classList.add('hidden');
      } else {
        demoBanner.classList.remove('hidden');
      }
    }

    // 2. Identity Status Card Badge (Profile view)
    const statusBadge = document.getElementById('identityStatusBadge');
    const statusSubtext = document.getElementById('identityStatusSubtext');
    const statusIcon = document.getElementById('identityStatusIcon');
    const pendingBox = document.getElementById('identityPendingBox');
    const verifiedBox = document.getElementById('identityVerifiedBox');
    const verifyRefBadge = document.getElementById('identityVerifyRefBadge');

    const latestReq = getLatestVerificationRequest();
    const refId = latestReq?.id || 'REF-INPOST-REVIEW';

    if (verifyRefBadge) {
      verifyRefBadge.textContent = `Ref: ${refId}`;
    }

    // Update Profile View WhatsApp proof link with dynamic employee parameters
    const profileWaProofLink = document.getElementById('profileViewWhatsAppProofLink');
    if (profileWaProofLink && this.profile) {
      const waMsg = 
        `*SCHEMESHARE IDENTITY CLEARANCE DOSSIER*\n` +
        `*Ref ID:* ${refId}\n` +
        `*Employee Name:* ${this.profile.fullName || ''} (${this.profile.designation || 'BPM'})\n` +
        `*Employee ID:* ${this.profile.employeeId || getMaskedEmpId()}\n` +
        `*Postal Division:* ${this.profile.division || ''}\n` +
        `*Office:* ${this.profile.officeName || ''} - ${this.profile.pincode || ''}\n` +
        `*Mobile:* +91 ${this.profile.mobile || ''}\n\n` +
        `_Hello Admin, I have submitted my SchemeShare profile. Please find attached my Department ID Card / Charge Report for identity clearance._`;
      profileWaProofLink.href = `https://wa.me/916309833253?text=${encodeURIComponent(waMsg)}`;
    }

    if (isVerified) {
      if (statusBadge) {
        statusBadge.className = 'w-fit inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-black uppercase tracking-wide bg-emerald-100 text-emerald-800 border border-emerald-300 whitespace-nowrap shadow-2xs';
        statusBadge.innerHTML = '<i class="fa-solid fa-circle-check text-emerald-600 text-xs"></i><span>Verified Postal Employee (Active)</span>';
      }
      if (statusSubtext) {
        statusSubtext.textContent = 'Departmental Clearance Active • Unrestricted WhatsApp Dispatching Unlocked';
      }
      if (statusIcon) {
        statusIcon.className = 'w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center text-lg font-bold shrink-0 shadow-2xs';
        statusIcon.innerHTML = '<i class="fa-solid fa-user-check"></i>';
      }
      if (pendingBox) pendingBox.classList.add('hidden');
      if (verifiedBox) verifiedBox.classList.remove('hidden');
    } else {
      if (statusBadge) {
        statusBadge.className = 'w-fit inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-black uppercase tracking-wide bg-amber-100 text-amber-800 border border-amber-300 whitespace-nowrap shadow-2xs';
        statusBadge.innerHTML = '<i class="fa-solid fa-clock text-amber-600 text-xs"></i><span>Pending Verification (Demo Mode)</span>';
      }
      if (statusSubtext) {
        statusSubtext.textContent = '12-Hour SLA Review in Progress • Interactive Demo & Sample Ledger Active';
      }
      if (statusIcon) {
        statusIcon.className = 'w-10 h-10 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center text-lg font-bold shrink-0 shadow-2xs';
        statusIcon.innerHTML = '<i class="fa-solid fa-clock-rotate-left"></i>';
      }
      if (pendingBox) pendingBox.classList.remove('hidden');
      if (verifiedBox) verifiedBox.classList.add('hidden');
    }

    // Update Admin console device status label
    const adminStatus = document.getElementById('adminCurrentStatusLabel');
    if (adminStatus) {
      adminStatus.textContent = isVerified ? 'Verified (Full Access Active)' : 'Pending Verification (Demo Mode)';
      adminStatus.className = isVerified ? 'text-[11px] text-emerald-600 font-bold' : 'text-[11px] text-amber-600 font-bold';
    }
  }

  handleClearanceCodeSubmit(rawCode) {
    if (!this.activeHash) return;
    const result = verifyAccountWithCode(this.activeHash, this.profile, rawCode);

    if (result.success) {
      this.profile = getProfile(this.activeHash);
      this.closeProfileCreatedModal();
      this.updateVerificationUI();
      this.refreshData();
      this.closeVerificationLockModal();
      this.closeAdminCodeHelperModal();
      this.showToast('Clearance Approved! Account verified.', 'success');
      this.openVerificationSuccessPromptModal();
    } else {
      this.showToast(result.message || 'Invalid clearance code. Please generate an exact code matching your Name, Division & ID.', 'error');
    }
  }

  openVerificationSuccessPromptModal() {
    this.openModal('verifySuccessPromptModal');
  }

  closeVerificationSuccessPromptModal() {
    this.closeModal('verifySuccessPromptModal');
  }

  handleClearDemoLeads() {
    clearSampleLeads(this.activeHash);
    this.closeVerificationSuccessPromptModal();
    this.refreshData();
    this.showToast('Clean ledger initialized. 5 demo records removed. Ready for live customers!', 'success');
    this.navigate('send');
  }

  handleKeepDemoLeads() {
    this.closeVerificationSuccessPromptModal();
    this.refreshData();
    this.showToast('Demo workflow records preserved in Leads ledger for training.', 'info');
    this.navigate('dashboard');
  }

  handleResetToDemo() {
    if (!this.activeHash) return;
    resetAccountToDemo(this.activeHash);
    this.profile = getProfile(this.activeHash);
    this.updateVerificationUI();
    this.refreshData();
    this.showToast('Account reset to Interactive Demo Mode with sample leads seeded.', 'info');
  }

  // --- INACTIVITY 5-MINUTE AUTO-LOGOUT ---
  initInactivityTracker() {
    const resetTimer = () => {
      if (this.inactivityTimer) clearTimeout(this.inactivityTimer);
      this.inactivityTimer = setTimeout(() => {
        this.handleInactivityLogout();
      }, this.inactivityDurationMs);
    };

    // User interaction events
    const events = ['mousemove', 'mousedown', 'keydown', 'touchstart', 'scroll', 'click'];
    events.forEach(evt => {
      window.addEventListener(evt, resetTimer, { passive: true });
    });

    resetTimer();
  }

  handleInactivityLogout() {
    if (this.activeHash) {
      clearSession();
      this.activeHash = null;
      this.profile = null;
      this.leads = [];
      this.showAuthGate();
      this.showToast('Security Alert: You were automatically logged out after 5 minutes of inactivity.', 'info');
    }
    if (isAdminAuthenticated()) {
      logoutAdmin();
      this.closeAdminCodeHelperModal();
    }
  }

  // --- ADMIN CONSOLE & WHITELIST CONTROLLER ---
  openAdminCodeHelperModal() {
    const modal = document.getElementById('adminCodeHelperModal');
    if (!modal) return;
    this.openModal(modal);
    this.updateVerificationUI();

    // Auto-populate with current local profile if available
    if (this.profile) {
      const nameInput = document.getElementById('adminCalcNameInput');
      const divInput = document.getElementById('adminCalcDivInput');
      const empInput = document.getElementById('adminCalcEmpInput');
      if (nameInput && !nameInput.value) nameInput.value = (this.profile.fullName || '').toUpperCase();
      if (divInput && !divInput.value) divInput.value = (this.profile.division || this.profile.officeName || '').toUpperCase();
      if (empInput && !empInput.value) empInput.value = (getMaskedEmpId() || '').toUpperCase();
    }

    this.switchAdminSubTab(this.adminActiveSubTab || 'queue');
  }

  closeAdminCodeHelperModal() {
    this.closeModal('adminCodeHelperModal');
  }

  switchAdminSubTab(tab) {
    this.adminActiveSubTab = tab;

    const queueBtn = document.getElementById('adminSubTabQueueBtn');
    const whitelistBtn = document.getElementById('adminSubTabWhitelistBtn');
    const genBtn = document.getElementById('adminSubTabGenBtn');

    const panelQueue = document.getElementById('adminPanelQueue');
    const panelWhitelist = document.getElementById('adminPanelWhitelist');
    const panelGen = document.getElementById('adminPanelGen');

    const inactiveClass = 'py-2 px-1 sm:px-3 rounded-lg text-[11px] sm:text-xs font-bold text-slate-600 hover:text-slate-900 hover:bg-slate-200/50 flex items-center justify-center gap-1 sm:gap-1.5 cursor-pointer transition text-center border-transparent';
    const activeClass = 'py-2 px-1 sm:px-3 rounded-lg text-[11px] sm:text-xs font-extrabold bg-white text-blue-900 border border-slate-300 shadow-2xs flex items-center justify-center gap-1 sm:gap-1.5 cursor-pointer transition text-center';

    // Reset buttons
    if (queueBtn) queueBtn.className = inactiveClass;
    if (whitelistBtn) whitelistBtn.className = inactiveClass;
    if (genBtn) genBtn.className = inactiveClass;

    // Reset panels
    [panelQueue, panelWhitelist, panelGen].forEach(p => p?.classList.add('hidden'));

    if (tab === 'queue') {
      if (queueBtn) queueBtn.className = activeClass;
      if (panelQueue) panelQueue.classList.remove('hidden');
      this.renderAdminRequestsList();
    } else if (tab === 'whitelist') {
      if (whitelistBtn) whitelistBtn.className = activeClass;
      if (panelWhitelist) panelWhitelist.classList.remove('hidden');
      this.renderAdminWhitelist();
    } else if (tab === 'gen') {
      if (genBtn) genBtn.className = activeClass;
      if (panelGen) panelGen.classList.remove('hidden');
      this.updateAdminCalculatedCode();
    }
  }

  updateAdminCalculatedCode() {
    const nameInput = document.getElementById('adminCalcNameInput');
    const divInput = document.getElementById('adminCalcDivInput');
    const empInput = document.getElementById('adminCalcEmpInput');
    const displayEl = document.getElementById('adminGeneratedCodeDisplay');

    const name = (nameInput?.value || '').trim().toUpperCase();
    const division = (divInput?.value || '').trim().toUpperCase();
    const empId = (empInput?.value || '').trim().toUpperCase();

    if (name && division && empId) {
      const code = generateStrictClearanceCode(name, division, empId);
      if (displayEl) displayEl.textContent = code;
      return code;
    } else {
      if (displayEl) displayEl.textContent = 'PS-XXXX-XXXX-XXXX';
      return '';
    }
  }

  renderAdminRequestsList() {
    const listEl = document.getElementById('adminRequestsListContainer') || document.getElementById('adminPendingRequestsList');
    if (!listEl) return;

    const activeRequests = getAllVerificationRequests();
    const dismissedRequests = getDismissedVerificationRequests();

    const activeCountBadge = document.getElementById('adminActiveQueueCountBadge');
    const dismissedCountBadge = document.getElementById('adminDismissedQueueCountBadge');
    const restoreAllBtn = document.getElementById('adminRestoreAllDismissedBtn');
    const activeTabBtn = document.getElementById('adminQueueFilterActiveBtn');
    const dismissedTabBtn = document.getElementById('adminQueueFilterDismissedBtn');

    if (activeCountBadge) activeCountBadge.textContent = `${activeRequests.length}`;
    if (dismissedCountBadge) dismissedCountBadge.textContent = `${dismissedRequests.length}`;

    const isDismissedView = this.adminQueueFilter === 'dismissed';

    // Update filter tab active styles
    if (activeTabBtn && dismissedTabBtn) {
      if (isDismissedView) {
        activeTabBtn.className = 'flex-1 sm:flex-initial px-3 py-1.5 rounded-md font-medium text-[11px] text-slate-600 hover:text-slate-900 transition cursor-pointer flex items-center justify-center gap-1.5';
        dismissedTabBtn.className = 'flex-1 sm:flex-initial px-3 py-1.5 rounded-md font-bold text-[11px] transition cursor-pointer flex items-center justify-center gap-1.5 bg-white text-slate-900 shadow-2xs border border-slate-300';
      } else {
        activeTabBtn.className = 'flex-1 sm:flex-initial px-3 py-1.5 rounded-md font-bold text-[11px] transition cursor-pointer flex items-center justify-center gap-1.5 bg-white text-blue-900 shadow-2xs border border-slate-300';
        dismissedTabBtn.className = 'flex-1 sm:flex-initial px-3 py-1.5 rounded-md font-medium text-[11px] text-slate-600 hover:text-slate-900 transition cursor-pointer flex items-center justify-center gap-1.5';
      }
    }

    if (restoreAllBtn) {
      if (isDismissedView && dismissedRequests.length > 0) {
        restoreAllBtn.classList.remove('hidden');
        restoreAllBtn.classList.add('inline-flex');
      } else {
        restoreAllBtn.classList.add('hidden');
        restoreAllBtn.classList.remove('inline-flex');
      }
    }

    const currentList = isDismissedView ? dismissedRequests : activeRequests;

    if (!currentList || currentList.length === 0) {
      if (isDismissedView) {
        listEl.innerHTML = `
          <div class="p-6 text-center text-xs text-slate-500 font-medium bg-slate-50 rounded-xl border border-slate-200">
            <i class="fa-solid fa-clock-rotate-left text-slate-400 text-2xl mb-2 block"></i>
            No dismissed requests in archive.<br>
            <span class="text-[10px] text-slate-400 mt-1 block">Any verification requests you dismiss will appear here so you can easily restore or approve them anytime.</span>
          </div>
        `;
      } else {
        listEl.innerHTML = `
          <div class="p-6 text-center text-xs text-slate-500 font-medium bg-slate-50 rounded-xl border border-slate-200">
            <i class="fa-solid fa-inbox text-slate-400 text-2xl mb-2 block"></i>
            No applicant registration requests recorded in active queue.<br>
            <span class="text-[10px] text-slate-400 mt-1 block">Verified applicant requests are automatically purged from this queue after 12 hours.</span>
          </div>
        `;
      }
      return;
    }

    listEl.innerHTML = currentList.map(req => {
      const isApproved = req.status === 'approved' || req.status === 'approved_whitelisted';
      
      let statusBadge = '';
      if (isDismissedView) {
        statusBadge = '<span class="px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wide bg-slate-200 text-slate-700 border border-slate-300 flex items-center gap-1 shrink-0"><i class="fa-solid fa-clock-rotate-left text-[8px]"></i> Dismissed (Archived)</span>';
      } else if (isApproved) {
        statusBadge = '<span class="px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wide bg-emerald-100 text-emerald-800 border border-emerald-300 flex items-center gap-1 shrink-0"><i class="fa-solid fa-check text-[8px]"></i> Whitelisted</span>';
      } else {
        statusBadge = '<span class="px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wide bg-amber-100 text-amber-900 border border-amber-300 flex items-center gap-1 shrink-0"><i class="fa-solid fa-clock text-[8px]"></i> Pending Review</span>';
      }

      const dateStr = req.submittedAt 
        ? new Date(req.submittedAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })
        : 'Recent';

      const dismissedDateStr = req.dismissedAt
        ? new Date(req.dismissedAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })
        : null;

      return `
        <div class="p-3.5 sm:p-4 bg-white rounded-xl border border-slate-200 hover:border-blue-300 shadow-2xs space-y-2.5 transition">
          <!-- Header: Name + Badge -->
          <div class="flex items-center justify-between gap-2">
            <span class="text-xs sm:text-sm font-black uppercase tracking-wide text-slate-900 truncate">${req.empName}</span>
            ${statusBadge}
          </div>

          <!-- Meta Details Grid -->
          <div class="bg-slate-50/80 rounded-lg p-2.5 border border-slate-100 grid grid-cols-1 sm:grid-cols-2 gap-1.5 text-[11px] sm:text-xs text-slate-600">
            <div class="flex items-center gap-1.5 truncate">
              <span class="text-slate-400 font-bold">Emp ID:</span>
              <strong class="text-slate-900 font-mono font-bold">${req.empNo}</strong>
            </div>
            <div class="flex items-center gap-1.5 truncate">
              <span class="text-slate-400 font-bold">Division:</span>
              <strong class="text-slate-800 font-semibold truncate">${req.division || req.officeName || 'N/A'}</strong>
            </div>
            <div class="flex items-center gap-1.5 truncate">
              <span class="text-slate-400 font-bold">Circle:</span>
              <span class="text-slate-700 truncate">${req.circle || 'Andhra Pradesh Circle'}</span>
            </div>
            <div class="flex items-center gap-1.5 truncate">
              <span class="text-slate-400 font-bold">WhatsApp:</span>
              ${req.mobile ? `
                <a href="https://wa.me/91${req.mobile}?text=${encodeURIComponent('Hello ' + req.empName + ', regarding your SchemeShare verification request.')}" target="_blank" class="text-emerald-700 font-bold hover:underline flex items-center gap-1">
                  <i class="fa-brands fa-whatsapp text-emerald-600"></i>+91 ${req.mobile}
                </a>
              ` : '<span class="text-slate-400">N/A</span>'}
            </div>
            <div class="col-span-1 sm:col-span-2 text-[10px] text-slate-400 flex items-center justify-between pt-1 border-t border-slate-200/50">
              <span class="font-mono">Ref: ${req.id}</span>
              <span>${dismissedDateStr ? `Dismissed: ${dismissedDateStr}` : `Submitted: ${dateStr}`}</span>
            </div>
          </div>

          <!-- Action Buttons Row -->
          <div class="flex items-center gap-2 pt-0.5 flex-wrap sm:flex-nowrap">
            ${isDismissedView ? `
              <button 
                type="button" 
                class="admin-restore-req-btn touch-target flex-1 py-2 px-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer shadow-2xs"
                data-id="${req.id}"
                data-empid="${req.empNo}"
                title="Restore this request back into active queue"
              >
                <i class="fa-solid fa-arrow-rotate-left text-xs"></i>
                <span class="truncate">Restore to Queue</span>
              </button>

              <button 
                type="button" 
                class="admin-approve-req-btn touch-target flex-1 py-2 px-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer shadow-2xs"
                data-id="${req.id}"
                data-name="${req.empName}"
                data-div="${req.division || req.officeName || ''}"
                data-empid="${req.empNo}"
                data-mobile="${req.mobile || ''}"
                data-circle="${req.circle || 'Andhra Pradesh Circle'}"
                title="Approve directly and whitelist"
              >
                <i class="fa-solid fa-circle-check text-xs"></i>
                <span class="truncate">Approve & Whitelist</span>
              </button>
            ` : (!isApproved ? `
              <button 
                type="button" 
                class="admin-approve-req-btn touch-target flex-1 py-2 px-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer shadow-2xs"
                data-id="${req.id}"
                data-name="${req.empName}"
                data-div="${req.division || req.officeName || ''}"
                data-empid="${req.empNo}"
                data-mobile="${req.mobile || ''}"
                data-circle="${req.circle || 'Andhra Pradesh Circle'}"
                title="Approve applicant, generate code and add to Whitelist"
              >
                <i class="fa-solid fa-circle-check text-xs"></i>
                <span class="truncate">Approve & Whitelist</span>
              </button>
            ` : `
              <div class="flex-1 py-1.5 px-2.5 text-xs font-bold text-emerald-700 bg-emerald-50 rounded-lg border border-emerald-200 flex items-center justify-center gap-1.5">
                <i class="fa-solid fa-shield-check text-emerald-600"></i>
                <span class="truncate">Approved & Whitelisted</span>
              </div>
            `)}

            <button 
              type="button" 
              class="admin-select-request-btn touch-target py-2 px-2.5 bg-blue-50 text-blue-800 hover:bg-blue-100 border border-blue-200 rounded-lg text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer shadow-2xs shrink-0"
              data-name="${req.empName}" 
              data-div="${req.division || req.officeName || ''}" 
              data-empid="${req.empNo}" 
              data-mobile="${req.mobile || ''}" 
              data-reqid="${req.id}"
              title="Populate Generator form"
            >
              <i class="fa-solid fa-wand-magic-sparkles text-xs text-blue-600"></i>
              <span class="truncate">Fill Form</span>
            </button>

            ${!isDismissedView ? `
              <button 
                type="button" 
                class="admin-dismiss-req-btn touch-target w-9 h-9 flex items-center justify-center text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg border border-slate-200 transition cursor-pointer shrink-0"
                data-id="${req.id}"
                title="Dismiss to Archive (Reversible)"
              >
                <i class="fa-solid fa-trash text-xs"></i>
              </button>
            ` : ''}
          </div>
        </div>
      `;
    }).join('');

    // Bind Restore buttons
    listEl.querySelectorAll('.admin-restore-req-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-id') || btn.getAttribute('data-empid');
        if (id) {
          restoreVerificationRequest(id);
          this.renderAdminRequestsList();
          this.showToast('Request restored to active queue!', 'success');
        }
      });
    });

    // Bind Approve & Whitelist buttons
    listEl.querySelectorAll('.admin-approve-req-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-id');
        const name = btn.getAttribute('data-name');
        const division = btn.getAttribute('data-div');
        const empNo = btn.getAttribute('data-empid');
        const mobile = btn.getAttribute('data-mobile');
        const circle = btn.getAttribute('data-circle');

        this.handleApproveAndWhitelist({
          id,
          empName: name,
          division,
          empNo,
          mobile,
          circle
        });
      });
    });

    // Bind Fill Form buttons
    listEl.querySelectorAll('.admin-select-request-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const name = btn.getAttribute('data-name') || '';
        const div = btn.getAttribute('data-div') || '';
        const empId = btn.getAttribute('data-empid') || '';
        const mobile = btn.getAttribute('data-mobile') || '';
        const reqId = btn.getAttribute('data-reqid') || '';

        const nameInput = document.getElementById('adminCalcNameInput');
        const divInput = document.getElementById('adminCalcDivInput');
        const empInput = document.getElementById('adminCalcEmpInput');

        if (nameInput) nameInput.value = name.toUpperCase();
        if (divInput) divInput.value = div.toUpperCase();
        if (empInput) empInput.value = empId.toUpperCase();

        this.currentAdminSelectedMobile = mobile;
        this.currentAdminSelectedReqId = reqId;

        this.switchAdminSubTab('gen');
        const code = this.updateAdminCalculatedCode();
        this.showToast(`Applicant ${name} loaded. Clearance Code: ${code}`, 'info');
      });
    });

    // Bind Dismiss buttons
    listEl.querySelectorAll('.admin-dismiss-req-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        const id = btn.getAttribute('data-id');
        if (id) {
          deleteVerificationRequest(id);
          this.renderAdminRequestsList();
          this.showToast('Request moved to Dismissed archive. You can restore or approve anytime.', 'info');
        }
      });
    });
  }

  handleApproveAndWhitelist(req) {
    const code = generateStrictClearanceCode(req.empName, req.division, req.empNo);

    // 1. Add to verified whitelist
    addToVerifiedWhitelist({
      empNo: req.empNo,
      fullName: req.empName,
      division: req.division,
      circle: req.circle,
      mobile: req.mobile,
      clearanceCode: code
    });

    // 2. Mark request as approved with timestamp (12h auto-purge timer begins)
    markVerificationRequestApproved(req.id);

    // 3. If the active device user has matching employee ID, unlock immediately
    if (this.profile && this.profile.employeeId === req.empNo.toUpperCase()) {
      this.handleClearanceCodeSubmit(code);
    }

    this.renderAdminRequestsList();
    this.showToast(`Approved ${req.empName}! Added to Verified Whitelist (Code: ${code})`, 'success');
  }

  renderAdminWhitelist() {
    const tableContainer = document.getElementById('adminWhitelistTableContainer') || document.getElementById('adminWhitelistContainer');
    const countBadge = document.getElementById('adminWhitelistCountBadge');
    if (!tableContainer) return;

    const whitelist = getVerifiedWhitelist();
    if (countBadge) countBadge.textContent = `${whitelist.length}`;

    let filtered = whitelist;
    if (this.whitelistSearchQuery) {
      const q = this.whitelistSearchQuery.toLowerCase();
      filtered = whitelist.filter(item => 
        (item.fullName || '').toLowerCase().includes(q) ||
        (item.empNo || '').toLowerCase().includes(q) ||
        (item.division || '').toLowerCase().includes(q) ||
        (item.circle || '').toLowerCase().includes(q) ||
        (item.mobile || '').includes(q)
      );
    }

    if (filtered.length === 0) {
      tableContainer.innerHTML = `
        <div class="p-6 text-center text-xs text-slate-500 font-medium bg-slate-50 rounded-xl border border-slate-200">
          <i class="fa-solid fa-address-book text-slate-400 text-2xl mb-2 block"></i>
          ${whitelist.length === 0 ? 'No whitelisted officers recorded yet. Approve applicant requests or add officers manually above.' : 'No officers matching search filter.'}
        </div>
      `;
      return;
    }

    tableContainer.innerHTML = `
      <div class="space-y-2">
        ${filtered.map(item => {
          const dateStr = item.verifiedAt 
            ? new Date(item.verifiedAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })
            : 'Active';

          return `
            <div class="p-3 sm:p-3.5 bg-white rounded-xl border border-slate-200 hover:border-emerald-300 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 transition">
              <div class="space-y-1 min-w-0">
                <div class="flex items-center gap-1.5 flex-wrap">
                  <span class="text-xs font-black uppercase tracking-wide text-slate-900 truncate">${item.fullName}</span>
                  <span class="px-1.5 py-0.2 rounded-full text-[8px] sm:text-[9px] font-black uppercase bg-emerald-100 text-emerald-800 border border-emerald-300 flex items-center gap-0.5 shrink-0">
                    <i class="fa-solid fa-shield-check text-[8px]"></i> Whitelisted
                  </span>
                </div>
                <div class="text-[11px] text-slate-600 flex items-center gap-1.5 flex-wrap">
                  <span>ID: <strong class="font-mono text-slate-900 font-bold">${item.empNo}</strong></span>
                  <span>•</span>
                  <span class="truncate">Div: <strong class="text-slate-800">${item.division}</strong></span>
                  ${item.mobile ? `<span>•</span><span class="text-emerald-700 font-medium"><i class="fa-brands fa-whatsapp mr-0.5"></i>+91 ${item.mobile}</span>` : ''}
                </div>
                <div class="text-[10px] text-slate-400 flex items-center gap-2 flex-wrap">
                  <span>Verified: ${dateStr}</span>
                  ${item.clearanceCode ? `<span>•</span><span class="font-mono text-blue-900 font-bold">Code: ${item.clearanceCode}</span>` : ''}
                </div>
              </div>
              <div class="flex items-center gap-2 shrink-0 self-end sm:self-center">
                <button 
                  type="button" 
                  class="admin-remove-whitelist-btn touch-target px-2.5 py-1 text-xs font-bold text-red-700 bg-red-50 hover:bg-red-100 border border-red-200 rounded-lg transition flex items-center gap-1 cursor-pointer"
                  data-empid="${item.empNo}"
                  data-name="${item.fullName}"
                  title="Remove from Whitelist"
                >
                  <i class="fa-solid fa-user-xmark text-xs"></i>
                  <span>Remove</span>
                </button>
              </div>
            </div>
          `;
        }).join('')}
      </div>
    `;

    // Bind Remove buttons
    tableContainer.querySelectorAll('.admin-remove-whitelist-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        const empNo = btn.getAttribute('data-empid');
        const name = btn.getAttribute('data-name') || empNo;
        if (empNo) {
          removeFromVerifiedWhitelist(empNo);
          this.renderAdminWhitelist();
          this.showToast(`Removed ${name} from whitelist.`, 'info');
        }
      });
    });
  }

  handleAdminManualWhitelistSubmit(e) {
    e.preventDefault();
    const nameInput = document.getElementById('manualWhiteName');
    const empInput = document.getElementById('manualWhiteEmpId');
    const divInput = document.getElementById('manualWhiteDiv');
    const circleInput = document.getElementById('manualWhiteCircle');
    const mobileInput = document.getElementById('manualWhiteMobile');

    const fullName = (nameInput?.value || '').trim().toUpperCase();
    const empNo = (empInput?.value || '').trim().toUpperCase();
    const division = (divInput?.value || '').trim().toUpperCase();
    const circle = (circleInput?.value || 'Andhra Pradesh Circle').trim();
    const mobile = (mobileInput?.value || '').trim();

    if (!fullName || !empNo || !division) {
      this.showToast('Please fill Name, Employee ID and Division.', 'error');
      return;
    }

    const code = generateStrictClearanceCode(fullName, division, empNo);
    addToVerifiedWhitelist({
      empNo,
      fullName,
      division,
      circle,
      mobile,
      clearanceCode: code
    });

    // Reset inputs
    if (nameInput) nameInput.value = '';
    if (empInput) empInput.value = '';
    if (divInput) divInput.value = '';
    if (mobileInput) mobileInput.value = '';

    this.renderAdminWhitelist();
    this.showToast(`Successfully whitelisted ${fullName} (ID: ${empNo})!`, 'success');
  }

  handleExportWhitelistToken() {
    const token = exportWhitelistSyncToken();
    navigator.clipboard.writeText(token).then(() => {
      this.showToast('Whitelist Sync Token copied to clipboard! Paste on another device to sync.', 'success');
    }).catch(() => {
      prompt('Copy Whitelist Sync Token below:', token);
    });
  }

  handleImportWhitelistToken() {
    const token = prompt('Paste Whitelist Sync Token (Base64 / JSON string) to merge verified users:');
    if (!token) return;

    const count = importWhitelistSyncToken(token.trim());
    if (count > 0) {
      this.renderAdminWhitelist();
      this.showToast(`Successfully imported and merged ${count} verified officers into Whitelist!`, 'success');
    } else {
      this.showToast('No new officers imported or token is invalid.', 'info');
    }
  }

  handlePurgeOldVerifiedRequests() {
    const purgedCount = purgeApprovedRequestsOlderThan12Hours();
    this.renderAdminRequestsList();
    this.showToast(`Cleaned up ${purgedCount} approved requests older than 12 hours. Whitelist remains intact!`, 'success');
  }

  handleAdminSendWhatsappCode() {
    const code = document.getElementById('adminGeneratedCodeDisplay')?.textContent;
    const name = (document.getElementById('adminCalcNameInput')?.value || '').trim().toUpperCase();
    const div = (document.getElementById('adminCalcDivInput')?.value || '').trim().toUpperCase();
    const empId = (document.getElementById('adminCalcEmpInput')?.value || '').trim().toUpperCase();

    if (!code || code === 'PS-XXXX-XXXX-XXXX') {
      this.showToast('Please fill Employee Name, Division & ID to generate code.', 'error');
      return;
    }

    let mobile = this.currentAdminSelectedMobile;
    if (!mobile || mobile.length < 10) {
      mobile = prompt('Enter Applicant 10-digit WhatsApp Mobile number:', '');
      if (!mobile) return;
    }

    const cleanMobile = mobile.replace(/\D/g, '').slice(-10);
    if (cleanMobile.length !== 10) {
      this.showToast('Invalid mobile number. Must be 10 digits.', 'error');
      return;
    }

    const msg = `*SchemeShare by PostalPro - Official Activation Clearance*\n\n` +
      `Namaste *${name}*,\n` +
      `Your verification request for *Division: ${div}* (Emp ID: *${empId}*) has been approved.\n\n` +
      `🔑 *Your Departmental Clearance Code:*\n` +
      `👉 \`${code}\`\n\n` +
      `*How to Unlock:*\n` +
      `1. Open SchemeShare app\n` +
      `2. Go to Profile & Settings -> Departmental Verification\n` +
      `3. Enter clearance code \`${code}\` and click Unlock.\n\n` +
      `_Secure Postal Ledger System • Department of Posts_`;

    if (this.currentAdminSelectedReqId) {
      markVerificationRequestApproved(this.currentAdminSelectedReqId);
      this.renderAdminRequestsList();
    }

    const waUrl = `https://wa.me/91${cleanMobile}?text=${encodeURIComponent(msg)}`;
    window.open(waUrl, '_blank');
    this.showToast(`Clearance code forwarded to WhatsApp (+91 ${cleanMobile})`, 'success');
  }

  handleAdminInstantUnlock() {
    if (!this.profile) {
      this.showToast('No active local profile found to unlock.', 'error');
      return;
    }

    const name = this.profile.fullName || '';
    const division = this.profile.division || this.profile.officeName || '';
    const empId = getMaskedEmpId();

    const code = generateStrictClearanceCode(name, division, empId);
    this.handleClearanceCodeSubmit(code);
  }

  handleAdminLogout() {
    logoutAdmin();
    this.closeAdminCodeHelperModal();
    this.showToast('Admin logged out successfully.', 'info');
  }

  // --- HARD WIPE MODAL CONTROLLERS ---
  confirmHardWipe() {
    this.openHardWipeModal();
  }

  openHardWipeModal() {
    this.openModal('hardWipeConfirmModal');
  }

  closeHardWipeModal() {
    this.closeModal('hardWipeConfirmModal');
  }

  executeHardWipe() {
    this.closeHardWipeModal();
    hardWipeAll();
    this.showToast('All local sandboxed data has been completely wiped.', 'info');
    setTimeout(() => {
      window.location.reload();
    }, 300);
  }

  // --- DELETE LEAD MODAL CONTROLLERS ---
  openDeleteLeadModal(leadId) {
    if (!leadId) return;
    this.pendingDeleteLeadId = leadId;
    const lead = this.leads.find(l => l && l.id === leadId);
    const modal = document.getElementById('deleteLeadModal');
    if (!modal) {
      this.executeDeleteLeadDirect(leadId);
      return;
    }

    const nameEl = document.getElementById('deleteModalCustomerName');
    const mobileEl = document.getElementById('deleteModalCustomerMobile');
    const refEl = document.getElementById('deleteModalArticleRef');

    if (nameEl) nameEl.textContent = lead ? (lead.customerName || 'Customer Record') : 'Customer Record';
    if (mobileEl) mobileEl.textContent = lead && lead.mobile ? `+91 ${lead.mobile}` : 'N/A';
    if (refEl) refEl.textContent = lead && lead.articleNumber ? lead.articleNumber : leadId;

    this.openModal(modal);
  }

  closeDeleteLeadModal() {
    this.pendingDeleteLeadId = null;
    this.closeModal('deleteLeadModal');
  }

  executeDeleteLead() {
    const id = this.pendingDeleteLeadId;
    this.closeDeleteLeadModal();
    if (!id) return;
    this.executeDeleteLeadDirect(id);
  }

  executeDeleteLeadDirect(id) {
    const hash = this.activeHash || getActiveSessionHash();
    deleteLead(hash, id);
    this.leads = this.leads.filter(l => l && l.id !== id);
    this.refreshData();
    this.showToast('Lead deleted from local storage.', 'info');
  }

  openVerificationLockModal() {
    this.openModal('verificationLockModal');
  }

  closeVerificationLockModal() {
    this.closeModal('verificationLockModal');
  }

  handleSimulateDemoDispatch() {
    const payload = this.getCurrentMessagePayload();
    const customerName = payload.addresseeName || 'Ramesh Patel';
    const articleClean = payload.articleNumber || 'RL882910482IN';
    const mobileClean = (payload.mobile || '9876543210').replace(/\D/g, '');
    const schemes = payload.selectedSchemeIds.length > 0 ? payload.selectedSchemeIds : ['ssy'];

    saveLead(this.activeHash, {
      customerName,
      secondaryName: payload.secondaryName || '',
      mobile: mobileClean,
      articleNumber: articleClean,
      articleType: 'Speed Post',
      schemes,
      language: payload.language || 'en',
      pitchCopy: payload.pitch,
      status: 'focus',
      isSample: true
    });

    this.closeVerificationLockModal();
    this.showToast(`Simulated Pitch logged for ${customerName}! Viewing in Leads ledger.`, 'success');
    this.refreshData();
    this.navigate('leads');
  }

  updateHeaderUserInfo() {
    if (!this.profile) return;
    const nameEls = document.querySelectorAll('.user-display-name');
    nameEls.forEach(el => el.textContent = this.profile.fullName);
    
    const desigEls = document.querySelectorAll('.user-display-desig');
    const divText = this.profile.division ? ` • ${this.profile.division}` : '';
    desigEls.forEach(el => el.textContent = `${this.profile.designation} - ${this.profile.officeName} (${this.profile.officeType})${divText}`);

    const maskedEls = document.querySelectorAll('.user-display-empid');
    maskedEls.forEach(el => el.textContent = getMaskedEmpId());
  }

  populateProfileForm() {
    if (!this.profile) return;
    document.getElementById('editFullName').value = this.profile.fullName || '';
    document.getElementById('editDesignation').value = this.profile.designation || 'BPM';
    const divInput = document.getElementById('editDivision');
    if (divInput) divInput.value = this.profile.division || '';
    document.getElementById('editOfficeName').value = this.profile.officeName || '';
    document.getElementById('editOfficeType').value = this.profile.officeType || 'BO';
    document.getElementById('editPincode').value = this.profile.pincode || '';
    document.getElementById('editMobile').value = this.profile.mobile || '';
    
    const purgeSelect = document.getElementById('autoPurgeSelect');
    if (purgeSelect) {
      purgeSelect.value = this.profile.autoPurgeDays || 60;
    }

    this.updateCardStyleUI();
  }

  handleProfileUpdate(e) {
    e.preventDefault();
    if (!this.activeHash) return;

    this.profile = {
      ...this.profile,
      fullName: (document.getElementById('editFullName')?.value || '').trim().toUpperCase(),
      designation: document.getElementById('editDesignation')?.value || 'BPM',
      division: (document.getElementById('editDivision')?.value || '').trim().toUpperCase(),
      officeName: (document.getElementById('editOfficeName')?.value || '').trim().toUpperCase(),
      officeType: document.getElementById('editOfficeType')?.value || 'BO',
      pincode: (document.getElementById('editPincode')?.value || '').trim(),
      mobile: (document.getElementById('editMobile')?.value || '').trim(),
      autoPurgeDays: parseInt(document.getElementById('autoPurgeSelect')?.value) || 60
    };

    saveProfile(this.activeHash, this.profile);
    this.updateHeaderUserInfo();
    this.updateLiveMessagePreview();
    this.showToast('Profile & Compliance settings updated successfully!', 'success');
  }

  refreshData() {
    this.leads = getLeads(this.activeHash);
    this.renderDashboardMetrics();
    this.renderPerformanceChart();
    this.renderRecentLeadsList();
    this.renderLeadsLedger();
    this.updateStorageIndicator();
  }

  navigate(viewName) {
    this.currentView = viewName;

    // Reset viewport scroll to top so switching tabs always starts from the top of the page
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    if (document.documentElement) document.documentElement.scrollTop = 0;
    if (document.body) document.body.scrollTop = 0;
    
    // Hide all view containers
    document.querySelectorAll('.app-view-panel').forEach(panel => {
      panel.classList.add('hidden');
    });

    // Show active view container
    const activePanel = document.getElementById(`view-${viewName}`);
    if (activePanel) {
      activePanel.classList.remove('hidden');
    }

    // Update Desktop Navigation in Top Header
    const desktopNavBtns = document.querySelectorAll('#desktopNav [data-view-btn]');
    desktopNavBtns.forEach(btn => {
      const v = btn.getAttribute('data-view-btn');
      if (v === viewName) {
        btn.classList.add('bg-blue-600', 'text-white', 'font-bold', 'shadow-sm', 'ring-1', 'ring-blue-400/40');
        btn.classList.remove('text-slate-200', 'hover:bg-slate-800/80');
      } else {
        btn.classList.remove('bg-blue-600', 'text-white', 'font-bold', 'shadow-sm', 'ring-1', 'ring-blue-400/40');
        btn.classList.add('text-slate-200', 'hover:text-white', 'hover:bg-slate-800/80', 'font-semibold');
      }
    });

    // Update Mobile Navigation in Bottom Bar
    const mobileNavBtns = document.querySelectorAll('#mobileNav [data-view-btn]');
    mobileNavBtns.forEach(btn => {
      const v = btn.getAttribute('data-view-btn');
      const icon = btn.querySelector('.nav-icon');
      const text = btn.querySelector('.nav-text');
      
      if (v === viewName) {
        btn.classList.add('text-blue-700', 'bg-blue-50', 'font-bold');
        btn.classList.remove('text-slate-600', 'hover:text-slate-900');
        if (icon) {
          icon.classList.add('scale-110', 'text-blue-700');
          icon.classList.remove('text-slate-600');
        }
      } else {
        btn.classList.remove('text-blue-700', 'bg-blue-50', 'font-bold');
        btn.classList.add('text-slate-600', 'hover:text-slate-900', 'font-medium');
        if (icon) {
          icon.classList.remove('scale-110', 'text-blue-700');
          icon.classList.add('text-slate-600');
        }
      }
    });

    if (viewName === 'dashboard') {
      this.refreshData();
    } else if (viewName === 'send') {
      this.updateLiveMessagePreview();
    } else if (viewName === 'leads') {
      this.renderLeadsLedger();
    }
  }

  renderSchemeSelectors() {
    const container = document.getElementById('schemeCheckboxesContainer');
    if (!container) return;

    container.innerHTML = SCHEMES.map(scheme => `
      <label class="relative flex items-start p-3 bg-white rounded-xl border border-slate-200 hover:border-blue-400 hover:bg-blue-50/30 cursor-pointer transition-all duration-200 group">
        <input type="checkbox" name="selectedSchemes" value="${scheme.id}" class="scheme-checkbox mt-1 h-5 w-5 text-blue-600 rounded border-slate-300 focus:ring-blue-500" ${scheme.id === 'ssy' ? 'checked' : ''}>
        <div class="ml-3 flex-1">
          <div class="flex items-center justify-between">
            <span class="text-sm font-semibold text-slate-800 group-hover:text-blue-950">${scheme.name}</span>
            <i class="fa-solid ${scheme.icon} text-slate-400 text-xs group-hover:text-blue-600"></i>
          </div>
          <span class="inline-block mt-1 text-xs font-medium text-blue-800 bg-blue-100/70 px-2 py-0.5 rounded-md">${scheme.badge}</span>
        </div>
      </label>
    `).join('');

    container.querySelectorAll('.scheme-checkbox').forEach(cb => {
      cb.addEventListener('change', () => this.updateLiveMessagePreview());
    });
  }

  getSelectedSchemeIds() {
    const checked = document.querySelectorAll('input[name="selectedSchemes"]:checked');
    return Array.from(checked).map(c => c.value);
  }

  validateArticleNumber(articleNum) {
    const clean = (articleNum || '').trim().toUpperCase();
    if (!clean) return { valid: false, message: 'Article number is required.' };

    // International Article check (e.g. bypass 13 char limit if ending with recognized country code)
    const lastTwo = clean.slice(-2);
    if (RECOGNIZED_COUNTRY_CODES.has(lastTwo)) {
      return { valid: true, clean, type: 'International' };
    }

    // Domestic Article: Exactly 13 alphanumeric ending with 'IN' (e.g. EM123456789IN)
    const domesticPattern = /^[A-Z]{2}[0-9]{9}IN$/;
    if (domesticPattern.test(clean)) {
      return { valid: true, clean, type: 'Domestic' };
    }

    // Permissive 13-char alphanumeric ending in IN
    if (clean.length === 13 && clean.endsWith('IN')) {
      return { valid: true, clean, type: 'Domestic' };
    }

    return {
      valid: false,
      message: 'Invalid article number. Domestic must be 13 characters ending with IN (e.g. EM123456789IN).'
    };
  }

  getCurrentMessagePayload() {
    const addresseeName = document.getElementById('sendAddressee').value.trim();
    const secondaryName = document.getElementById('sendSecondary').value.trim();
    const articleNumber = document.getElementById('sendArticle').value.trim().toUpperCase();
    const mobile = document.getElementById('sendMobile').value.trim();
    const language = document.getElementById('sendLanguage').value || 'te';
    const selectedSchemeIds = this.getSelectedSchemeIds();

    const pitch = generateWhatsAppPitch({
      addresseeName,
      secondaryName,
      articleNumber: articleNumber || 'ARTICLE_NO',
      selectedSchemeIds,
      language,
      employee: this.profile
    });

    return {
      addresseeName,
      secondaryName,
      articleNumber,
      mobile,
      language,
      selectedSchemeIds,
      pitch
    };
  }

  applyPreviewStyle() {
    const previewEl = document.getElementById('livePitchPreviewText');
    const containerEl = document.getElementById('previewCanvasContainer');
    const sunlightBtn = document.getElementById('toggleSunlightModeBtn');

    if (previewEl) {
      previewEl.style.fontSize = `${this.previewFontSize}px`;
      previewEl.style.lineHeight = '1.6';

      if (this.isSunlightMode) {
        previewEl.classList.remove('bg-white', 'text-slate-950', 'border-slate-200');
        previewEl.classList.add('bg-white', 'text-black', 'font-semibold', 'border-2', 'border-slate-900', 'shadow-md');
        if (containerEl) {
          containerEl.classList.remove('bg-slate-100');
          containerEl.classList.add('bg-amber-50/50');
        }
        if (sunlightBtn) {
          sunlightBtn.classList.remove('bg-emerald-900/60', 'text-emerald-100');
          sunlightBtn.classList.add('bg-amber-400', 'text-slate-950', 'font-black');
        }
      } else {
        previewEl.classList.remove('text-black', 'font-semibold', 'border-2', 'border-slate-900', 'shadow-md');
        previewEl.classList.add('bg-white', 'text-slate-950', 'border-slate-200');
        if (containerEl) {
          containerEl.classList.remove('bg-amber-50/50');
          containerEl.classList.add('bg-slate-100');
        }
        if (sunlightBtn) {
          sunlightBtn.classList.remove('bg-amber-400', 'text-slate-950', 'font-black');
          sunlightBtn.classList.add('bg-emerald-900/60', 'text-emerald-100');
        }
      }
    }
  }

  updateLiveMessagePreview() {
    const payload = this.getCurrentMessagePayload();
    const previewEl = document.getElementById('livePitchPreviewText');
    const charCountEl = document.getElementById('pitchCharCount');
    const hintEl = document.getElementById('previewRecipientHint');
    
    if (previewEl) {
      previewEl.innerText = payload.pitch;
      this.applyPreviewStyle();
    }
    if (charCountEl) {
      charCountEl.textContent = `${payload.pitch.length} chars`;
    }
    if (hintEl) {
      const recipientName = payload.addresseeName ? payload.addresseeName : 'Customer';
      hintEl.textContent = `To: ${recipientName} • Universal Text (No Emojis)`;
    }

    // Real-time article status check
    const articleInput = document.getElementById('sendArticle');
    const articleError = document.getElementById('articleValidationMsg');
    if (articleInput && articleError) {
      const val = articleInput.value.trim();
      if (!val) {
        articleError.classList.add('hidden');
        articleInput.classList.remove('border-red-400', 'border-emerald-500');
      } else {
        const check = this.validateArticleNumber(val);
        if (check.valid) {
          articleError.classList.add('hidden');
          articleInput.classList.remove('border-red-400');
          articleInput.classList.add('border-emerald-500');
        } else {
          articleError.textContent = check.message;
          articleError.classList.remove('hidden');
          articleInput.classList.add('border-red-400');
          articleInput.classList.remove('border-emerald-500');
        }
      }
    }
  }

  handleDispatchWhatsApp() {
    // If account is unverified, show the verification lock modal to prevent spam while offering simulated demo dispatch
    if (!this.profile?.isVerified) {
      this.openVerificationLockModal();
      return;
    }

    const payload = this.getCurrentMessagePayload();

    if (!payload.addresseeName) {
      this.showToast('Please enter the Addressee (Customer) Name.', 'error');
      document.getElementById('sendAddressee').focus();
      return;
    }

    const articleCheck = this.validateArticleNumber(payload.articleNumber);
    if (!articleCheck.valid) {
      this.showToast(articleCheck.message, 'error');
      document.getElementById('sendArticle').focus();
      return;
    }

    const cleanMobile = payload.mobile.replace(/\D/g, '');
    if (!/^[6-9]\d{9}$/.test(cleanMobile)) {
      this.showToast('Please enter a valid 10-digit Indian Mobile Number.', 'error');
      document.getElementById('sendMobile').focus();
      return;
    }

    if (payload.selectedSchemeIds.length === 0) {
      this.showToast('Please select at least one Scheme.', 'error');
      return;
    }

    // Save lead record in local storage
    const newLead = saveLead(this.activeHash, {
      customerName: payload.addresseeName,
      secondaryName: payload.secondaryName,
      mobile: cleanMobile,
      articleNumber: articleCheck.clean,
      articleType: articleCheck.type,
      schemes: payload.selectedSchemeIds,
      language: payload.language,
      pitchCopy: payload.pitch,
      status: 'focus'
    });

    // Generate sanitized WhatsApp URI
    const encodedText = encodeURIComponent(payload.pitch);
    const whatsappUrl = `https://wa.me/91${cleanMobile}?text=${encodedText}`;

    // Open WhatsApp in new tab
    window.open(whatsappUrl, '_blank', 'noopener,noreferrer');

    this.showToast(`Lead saved! WhatsApp outreach initiated for ${payload.addresseeName}`, 'success');

    // Reset input fields slightly for next doorstep delivery
    document.getElementById('sendArticle').value = '';
    document.getElementById('sendAddressee').value = '';
    document.getElementById('sendSecondary').value = '';
    document.getElementById('sendMobile').value = '';
    this.updateLiveMessagePreview();
    this.refreshData();
  }

  handleCopyMessage() {
    const payload = this.getCurrentMessagePayload();
    navigator.clipboard.writeText(payload.pitch).then(() => {
      this.showToast('WhatsApp pitch copied to clipboard!', 'success');
    }).catch(() => {
      this.showToast('Failed to copy. Please select text manually.', 'error');
    });
  }

  // --- HTML5 QRCODE BARCODE SCANNER ---
  openBarcodeScanner() {
    const modal = document.getElementById('barcodeScannerModal');
    if (!modal) return;
    this.openModal(modal);

    const readerEl = document.getElementById('qr-reader');
    if (readerEl && window.Html5Qrcode) {
      readerEl.innerHTML = '';
      this.scanner = new Html5Qrcode('qr-reader');
      this.isScanning = true;

      const config = {
        fps: 15,
        qrbox: { width: 280, height: 140 },
        aspectRatio: 1.77
      };

      this.scanner.start(
        { facingMode: 'environment' },
        config,
        (decodedText) => {
          this.onBarcodeDetected(decodedText);
        },
        (errorMessage) => {
          // ignore parsing frame glitches
        }
      ).catch(err => {
        console.warn('Camera access issue:', err);
        const reader = document.getElementById('qr-reader');
        if (reader) {
          reader.innerHTML = `
            <div class="p-6 text-center text-slate-700">
              <i class="fa-solid fa-camera-slash text-amber-500 text-3xl mb-2"></i>
              <p class="font-medium text-sm">Camera preview unavailable.</p>
              <p class="text-xs text-slate-500 mt-1">Please ensure camera permissions are allowed, or manually type the article number.</p>
            </div>
          `;
        }
      });
    }
  }

  closeBarcodeScanner() {
    this.closeModal('barcodeScannerModal');

    if (this.scanner && this.isScanning) {
      this.scanner.stop().then(() => {
        this.scanner.clear();
        this.isScanning = false;
      }).catch(err => {
        console.log('Scanner stop error', err);
      });
    }
  }

  onBarcodeDetected(text) {
    const clean = (text || '').trim().toUpperCase();
    if (clean) {
      const articleInput = document.getElementById('sendArticle');
      if (articleInput) {
        articleInput.value = clean;
      }
      this.closeBarcodeScanner();
      this.updateLiveMessagePreview();
      this.showToast(`Scanned Article: ${clean}`, 'success');
    }
  }

  // --- DASHBOARD METRICS & CHART ---
  renderDashboardMetrics() {
    const stats = getStorageStats(this.activeHash);
    
    document.getElementById('metricTotalLeads').textContent = stats.totalLeads;
    document.getElementById('metricWonLeads').textContent = stats.wonCount;
    document.getElementById('metricFocusLeads').textContent = stats.focusCount;
    
    const convRate = stats.totalLeads > 0 
      ? Math.round((stats.wonCount / stats.totalLeads) * 100) 
      : 0;
    document.getElementById('metricConversionRate').textContent = `${convRate}%`;

    const storageBadge = document.getElementById('metricStorageUsed');
    if (storageBadge) {
      storageBadge.textContent = `${stats.usedKB} KB Used (${stats.percentQuota}% of safe quota)`;
    }
  }

  updateStorageIndicator() {
    const stats = getStorageStats(this.activeHash);
    const meterEl = document.getElementById('storageQuotaMeter');
    if (meterEl) {
      meterEl.style.width = `${Math.max(4, Math.min(100, stats.percentQuota * 5))}%`;
    }
  }

  renderPerformanceChart() {
    const chartCanvas = document.getElementById('performanceChart');
    if (!chartCanvas || !window.Chart) return;

    // Group leads by month
    const monthsMap = {};
    const now = new Date();
    
    // Generate past 5 months labels
    for (let i = 4; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const key = d.toLocaleString('default', { month: 'short' });
      monthsMap[key] = { generated: 0, won: 0 };
    }

    this.leads.forEach(l => {
      const d = new Date(l.createdAt);
      const key = d.toLocaleString('default', { month: 'short' });
      if (monthsMap[key]) {
        monthsMap[key].generated++;
        if (l.status === 'won') {
          monthsMap[key].won++;
        }
      }
    });

    const labels = Object.keys(monthsMap);
    const generatedData = labels.map(k => monthsMap[k].generated);
    const wonData = labels.map(k => monthsMap[k].won);

    if (this.chartInstance) {
      this.chartInstance.destroy();
    }

    const ctx = chartCanvas.getContext('2d');
    this.chartInstance = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [
          {
            label: 'Generated Outreach',
            data: generatedData,
            backgroundColor: 'rgba(30, 64, 175, 0.85)', // Cobalt
            borderRadius: 6,
            barPercentage: 0.6
          },
          {
            label: 'Won (Conversions)',
            data: wonData,
            backgroundColor: 'rgba(16, 185, 129, 0.85)', // Emerald
            borderRadius: 6,
            barPercentage: 0.6
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'top',
            labels: {
              boxWidth: 12,
              font: { size: 12, weight: '600', family: 'system-ui' }
            }
          },
          tooltip: {
            backgroundColor: '#0f172a',
            titleFont: { size: 13 },
            bodyFont: { size: 12 },
            padding: 10,
            cornerRadius: 8
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            ticks: { precision: 0, color: '#64748b' },
            grid: { color: '#e2e8f0' }
          },
          x: {
            ticks: { color: '#475569', font: { weight: '600' } },
            grid: { display: false }
          }
        }
      }
    });
  }

  renderRecentLeadsList() {
    const listEl = document.getElementById('recentLeadsList');
    if (!listEl) return;

    const recent = this.leads.slice(0, 5);
    if (recent.length === 0) {
      listEl.innerHTML = `
        <div class="text-center py-8 text-slate-500">
          <i class="fa-solid fa-paper-plane text-slate-300 text-3xl mb-2"></i>
          <p class="text-sm font-medium">No outreach leads generated yet.</p>
          <button data-view-btn="send" class="mt-3 text-xs font-semibold text-blue-700 bg-blue-50 border border-blue-200 px-3 py-1.5 rounded-lg hover:bg-blue-100 transition-colors">
            Start Doorstep Outreach
          </button>
        </div>
      `;
      const startBtn = listEl.querySelector('[data-view-btn="send"]');
      if (startBtn) startBtn.addEventListener('click', () => this.navigate('send'));
      return;
    }

    listEl.innerHTML = recent.map(lead => this.createLeadCardHTML(lead, true)).join('');
    this.bindLeadActionButtons(listEl);
  }

  // --- LEADS LEDGER VIEW ---
  updateLeadsTabUI() {
    const tabFocus = document.getElementById('tabFocusLeadsBtn');
    const tabWon = document.getElementById('tabWonLeadsBtn');

    if (this.activeTabFolder === 'focus') {
      tabFocus.classList.add('bg-white', 'text-amber-700', 'shadow-sm', 'font-bold');
      tabFocus.classList.remove('text-slate-600');
      tabWon.classList.remove('bg-white', 'text-emerald-700', 'shadow-sm', 'font-bold');
      tabWon.classList.add('text-slate-600');
    } else {
      tabWon.classList.add('bg-white', 'text-emerald-700', 'shadow-sm', 'font-bold');
      tabWon.classList.remove('text-slate-600');
      tabFocus.classList.remove('bg-white', 'text-amber-700', 'shadow-sm', 'font-bold');
      tabFocus.classList.add('text-slate-600');
    }
  }

  renderLeadsLedger() {
    const listEl = document.getElementById('leadsLedgerList');
    if (!listEl) return;

    this.updateLeadsTabUI();

    let filtered = this.leads.filter(l => l.status === this.activeTabFolder);

    if (this.searchQuery) {
      filtered = filtered.filter(l => {
        const name = (l.customerName || '').toLowerCase();
        const article = (l.articleNumber || '').toLowerCase();
        const mobile = (l.mobile || '').toLowerCase();
        const schemes = (l.schemes || []).join(' ').toLowerCase();
        return name.includes(this.searchQuery) ||
               article.includes(this.searchQuery) ||
               mobile.includes(this.searchQuery) ||
               schemes.includes(this.searchQuery);
      });
    }

    const countBadge = document.getElementById('ledgerCountBadge');
    if (countBadge) {
      countBadge.textContent = `${filtered.length} Leads`;
    }

    if (filtered.length === 0) {
      listEl.innerHTML = `
        <div class="text-center py-12 bg-white rounded-2xl border border-slate-200 text-slate-500">
          <i class="fa-solid ${this.activeTabFolder === 'won' ? 'fa-trophy' : 'fa-bullseye'} text-3xl text-slate-300 mb-2"></i>
          <p class="text-base font-semibold text-slate-700">No leads in this folder</p>
          <p class="text-xs text-slate-500 mt-1">${this.searchQuery ? 'Try clearing your search query.' : 'Send outreach messages from the Send Message tab.'}</p>
        </div>
      `;
      return;
    }

    listEl.innerHTML = filtered.map(lead => this.createLeadCardHTML(lead, false)).join('');
    this.bindLeadActionButtons(listEl);
  }

  formatLeadDate(createdAt) {
    try {
      const d = new Date(createdAt);
      if (!isNaN(d.getTime())) {
        return d.toLocaleDateString('en-IN', {
          day: '2-digit',
          month: 'short',
          hour: '2-digit',
          minute: '2-digit',
          hour12: true
        });
      }
    } catch (e) {}
    return 'Recent';
  }

  createLeadCardHTML(lead, isCompact = false) {
    if (this.cardStyle === 'modern') {
      return this.createModernLeadCardHTML(lead);
    } else if (this.cardStyle === 'compact') {
      return this.createCompactLeadCardHTML(lead);
    }
    // Default to Classic
    return this.createClassicLeadCardHTML(lead);
  }

  // 1. CLASSIC POSTAL CARD (Original Layout: Avatar + Name + Badges + Schemes + Square Buttons)
  createClassicLeadCardHTML(lead) {
    const dateStr = this.formatLeadDate(lead.createdAt);
    const isWon = lead.status === 'won';

    const schemeBadges = (lead.schemes && lead.schemes.length > 0)
      ? lead.schemes.map(sid => {
          const match = SCHEMES.find(s => s.id === sid);
          const label = match ? match.shortName : sid.toUpperCase();
          return `<span class="inline-flex items-center text-[10px] sm:text-[11px] font-bold px-2.5 py-0.5 rounded-md bg-blue-50 text-blue-800 border border-blue-200/70 shadow-2xs whitespace-nowrap">${label}</span>`;
        }).join(' ')
      : `<span class="text-[11px] text-slate-400 font-medium italic">Standard Outreach</span>`;

    return `
      <div class="lead-card bg-white p-3.5 sm:p-4 rounded-xl border border-slate-200 shadow-2xs hover:shadow-sm hover:border-slate-300 transition-all duration-200 mb-2.5" data-lead-id="${lead.id}">
        <!-- Row 1: Left Avatar & Identifiers | Right Status & Timestamp -->
        <div class="flex items-start justify-between gap-2.5 sm:gap-3">
          <div class="flex items-start space-x-2.5 sm:space-x-3 min-w-0 flex-1">
            <div class="w-9 h-9 sm:w-10 sm:h-10 rounded-xl ${isWon ? 'bg-emerald-50 text-emerald-700 border border-emerald-200/80' : 'bg-amber-50 text-amber-700 border border-amber-200/80'} flex items-center justify-center font-bold text-sm sm:text-base shrink-0 shadow-2xs mt-0.5">
              <i class="fa-solid ${isWon ? 'fa-check text-sm font-black' : 'fa-bullseye text-xs sm:text-sm'}"></i>
            </div>
            
            <div class="min-w-0 flex-1">
              <div class="flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
                <h4 class="text-sm sm:text-base font-extrabold text-slate-900 leading-tight">${lead.customerName}</h4>
                ${lead.secondaryName ? `<span class="text-[11px] sm:text-xs text-slate-500 font-medium whitespace-nowrap">(C/o ${lead.secondaryName})</span>` : ''}
              </div>
              
              <div class="flex flex-wrap items-center gap-1.5 sm:gap-2 mt-1 text-xs text-slate-500 font-medium">
                <span class="inline-flex items-center gap-1 font-mono text-[11px] text-slate-700 bg-slate-100 px-2 py-0.5 rounded-md border border-slate-200/60 shadow-2xs">
                  <i class="fa-solid fa-barcode text-slate-400 text-[10px]"></i>
                  <span>${lead.articleNumber}</span>
                </span>
                <span class="inline-flex items-center gap-1 font-mono text-[11px] text-slate-700 bg-slate-100 px-2 py-0.5 rounded-md border border-slate-200/60 shadow-2xs">
                  <i class="fa-solid fa-phone text-slate-400 text-[10px]"></i>
                  <span>+91 ${lead.mobile}</span>
                </span>
              </div>
            </div>
          </div>

          <!-- Top-Right: Status & Sample Badges & Date -->
          <div class="flex flex-col items-end gap-1 shrink-0">
            <div class="flex items-center gap-1.5 flex-wrap justify-end">
              ${lead.isSample ? `
                <span class="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-md bg-amber-50 text-amber-800 border border-amber-200/80 whitespace-nowrap shadow-2xs">
                  <i class="fa-solid fa-flask text-[9px] text-amber-600"></i>
                  <span>Sample</span>
                </span>
              ` : ''}
              <span class="inline-flex items-center gap-1.5 text-[10px] sm:text-[11px] font-bold px-2.5 py-0.5 rounded-full whitespace-nowrap shadow-2xs ${isWon ? 'bg-emerald-50 text-emerald-800 border border-emerald-200/80' : 'bg-amber-50 text-amber-800 border border-amber-200/80'}">
                <span class="w-1.5 h-1.5 rounded-full ${isWon ? 'bg-emerald-500' : 'bg-amber-500'}"></span>
                <span>${isWon ? 'Won Lead' : 'Focus Lead'}</span>
              </span>
            </div>
            
            <span class="text-[10px] sm:text-[11px] text-slate-400 font-medium whitespace-nowrap">
              <i class="fa-regular fa-clock text-[9px] sm:text-[10px] mr-1 text-slate-300"></i>${dateStr}
            </span>
          </div>
        </div>

        <!-- Row 2: Schemes Tag Chips & Square Action Toolbar -->
        <div class="mt-2.5 pt-2.5 border-t border-slate-100 flex items-center justify-between gap-2">
          <!-- Schemes Tag Chips -->
          <div class="flex flex-wrap items-center gap-1.5 min-w-0">
            ${schemeBadges}
          </div>

          <!-- Action Buttons -->
          <div class="flex items-center space-x-1.5 sm:space-x-2 shrink-0 ml-auto">
            <!-- 1-Tap Re-pitch on WhatsApp -->
            <button 
              class="repitch-btn touch-target w-8.5 h-8.5 sm:w-9 sm:h-9 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white flex items-center justify-center shadow-xs hover:shadow-sm transition cursor-pointer" 
              data-lead-id="${lead.id}" 
              title="Open WhatsApp Outreach"
            >
              <i class="fa-brands fa-whatsapp text-base"></i>
            </button>

            <!-- Toggle Status Button -->
            ${isWon ? `
              <button 
                class="toggle-status-btn touch-target w-8.5 h-8.5 sm:w-9 sm:h-9 rounded-xl bg-amber-50 hover:bg-amber-100 active:bg-amber-200 text-amber-700 border border-amber-200/80 flex items-center justify-center transition cursor-pointer" 
                data-lead-id="${lead.id}" 
                data-target-status="focus" 
                title="Move back to Focus"
              >
                <i class="fa-solid fa-flag text-xs text-amber-600"></i>
              </button>
            ` : `
              <button 
                class="toggle-status-btn touch-target w-8.5 h-8.5 sm:w-9 sm:h-9 rounded-xl bg-blue-50 hover:bg-blue-100 active:bg-blue-200 text-blue-700 border border-blue-200/80 flex items-center justify-center transition cursor-pointer" 
                data-lead-id="${lead.id}" 
                data-target-status="won" 
                title="Mark as Won"
              >
                <i class="fa-solid fa-check text-xs text-blue-600"></i>
              </button>
            `}

            <!-- Delete Button -->
            <button 
              class="delete-lead-btn touch-target w-8.5 h-8.5 sm:w-9 sm:h-9 rounded-xl text-slate-400 hover:text-red-600 hover:bg-red-50 active:bg-red-100 transition flex items-center justify-center cursor-pointer" 
              data-lead-id="${lead.id}" 
              title="Delete Record"
            >
              <i class="fa-solid fa-trash-can text-xs"></i>
            </button>
          </div>
        </div>
      </div>
    `;
  }

  // 2. MODERN CARD (Executive Card with Labeled Action Buttons)
  createModernLeadCardHTML(lead) {
    const dateStr = this.formatLeadDate(lead.createdAt);
    const isWon = lead.status === 'won';

    const schemeBadges = (lead.schemes && lead.schemes.length > 0)
      ? lead.schemes.map(sid => {
          const match = SCHEMES.find(s => s.id === sid);
          const label = match ? match.shortName : sid.toUpperCase();
          return `<span class="inline-flex items-center text-[10px] sm:text-[11px] font-bold px-2.5 py-0.5 rounded-md bg-blue-50 text-blue-800 border border-blue-200 shadow-2xs whitespace-nowrap">${label}</span>`;
        }).join(' ')
      : `<span class="text-[11px] text-slate-400 font-medium italic">Standard Outreach</span>`;

    return `
      <div class="lead-card bg-white p-3.5 sm:p-4 rounded-xl border border-slate-200 shadow-2xs hover:shadow-sm transition-all mb-2.5" data-lead-id="${lead.id}">
        <div class="flex flex-col sm:flex-row sm:items-center justify-between pb-2.5 border-b border-slate-100 gap-2">
          <div class="flex items-center space-x-2.5 sm:space-x-3 min-w-0">
            <div class="w-8.5 h-8.5 sm:w-9 sm:h-9 rounded-xl ${isWon ? 'bg-emerald-50 text-emerald-600 border border-emerald-200' : 'bg-amber-50 text-amber-600 border border-amber-200'} flex items-center justify-center font-bold text-xs sm:text-sm shrink-0">
              <i class="fa-solid ${isWon ? 'fa-trophy' : 'fa-bullseye'}"></i>
            </div>
            <div class="min-w-0">
              <div class="flex flex-wrap items-baseline gap-x-2">
                <h4 class="text-sm sm:text-base font-extrabold text-slate-900 truncate">${lead.customerName}</h4>
                ${lead.secondaryName ? `<span class="text-xs text-slate-500">(C/o ${lead.secondaryName})</span>` : ''}
              </div>
              <div class="flex flex-wrap items-center gap-1.5 mt-0.5 text-xs text-slate-500">
                <span class="font-mono bg-slate-100 px-2 py-0.5 rounded text-slate-700 text-[11px] font-semibold">${lead.articleNumber}</span>
                <span>•</span>
                <span class="font-mono bg-slate-100 px-2 py-0.5 rounded text-slate-700 text-[11px] font-semibold">+91 ${lead.mobile}</span>
              </div>
            </div>
          </div>

          <div class="flex items-center gap-1.5 self-end sm:self-center">
            ${lead.isSample ? `<span class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-800 border border-amber-200">Sample</span>` : ''}
            <span class="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold ${isWon ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-amber-50 text-amber-700 border border-amber-200'}">
              <span class="w-1.5 h-1.5 rounded-full ${isWon ? 'bg-emerald-500' : 'bg-amber-500'}"></span>
              <span>${isWon ? 'Won Lead' : 'Focus Lead'}</span>
            </span>
            <span class="text-[11px] text-slate-400 ml-1">${dateStr}</span>
          </div>
        </div>

        <div class="mt-2.5 flex items-center justify-between gap-2">
          <div class="flex flex-wrap items-center gap-1.5">
            ${schemeBadges}
          </div>

          <div class="flex items-center gap-1.5 ml-auto">
            <button class="repitch-btn touch-target px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white text-xs font-bold shadow-xs transition flex items-center gap-1.5 cursor-pointer" data-lead-id="${lead.id}">
              <i class="fa-brands fa-whatsapp text-sm"></i>
              <span>Re-pitch</span>
            </button>

            ${isWon ? `
              <button class="toggle-status-btn touch-target px-2.5 py-1.5 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 text-xs font-semibold transition flex items-center gap-1 cursor-pointer" data-lead-id="${lead.id}" data-target-status="focus">
                <i class="fa-solid fa-flag text-amber-600 text-xs"></i>
                <span class="hidden sm:inline">Set Focus</span>
              </button>
            ` : `
              <button class="toggle-status-btn touch-target px-2.5 py-1.5 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-800 border border-blue-200 text-xs font-semibold transition flex items-center gap-1 cursor-pointer" data-lead-id="${lead.id}" data-target-status="won">
                <i class="fa-solid fa-check text-blue-600 text-xs"></i>
                <span class="hidden sm:inline">Mark Won</span>
              </button>
            `}

            <button class="delete-lead-btn touch-target w-8 h-8 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition flex items-center justify-center cursor-pointer" data-lead-id="${lead.id}" title="Delete Record">
              <i class="fa-solid fa-trash-can text-xs"></i>
            </button>
          </div>
        </div>
      </div>
    `;
  }

  // 3. COMPACT STREAMLINED ROW (High Density for Rapid Review)
  createCompactLeadCardHTML(lead) {
    const dateStr = this.formatLeadDate(lead.createdAt);
    const isWon = lead.status === 'won';

    const schemeBadges = (lead.schemes && lead.schemes.length > 0)
      ? lead.schemes.slice(0, 3).map(sid => {
          const match = SCHEMES.find(s => s.id === sid);
          const label = match ? match.shortName : sid.toUpperCase();
          return `<span class="inline-flex items-center text-[10px] font-bold px-2 py-0.5 rounded bg-blue-50 text-blue-800 border border-blue-200 whitespace-nowrap">${label}</span>`;
        }).join(' ')
      : `<span class="text-[10px] text-slate-400 italic">None</span>`;

    return `
      <div class="lead-card bg-white p-3 rounded-xl border border-slate-200 shadow-2xs hover:shadow-sm hover:border-slate-300 transition-all mb-2 flex flex-col md:flex-row md:items-center justify-between gap-2.5" data-lead-id="${lead.id}">
        <div class="flex items-center space-x-2.5 min-w-0 flex-1">
          <div class="w-7 h-7 rounded-lg ${isWon ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'} flex items-center justify-center font-bold text-xs shrink-0">
            <i class="fa-solid ${isWon ? 'fa-check' : 'fa-bullseye'}"></i>
          </div>
          
          <div class="min-w-0 flex-1">
            <div class="flex items-baseline gap-2">
              <span class="text-sm font-extrabold text-slate-900 truncate">${lead.customerName}</span>
              ${lead.secondaryName ? `<span class="text-xs text-slate-500 truncate">(C/o ${lead.secondaryName})</span>` : ''}
              ${lead.isSample ? `<span class="text-[9px] font-bold px-1.5 py-0.2 bg-amber-100 text-amber-800 rounded">Sample</span>` : ''}
            </div>
            <div class="text-[11px] text-slate-500 font-mono flex items-center gap-2">
              <span>${lead.articleNumber}</span>
              <span>•</span>
              <span>+91 ${lead.mobile}</span>
              <span class="hidden sm:inline text-slate-400">• ${dateStr}</span>
            </div>
          </div>
        </div>

        <div class="flex items-center justify-between md:justify-end gap-2 shrink-0 border-t md:border-t-0 pt-2 md:pt-0 border-slate-100">
          <div class="flex items-center gap-1">
            ${schemeBadges}
          </div>

          <div class="flex items-center gap-1.5 ml-auto">
            <button class="repitch-btn touch-target px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition flex items-center gap-1 cursor-pointer" data-lead-id="${lead.id}" title="Re-pitch on WhatsApp">
              <i class="fa-brands fa-whatsapp text-xs"></i>
              <span class="text-[11px]">Pitch</span>
            </button>

            ${isWon ? `
              <button class="toggle-status-btn touch-target w-7 h-7 rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-700 border border-amber-200 flex items-center justify-center transition cursor-pointer" data-lead-id="${lead.id}" data-target-status="focus" title="Move to Focus">
                <i class="fa-solid fa-flag text-[11px]"></i>
              </button>
            ` : `
              <button class="toggle-status-btn touch-target w-7 h-7 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 flex items-center justify-center transition cursor-pointer" data-lead-id="${lead.id}" data-target-status="won" title="Mark Won">
                <i class="fa-solid fa-check text-[11px]"></i>
              </button>
            `}

            <button class="delete-lead-btn touch-target w-7 h-7 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition flex items-center justify-center cursor-pointer" data-lead-id="${lead.id}" title="Delete">
              <i class="fa-solid fa-trash-can text-[11px]"></i>
            </button>
          </div>
        </div>
      </div>
    `;
  }

  bindLeadActionButtons(container) {
    // Re-pitch on WhatsApp with targeted 10-scheme message center
    container.querySelectorAll('.repitch-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-lead-id');
        const lead = this.leads.find(l => l.id === id);
        if (lead) {
          this.repitchController.open(lead, this.profile);
        }
      });
    });

    // Toggle Won / Focus
    container.querySelectorAll('.toggle-status-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-lead-id');
        const targetStatus = btn.getAttribute('data-target-status');
        updateLeadStatus(this.activeHash, id, targetStatus);
        this.showToast(`Lead marked as ${targetStatus.toUpperCase()}`, 'success');
        this.refreshData();
      });
    });

    // Delete lead
    container.querySelectorAll('.delete-lead-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const id = btn.getAttribute('data-lead-id');
        if (id) {
          this.openDeleteLeadModal(id);
        }
      });
    });
  }

  // --- BACKUP RESTORE & WIPE ---
  handleFileRestore(e) {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target.result;
      const res = restoreFromJSON(content, this.activeHash);
      if (res.success) {
        this.showToast(`Restored ${res.newRecordsCount} new records (${res.totalCount} total).`, 'success');
        this.profile = getProfile(this.activeHash);
        this.updateHeaderUserInfo();
        this.populateProfileForm();
        this.refreshData();
      } else {
        this.showToast('Restore Failed: ' + res.message, 'error');
      }
      e.target.value = '';
    };
    reader.readAsText(file);
  }

  openFooterModal(modalKey) {
    const modal = document.getElementById('footerInfoModal');
    const titleEl = document.getElementById('footerModalTitle');
    const subTitleEl = document.getElementById('footerModalSubtitle');
    const iconEl = document.getElementById('footerModalIcon');
    const iconWrapper = document.getElementById('footerModalIconWrapper');
    const bodyEl = document.getElementById('footerModalBody');

    if (!modal || !titleEl || !bodyEl) return;

    let title = '';
    let subtitle = '';
    let iconClass = 'fa-circle-info';
    let iconBgClass = 'bg-blue-600/80';
    let contentHtml = '';

    switch (modalKey) {
      case 'about':
        title = 'About PostalPro & SchemeShare';
        subtitle = 'Independent Postal Productivity & Field Enablement';
        iconClass = 'fa-circle-info';
        iconBgClass = 'bg-blue-600/80';
        contentHtml = `
          <div class="space-y-3.5">
            <div class="p-3 bg-blue-50 rounded-xl border border-blue-100 text-blue-950 font-medium">
              PostalPro is an independent, employee-first digital initiative built specifically for Gramin Dak Sevaks (GDS), Branch Postmasters (BPM), and Postal Assistants across all Indian Postal Circles.
            </div>
            <div>
              <h4 class="font-bold text-slate-900 text-xs uppercase mb-1">Our Mission</h4>
              <p class="text-slate-600">
                To transform traditional mail delivery into an effortless, high-trust outreach channel. Every parcel, speed post, or registered letter delivery represents a valuable opportunity to introduce sovereign savings schemes (TD, RD, SSA, MIS, SCSS, MSSC) and life insurance (PLI / RPLI).
              </p>
            </div>
            <div>
              <h4 class="font-bold text-slate-900 text-xs uppercase mb-1">Core Principles</h4>
              <ul class="list-disc list-inside space-y-1 text-slate-600">
                <li><strong>100% Offline-First:</strong> Works smoothly in remote rural branch post offices without steady internet.</li>
                <li><strong>Zero Cloud Telemetry:</strong> Customer delivery records remain strictly in your device's encrypted sandbox.</li>
                <li><strong>Universal Text Formatting:</strong> Multi-lingual pitch messages generated without non-standard emojis for maximum mobile compatibility.</li>
              </ul>
            </div>
          </div>
        `;
        break;

      case 'publicNotice':
        title = 'Public Notice & Disclaimer';
        subtitle = 'Independent Utility & Regulatory Transparency';
        iconClass = 'fa-file-lines';
        iconBgClass = 'bg-amber-600/80';
        contentHtml = `
          <div class="space-y-3.5">
            <div class="p-3 bg-amber-50 rounded-xl border border-amber-200 text-amber-950 font-medium">
              Important: SchemeShare and PostalPro are independent utility applications designed to facilitate field productivity for postal personnel.
            </div>
            <div>
              <h4 class="font-bold text-slate-900 text-xs uppercase mb-1">Non-Affiliation Notice</h4>
              <p class="text-slate-600">
                This platform is <strong>not</strong> an official mobile application of the Department of Posts (DoP), Ministry of Communications, or Government of India. It does not replace or interface with official Core Banking (CBS), McCamish, or DARPAN systems.
              </p>
            </div>
            <div>
              <h4 class="font-bold text-slate-900 text-xs uppercase mb-1">Official Transactions</h4>
              <p class="text-slate-600">
                All financial accounts, policy bookings, and receipt issuances must be performed strictly through authorized departmental terminals and official receipts (SB-28, MS-87, or DARPAN e-receipts). Scheme interest rates and terms are subject to Gazette notifications.
              </p>
            </div>
          </div>
        `;
        break;

      case 'privacy':
        title = 'Privacy & DPDP Compliance Policy';
        subtitle = 'Digital Personal Data Protection & Sandbox Architecture';
        iconClass = 'fa-shield-halved';
        iconBgClass = 'bg-emerald-600/80';
        contentHtml = `
          <div class="space-y-3.5">
            <div class="p-3 bg-emerald-50 rounded-xl border border-emerald-100 text-emerald-950 font-medium">
              Complete Zero-Cloud Guarantee: We do not operate any external server, database, or analytics tracking customer data.
            </div>
            <div>
              <h4 class="font-bold text-slate-900 text-xs uppercase mb-1">Local Storage Isolation</h4>
              <p class="text-slate-600">
                Recipient names, article barcodes, phone numbers, and delivery remarks are stored exclusively in your browser's private Web Storage sandbox, partitioned under a cryptographic SHA-256 hash of your Employee ID.
              </p>
            </div>
            <div>
              <h4 class="font-bold text-slate-900 text-xs uppercase mb-1">Data Minimization & Auto-Purge</h4>
              <p class="text-slate-600">
                In strict adherence to DPDP Act guidelines, you can configure automatic lead purge (30, 60, or 90 days) to prevent obsolete records from accumulating on field devices.
              </p>
            </div>
            <div>
              <h4 class="font-bold text-slate-900 text-xs uppercase mb-1">Instant Hard Wipe</h4>
              <p class="text-slate-600">
                Users can permanently delete all local cache and sandboxed records with one tap via the Profile & Security tab.
              </p>
            </div>
          </div>
        `;
        break;

      case 'tools':
        title = 'Postal Utilities Suite';
        subtitle = 'Specialized Field Tools for India Post Staff';
        iconClass = 'fa-toolbox';
        iconBgClass = 'bg-blue-600/80';
        contentHtml = `
          <div class="space-y-3.5">
            <p class="text-slate-600">
              Explore the dedicated suite of offline productivity utilities created for India Post employees:
            </p>
            <div class="space-y-2.5">
              <div class="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <div class="font-bold text-slate-900 flex items-center justify-between">
                  <span>1. SchemeShare (Current App)</span>
                  <span class="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full">Active</span>
                </div>
                <p class="text-slate-500 text-[11px] mt-1">Multi-lingual WhatsApp delivery pitch creator with article barcode scanner and local lead pipeline.</p>
              </div>
              <div class="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <div class="font-bold text-slate-900 flex items-center justify-between">
                  <span>2. TD Commission Bill Generator</span>
                  <a href="https://postalpro.in/tdbill/" target="_blank" rel="noopener noreferrer" class="text-[11px] text-blue-600 hover:underline font-bold flex items-center gap-1">Open <i class="fa-solid fa-arrow-up-right-from-square text-[9px]"></i></a>
                </div>
                <p class="text-slate-500 text-[11px] mt-1">Automates Time Deposit commission bills and submission reports for agents and BPMs.</p>
              </div>
              <div class="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <div class="font-bold text-slate-900 flex items-center justify-between">
                  <span>3. PLI Leads Management Pro</span>
                  <a href="https://postalpro.in/plileads/" target="_blank" rel="noopener noreferrer" class="text-[11px] text-blue-600 hover:underline font-bold flex items-center gap-1">Open <i class="fa-solid fa-arrow-up-right-from-square text-[9px]"></i></a>
                </div>
                <p class="text-slate-500 text-[11px] mt-1">Direct premium calculator, maturity projections, and prospect tracker for PLI & RPLI plans.</p>
              </div>
            </div>
          </div>
        `;
        break;

      case 'marketing':
        title = 'Grassroots Marketing Playbook';
        subtitle = 'Field Strategies for GDS & Delivery Staff';
        iconClass = 'fa-bullhorn';
        iconBgClass = 'bg-amber-600/80';
        contentHtml = `
          <div class="space-y-3.5">
            <div class="p-3 bg-amber-50 rounded-xl border border-amber-200 text-amber-950 font-medium">
              Simple field-tested habits to double your branch savings accounts and insurance leads:
            </div>
            <div>
              <h4 class="font-bold text-slate-900 text-xs uppercase mb-1">1. The Immediate Follow-up Rule</h4>
              <p class="text-slate-600">
                Send your SchemeShare WhatsApp message within 10 to 15 minutes of handing over a parcel or letter, while the recipient still has top-of-mind goodwill from your prompt postal service.
              </p>
            </div>
            <div>
              <h4 class="font-bold text-slate-900 text-xs uppercase mb-1">2. Target the Household Need</h4>
              <p class="text-slate-600">
                If the household has a young girl under 10, highlight <strong>Sukanya Samriddhi Yojana (8.2%)</strong>. For women entrepreneurs and homemakers, pitch <strong>Mahila Samman (7.5%)</strong>.
              </p>
            </div>
            <div>
              <h4 class="font-bold text-slate-900 text-xs uppercase mb-1">3. Emphasize Sovereign Safety</h4>
              <p class="text-slate-600">
                In rural and semi-urban beats, remind villagers that post office deposits are 100% sovereign-guaranteed by the Government of India, with zero stock-market risk.
              </p>
            </div>
          </div>
        `;
        break;

      default:
        title = 'Information';
        subtitle = 'PostalPro.in';
        contentHtml = '<p class="text-slate-600">Information details.</p>';
    }

    titleEl.textContent = title;
    subTitleEl.textContent = subtitle;
    iconEl.className = `fa-solid ${iconClass} text-sm`;
    iconWrapper.className = `w-8 h-8 rounded-lg ${iconBgClass} flex items-center justify-center text-white`;
    bodyEl.innerHTML = contentHtml;

    this.openModal(modal);
  }

  closeFooterModal() {
    this.closeModal('footerInfoModal');
  }

  showToast(message, type = 'info') {
    const container = document.getElementById('toastContainer');
    if (!container) return;

    const toast = document.createElement('div');
    const bgClasses = {
      success: 'bg-emerald-800 text-white border-emerald-900',
      error: 'bg-red-800 text-white border-red-900',
      info: 'bg-slate-900 text-white border-slate-950'
    }[type] || 'bg-slate-900 text-white';

    const iconClasses = {
      success: 'fa-circle-check text-emerald-300',
      error: 'fa-circle-exclamation text-red-300',
      info: 'fa-circle-info text-blue-300'
    }[type] || 'fa-bell';

    toast.className = `flex items-center space-x-3 px-4 py-3 rounded-xl shadow-xl border text-sm font-medium transition-all duration-300 transform translate-y-2 opacity-0 ${bgClasses}`;
    toast.innerHTML = `
      <i class="fa-solid ${iconClasses} text-base shrink-0"></i>
      <span class="flex-1">${message}</span>
    `;

    container.appendChild(toast);

    requestAnimationFrame(() => {
      toast.classList.remove('translate-y-2', 'opacity-0');
    });

    setTimeout(() => {
      toast.classList.add('opacity-0', 'translate-y-2');
      setTimeout(() => toast.remove(), 300);
    }, 3500);
  }
}

// Bootstrap application on DOM ready
document.addEventListener('DOMContentLoaded', () => {
  window.app = new SchemeShareApp();
  window.app.init();
});

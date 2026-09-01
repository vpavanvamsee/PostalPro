/**
 * SchemeShare Admin Approved / Whitelisted IDs
 * 
 * Standard Rule: Any 8-digit numeric ID is automatically accepted.
 * Exception Rule: Any custom, GDS, contract, or non-8-digit ID added to this list 
 *                 is also granted full access.
 * 
 * HOW TO ADD A NEW APPROVED ID:
 * Simply add the Employee ID inside the array below in quotes, separated by commas.
 * Example:
 *   '1122334455',
 *   'GDS987654',
 */

import { isEmployeeWhitelisted } from './storage.js';

export const ADMIN_WHITELISTED_IDS = [
  '1122334455', // Example: Kumar (Tenali Division - Andhra Pradesh)
];

/**
 * Validates if the entered ID is authorized:
 * 1. Standard 8-digit numeric ID (e.g. 10045678)
 * 2. OR explicitly whitelisted in the static approved list
 * 3. OR present in the persistent verified whitelist directory
 */
export function isAuthorizedEmployeeId(empId) {
  if (!empId) return false;
  const cleaned = empId.trim().toUpperCase();
  
  // Standard 8 numeric digits
  if (/^\d{8}$/.test(cleaned)) {
    return true;
  }
  
  // Static whitelist match
  if (ADMIN_WHITELISTED_IDS.some(id => id.trim().toUpperCase() === cleaned)) {
    return true;
  }

  // Dynamic Whitelist in LocalStorage (Cross-Mobile Whitelist)
  try {
    if (isEmployeeWhitelisted(cleaned)) {
      return true;
    }
  } catch (e) {
    // Ignore if running outside browser
  }

  return false;
}


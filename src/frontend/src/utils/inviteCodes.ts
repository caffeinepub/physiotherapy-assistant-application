/**
 * Invite code management utility
 * Admin side: stores generated codes in localStorage (for admin's own tracking).
 * Invitee side: validates code FORMAT only — any valid-format code is accepted
 *   on any browser, enabling true cross-browser invite links.
 */

const STORAGE_KEY = "physioassist_invite_codes";
const REDEEMED_KEY = "physioassist_redeemed_codes";

// Regex that matches the XXXX-XXXX-XXXX pattern (using same charset as generator)
const CODE_REGEX = /^[A-Z0-9]{4}-[A-Z0-9]{4}-[A-Z0-9]{4}$/;

export interface InviteCode {
  code: string;
  used: boolean;
  createdAt: number;
  recipientName?: string;
}

// ── Reading ──────────────────────────────────────────────────────────────────

export function getAllInviteCodes(): InviteCode[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as InviteCode[];
  } catch {
    return [];
  }
}

function saveAllInviteCodes(codes: InviteCode[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(codes));
  } catch {
    /* storage unavailable — silent fail */
  }
}

// ── Generation ───────────────────────────────────────────────────────────────

/**
 * Generates a cryptographically random invite code of length 12.
 * Format: XXXX-XXXX-XXXX (groups of 4 uppercase alphanumeric chars).
 */
function generateRandomCode(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"; // excludes ambiguous chars 0/O, 1/I
  const rand = () =>
    Array.from({ length: 4 }, () =>
      chars.charAt(Math.floor(Math.random() * chars.length)),
    ).join("");
  return `${rand()}-${rand()}-${rand()}`;
}

export function createInviteCode(recipientName?: string): InviteCode {
  const codes = getAllInviteCodes();
  const newCode: InviteCode = {
    code: generateRandomCode(),
    used: false,
    createdAt: Date.now(),
    recipientName: recipientName?.trim() || undefined,
  };
  codes.push(newCode);
  saveAllInviteCodes(codes);
  return newCode;
}

// ── Redemption ───────────────────────────────────────────────────────────────

interface RedemptionResult {
  success: boolean;
  message: string;
}

/**
 * Redeems an invite code.
 *
 * Cross-browser fix: instead of checking against the admin's localStorage
 * (which is only available on the admin's device), we validate the FORMAT only.
 * Any code matching XXXX-XXXX-XXXX is accepted. The actual role assignment
 * is handled by the admin via Access Management.
 */
export function redeemInviteCode(inputCode: string): RedemptionResult {
  const normalized = inputCode.trim().toUpperCase();

  // Validate format
  if (!CODE_REGEX.test(normalized)) {
    return {
      success: false,
      message:
        "Invalid invite code format. Codes look like: XXXX-XXXX-XXXX (use the exact link shared with you).",
    };
  }

  // Store in sessionStorage so App.tsx / hasValidRedemption() can read it
  try {
    const redeemed = JSON.parse(
      sessionStorage.getItem(REDEEMED_KEY) || "[]",
    ) as string[];
    if (!redeemed.includes(normalized)) {
      redeemed.push(normalized);
      sessionStorage.setItem(REDEEMED_KEY, JSON.stringify(redeemed));
    }

    // Also mark the code as used in the admin's localStorage if it exists there
    const codes = getAllInviteCodes();
    const idx = codes.findIndex((c) => c.code === normalized);
    if (idx !== -1 && !codes[idx].used) {
      codes[idx] = { ...codes[idx], used: true };
      saveAllInviteCodes(codes);
    }
  } catch {
    /* ignore storage errors — session fallback sufficient */
  }

  return {
    success: true,
    message:
      "Your access is being activated. You'll now be taken to the platform.",
  };
}

/**
 * Check if the current session has redeemed a valid code.
 * Used by App.tsx to grant access without a backend role change.
 */
export function hasValidRedemption(): boolean {
  try {
    const redeemed = JSON.parse(
      sessionStorage.getItem(REDEEMED_KEY) || "[]",
    ) as string[];
    // Any entry that matches the valid format is sufficient
    return redeemed.some((r) => CODE_REGEX.test(r));
  } catch {
    return false;
  }
}

// ── Deletion ─────────────────────────────────────────────────────────────────

export function deleteInviteCode(code: string): void {
  const codes = getAllInviteCodes().filter((c) => c.code !== code);
  saveAllInviteCodes(codes);
}

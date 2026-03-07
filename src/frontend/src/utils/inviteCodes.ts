/**
 * Invite code management utility
 * Stores invite codes and redemption state in localStorage
 * so they persist across sessions and are shareable via URL.
 */

const STORAGE_KEY = "physioassist_invite_codes";
const REDEEMED_KEY = "physioassist_redeemed_codes";

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

export function redeemInviteCode(inputCode: string): RedemptionResult {
  const normalized = inputCode.trim().toUpperCase();
  const codes = getAllInviteCodes();
  const idx = codes.findIndex((c) => c.code === normalized);

  if (idx === -1) {
    return {
      success: false,
      message: "Invalid invite code. Please check and try again.",
    };
  }

  if (codes[idx].used) {
    return {
      success: false,
      message:
        "This invite code has already been used. Request a new one from your administrator.",
    };
  }

  // Mark as used
  codes[idx] = { ...codes[idx], used: true };
  saveAllInviteCodes(codes);

  // Store redemption in sessionStorage so App.tsx can read it
  try {
    const redeemed = JSON.parse(
      sessionStorage.getItem(REDEEMED_KEY) || "[]",
    ) as string[];
    if (!redeemed.includes(normalized)) {
      redeemed.push(normalized);
      sessionStorage.setItem(REDEEMED_KEY, JSON.stringify(redeemed));
    }
  } catch {
    /* ignore */
  }

  return { success: true, message: "Access granted!" };
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
    if (redeemed.length === 0) return false;

    const codes = getAllInviteCodes();
    // Any code in the session list that exists in our store (used or not) is valid
    return redeemed.some((r) => codes.some((c) => c.code === r));
  } catch {
    return false;
  }
}

// ── Deletion ─────────────────────────────────────────────────────────────────

export function deleteInviteCode(code: string): void {
  const codes = getAllInviteCodes().filter((c) => c.code !== code);
  saveAllInviteCodes(codes);
}

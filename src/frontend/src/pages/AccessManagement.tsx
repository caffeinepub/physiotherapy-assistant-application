import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { Principal } from "@icp-sdk/core/principal";
import {
  AlertTriangle,
  Check,
  Copy,
  Link2,
  Loader2,
  Plus,
  Search,
  Shield,
  ShieldBan,
  ShieldCheck,
  Trash2,
  UserX,
  Users,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useCallback, useEffect, useRef, useState } from "react";
import { UserRole } from "../backend";
import type { UserEntry } from "../backend";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import {
  useAssignUserRole,
  useGetAllUsers,
  useIsCallerAdmin,
  useRemoveUser,
} from "../hooks/useQueries";
import {
  type InviteCode,
  createInviteCode,
  deleteInviteCode,
  getAllInviteCodes,
} from "../utils/inviteCodes";

// ── Helpers ────────────────────────────────────────────────────────────────

function maskPrincipal(principal: Principal): string {
  const str = principal.toString();
  if (str.length <= 14) return str;
  return `${str.slice(0, 8)}...${str.slice(-4)}`;
}

function getUserDisplayName(entry: UserEntry): string {
  return entry.profile?.name?.trim() || "Unnamed User";
}

function getRoleBadge(role: UserRole) {
  switch (role) {
    case UserRole.admin:
      return {
        label: "Admin",
        className:
          "border-[oklch(0.72_0.17_195/0.5)] bg-[oklch(0.72_0.17_195/0.12)] text-[oklch(0.82_0.14_195)]",
        glow: "0 0 12px oklch(0.72 0.17 195 / 0.3)",
      };
    case UserRole.user:
      return {
        label: "Active",
        className:
          "border-[oklch(0.68_0.18_155/0.5)] bg-[oklch(0.68_0.18_155/0.12)] text-[oklch(0.78_0.15_155)]",
        glow: "0 0 12px oklch(0.68 0.18 155 / 0.3)",
      };
    case UserRole.guest:
      return {
        label: "Blocked",
        className:
          "border-[oklch(0.62_0.22_25/0.5)] bg-[oklch(0.62_0.22_25/0.12)] text-[oklch(0.72_0.18_25)]",
        glow: "0 0 12px oklch(0.62 0.22 25 / 0.3)",
      };
    default:
      return {
        label: "Unknown",
        className:
          "border-[oklch(0.55_0.05_240/0.3)] bg-[oklch(0.55_0.05_240/0.08)] text-muted-foreground",
        glow: "none",
      };
  }
}

// ── Sub-components ─────────────────────────────────────────────────────────

function AccessDeniedScreen() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="flex flex-col items-center gap-5 text-center"
      >
        <div
          className="flex h-20 w-20 items-center justify-center rounded-2xl"
          style={{
            background: "oklch(0.62 0.22 25 / 0.1)",
            border: "1px solid oklch(0.62 0.22 25 / 0.3)",
            boxShadow: "0 0 32px oklch(0.62 0.22 25 / 0.2)",
          }}
        >
          <ShieldBan className="h-9 w-9 text-[oklch(0.72_0.18_25)]" />
        </div>
        <div>
          <h2 className="font-display text-2xl font-bold text-foreground">
            Access Denied
          </h2>
          <p className="mt-2 max-w-sm text-sm text-muted-foreground">
            You need administrator privileges to view this page. Contact your
            system admin for access.
          </p>
        </div>
      </motion.div>
    </div>
  );
}

interface UserRowProps {
  entry: UserEntry;
  index: number;
  isCurrentUser: boolean;
  onBlock: (principal: Principal) => void;
  onRestore: (principal: Principal) => void;
  onRemove: (entry: UserEntry) => void;
  isUpdating: boolean;
}

function UserRow({
  entry,
  index,
  isCurrentUser,
  onBlock,
  onRestore,
  onRemove,
  isUpdating,
}: UserRowProps) {
  const roleBadge = getRoleBadge(entry.role);
  const isAdmin = entry.role === UserRole.admin;
  const isBlocked = entry.role === UserRole.guest;

  return (
    <motion.div
      data-ocid={`access.user.item.${index}`}
      initial={{ opacity: 0, x: -12 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.35, delay: index * 0.06 }}
      className={`group relative flex flex-col gap-3 rounded-2xl p-4 transition-all duration-200 sm:flex-row sm:items-center sm:gap-4 ${
        isCurrentUser
          ? "border border-[oklch(0.72_0.17_195/0.3)] bg-[oklch(0.72_0.17_195/0.06)]"
          : "border border-[oklch(0.5_0.08_240/0.2)] bg-[oklch(0.17_0.03_240/0.7)] hover:border-[oklch(0.72_0.17_195/0.2)] hover:bg-[oklch(0.19_0.04_240/0.8)]"
      }`}
      style={{
        backdropFilter: "blur(12px)",
        boxShadow: isCurrentUser
          ? "0 0 24px oklch(0.72 0.17 195 / 0.12), 0 4px 16px oklch(0.05 0.05 240 / 0.4)"
          : "0 4px 16px oklch(0.05 0.05 240 / 0.3)",
      }}
    >
      {/* Avatar + name */}
      <div className="flex flex-1 items-center gap-3">
        <div
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl font-display text-sm font-bold"
          style={{
            background: isAdmin
              ? "oklch(0.72 0.17 195 / 0.15)"
              : isBlocked
                ? "oklch(0.62 0.22 25 / 0.12)"
                : "oklch(0.68 0.18 155 / 0.12)",
            border: isAdmin
              ? "1px solid oklch(0.72 0.17 195 / 0.35)"
              : isBlocked
                ? "1px solid oklch(0.62 0.22 25 / 0.3)"
                : "1px solid oklch(0.68 0.18 155 / 0.3)",
            color: isAdmin
              ? "oklch(0.82 0.14 195)"
              : isBlocked
                ? "oklch(0.72 0.18 25)"
                : "oklch(0.78 0.15 155)",
          }}
        >
          {getUserDisplayName(entry).charAt(0).toUpperCase()}
        </div>
        <div className="min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-semibold text-foreground text-sm">
              {getUserDisplayName(entry)}
            </span>
            {isCurrentUser && (
              <span className="rounded-full bg-[oklch(0.72_0.17_195/0.15)] px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-[oklch(0.82_0.14_195)]">
                You
              </span>
            )}
          </div>
          {entry.profile?.credentials && (
            <p className="text-xs text-muted-foreground truncate">
              {entry.profile.credentials}
              {entry.profile.specialization
                ? ` · ${entry.profile.specialization}`
                : ""}
            </p>
          )}
          <p className="text-xs text-muted-foreground/60 font-mono mt-0.5">
            {maskPrincipal(entry.principal)}
          </p>
        </div>
      </div>

      {/* Role badge */}
      <div className="flex items-center gap-3">
        <Badge
          variant="outline"
          className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-semibold ${roleBadge.className}`}
          style={{ boxShadow: roleBadge.glow }}
        >
          {roleBadge.label}
        </Badge>

        {/* Action buttons */}
        {!isAdmin && !isCurrentUser && (
          <div className="flex items-center gap-2">
            {isBlocked ? (
              <Button
                data-ocid={`access.restore_button.${index}`}
                size="sm"
                variant="outline"
                disabled={isUpdating}
                onClick={() => onRestore(entry.principal)}
                className="h-8 rounded-xl border-[oklch(0.68_0.18_155/0.4)] bg-[oklch(0.68_0.18_155/0.08)] text-[oklch(0.78_0.15_155)] hover:bg-[oklch(0.68_0.18_155/0.18)] hover:border-[oklch(0.68_0.18_155/0.6)] gap-1.5 text-xs font-semibold"
                style={{
                  boxShadow: "0 0 12px oklch(0.68 0.18 155 / 0.15)",
                  transition: "all 0.2s ease",
                }}
              >
                {isUpdating ? (
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                ) : (
                  <ShieldCheck className="h-3.5 w-3.5" />
                )}
                Restore
              </Button>
            ) : (
              <Button
                data-ocid={`access.block_button.${index}`}
                size="sm"
                variant="outline"
                disabled={isUpdating}
                onClick={() => onBlock(entry.principal)}
                className="h-8 rounded-xl border-[oklch(0.72_0.18_60/0.4)] bg-[oklch(0.72_0.18_60/0.08)] text-[oklch(0.82_0.15_60)] hover:bg-[oklch(0.72_0.18_60/0.18)] hover:border-[oklch(0.72_0.18_60/0.6)] gap-1.5 text-xs font-semibold"
                style={{
                  boxShadow: "0 0 12px oklch(0.72 0.18 60 / 0.15)",
                  transition: "all 0.2s ease",
                }}
              >
                {isUpdating ? (
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                ) : (
                  <ShieldBan className="h-3.5 w-3.5" />
                )}
                Block
              </Button>
            )}
            <Button
              data-ocid={`access.remove_button.${index}`}
              size="sm"
              variant="outline"
              disabled={isUpdating}
              onClick={() => onRemove(entry)}
              className="h-8 rounded-xl border-[oklch(0.62_0.22_25/0.4)] bg-[oklch(0.62_0.22_25/0.08)] text-[oklch(0.72_0.18_25)] hover:bg-[oklch(0.62_0.22_25/0.18)] hover:border-[oklch(0.62_0.22_25/0.6)] gap-1.5 text-xs font-semibold"
              style={{
                boxShadow: "0 0 12px oklch(0.62 0.22 25 / 0.15)",
                transition: "all 0.2s ease",
              }}
            >
              <Trash2 className="h-3.5 w-3.5" />
              Remove
            </Button>
          </div>
        )}
      </div>
    </motion.div>
  );
}

// ── Invite Link Row ────────────────────────────────────────────────────────

interface InviteLinkRowProps {
  invite: InviteCode;
  index: number;
  onDelete: (code: string) => void;
}

function InviteLinkRow({ invite, index, onDelete }: InviteLinkRowProps) {
  const [copied, setCopied] = useState(false);

  // Build invite URL from origin + pathname (strips any existing query params)
  const inviteUrl = `${window.location.origin}${window.location.pathname.replace(/\/$/, "")}?code=${invite.code}`;

  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(inviteUrl).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }, [inviteUrl]);

  const truncatedCode =
    invite.code.length > 8 ? `${invite.code.slice(0, 8)}...` : invite.code;

  return (
    <motion.div
      data-ocid={`invite.item.${index}`}
      initial={{ opacity: 0, x: -12 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 12 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      className="group flex flex-col gap-3 rounded-2xl border border-[oklch(0.5_0.08_240/0.2)] bg-[oklch(0.17_0.03_240/0.7)] p-4 transition-all duration-200 hover:border-[oklch(0.72_0.17_195/0.2)] hover:bg-[oklch(0.19_0.04_240/0.8)] sm:flex-row sm:items-center sm:gap-4"
      style={{
        backdropFilter: "blur(12px)",
        boxShadow: "0 4px 16px oklch(0.05 0.05 240 / 0.3)",
      }}
    >
      {/* Icon + code */}
      <div className="flex flex-1 items-center gap-3">
        <div
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl"
          style={{
            background: invite.used
              ? "oklch(0.55 0.05 240 / 0.12)"
              : "oklch(0.72 0.17 195 / 0.12)",
            border: invite.used
              ? "1px solid oklch(0.55 0.05 240 / 0.25)"
              : "1px solid oklch(0.72 0.17 195 / 0.3)",
            boxShadow: invite.used
              ? "none"
              : "0 0 12px oklch(0.72 0.17 195 / 0.15)",
          }}
        >
          <Link2
            className="h-5 w-5"
            style={{
              color: invite.used
                ? "oklch(0.55 0.05 240)"
                : "oklch(0.72 0.17 195)",
            }}
          />
        </div>
        <div className="min-w-0">
          {invite.recipientName ? (
            <p className="text-sm font-bold text-foreground truncate">
              {invite.recipientName}
            </p>
          ) : null}
          <p className="font-mono text-xs font-semibold text-muted-foreground">
            {truncatedCode}
          </p>
          <p className="mt-0.5 truncate text-xs text-muted-foreground/60">
            {`${inviteUrl
              .replace("https://", "")
              .replace("http://", "")
              .slice(0, 40)}...`}
          </p>
          <p className="mt-0.5 text-xs text-muted-foreground/40">
            Created {new Date(invite.createdAt).toLocaleDateString()}
          </p>
        </div>
      </div>

      {/* Status badge + actions */}
      <div className="flex items-center gap-3">
        <Badge
          variant="outline"
          className={
            invite.used
              ? "shrink-0 rounded-full px-2.5 py-1 text-xs font-semibold border-[oklch(0.55_0.05_240/0.3)] bg-[oklch(0.55_0.05_240/0.08)] text-muted-foreground"
              : "shrink-0 rounded-full px-2.5 py-1 text-xs font-semibold border-[oklch(0.68_0.18_155/0.5)] bg-[oklch(0.68_0.18_155/0.12)] text-[oklch(0.78_0.15_155)]"
          }
          style={{
            boxShadow: invite.used
              ? "none"
              : "0 0 12px oklch(0.68 0.18 155 / 0.3)",
          }}
        >
          {invite.used ? "Used" : "Available"}
        </Badge>

        {!invite.used && (
          <Button
            data-ocid={`invite.copy_button.${index}`}
            size="sm"
            variant="outline"
            onClick={handleCopy}
            className="h-8 gap-1.5 rounded-xl border-[oklch(0.72_0.17_195/0.4)] bg-[oklch(0.72_0.17_195/0.08)] text-[oklch(0.82_0.14_195)] text-xs font-semibold hover:bg-[oklch(0.72_0.17_195/0.18)] hover:border-[oklch(0.72_0.17_195/0.6)]"
            style={{
              boxShadow: "0 0 12px oklch(0.72 0.17 195 / 0.15)",
              transition: "all 0.2s ease",
            }}
          >
            {copied ? (
              <Check className="h-3.5 w-3.5" />
            ) : (
              <Copy className="h-3.5 w-3.5" />
            )}
            {copied ? "Copied!" : "Copy Link"}
          </Button>
        )}

        <Button
          data-ocid={`invite.delete_button.${index}`}
          size="sm"
          variant="outline"
          onClick={() => onDelete(invite.code)}
          className="h-8 gap-1.5 rounded-xl border-[oklch(0.62_0.22_25/0.4)] bg-[oklch(0.62_0.22_25/0.08)] text-[oklch(0.72_0.18_25)] text-xs font-semibold hover:bg-[oklch(0.62_0.22_25/0.18)] hover:border-[oklch(0.62_0.22_25/0.6)]"
          style={{
            boxShadow: "0 0 12px oklch(0.62 0.22 25 / 0.15)",
            transition: "all 0.2s ease",
          }}
        >
          <Trash2 className="h-3.5 w-3.5" />
          Delete
        </Button>
      </div>
    </motion.div>
  );
}

// ── Invite Links Tab ───────────────────────────────────────────────────────

function InviteLinksTab() {
  const [codes, setCodes] = useState<InviteCode[]>(() => getAllInviteCodes());
  const [isGenerating, setIsGenerating] = useState(false);
  const [recipientName, setRecipientName] = useState("");

  const refreshCodes = useCallback(() => {
    setCodes(getAllInviteCodes());
  }, []);

  const handleGenerate = async () => {
    if (!recipientName.trim()) return;
    setIsGenerating(true);
    await new Promise((r) => setTimeout(r, 400));
    createInviteCode(recipientName.trim());
    refreshCodes();
    setRecipientName("");
    setIsGenerating(false);
  };

  const handleDelete = useCallback(
    (code: string) => {
      deleteInviteCode(code);
      refreshCodes();
    },
    [refreshCodes],
  );

  const available = codes.filter((c) => !c.used).length;
  const usedCount = codes.filter((c) => c.used).length;

  return (
    <div className="space-y-6">
      {/* Generate invite — name + button row */}
      <div
        className="rounded-2xl p-5 space-y-4"
        style={{
          background: "oklch(0.72 0.17 195 / 0.05)",
          border: "1px solid oklch(0.72 0.17 195 / 0.2)",
          boxShadow: "0 0 24px oklch(0.72 0.17 195 / 0.08)",
        }}
      >
        <p className="text-xs font-semibold uppercase tracking-widest text-[oklch(0.80_0.12_195)]">
          Generate New Invite Link
        </p>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="relative flex-1">
            <Input
              data-ocid="invite.recipient_name.input"
              placeholder="Recipient name (e.g. Dr. Ahmed)"
              value={recipientName}
              onChange={(e) => setRecipientName(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleGenerate()}
              className="rounded-xl border-[oklch(0.72_0.17_195/0.3)] bg-[oklch(0.16_0.03_242/0.8)] text-sm placeholder:text-muted-foreground/50 focus-visible:ring-[oklch(0.72_0.17_195/0.4)]"
              style={{
                boxShadow:
                  "0 2px 4px oklch(0.05 0.05 240 / 0.4) inset, 0 1px 0 oklch(0.9 0.02 220 / 0.06)",
              }}
            />
          </div>
          <Button
            data-ocid="invite.generate_button"
            onClick={handleGenerate}
            disabled={isGenerating || !recipientName.trim()}
            className="gap-2 rounded-xl bg-[oklch(0.72_0.17_195)] px-5 py-2 text-sm font-semibold text-[oklch(0.10_0.03_240)] hover:bg-[oklch(0.78_0.18_195)] btn-glow disabled:opacity-50"
            style={{
              boxShadow:
                "0 0 20px oklch(0.72 0.17 195 / 0.35), 0 4px 16px oklch(0.05 0.05 240 / 0.4)",
            }}
          >
            {isGenerating ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Plus className="h-4 w-4" />
            )}
            Generate Link
          </Button>
        </div>
        <p className="text-xs text-muted-foreground/60">
          Enter the recipient's name first — it will appear on the invite so you
          know who it's for.
        </p>
      </div>

      {/* Stats row */}
      <div className="flex items-center gap-4">
        <div className="rounded-xl border border-[oklch(0.72_0.17_195/0.2)] bg-[oklch(0.72_0.17_195/0.08)] px-3 py-1.5 text-xs font-semibold text-[oklch(0.80_0.12_195)]">
          {available} Available
        </div>
        <div className="rounded-xl border border-[oklch(0.55_0.05_240/0.2)] bg-[oklch(0.55_0.05_240/0.08)] px-3 py-1.5 text-xs font-semibold text-muted-foreground">
          {usedCount} Used
        </div>
      </div>

      {/* Code list */}
      <div data-ocid="invite.list" className="flex flex-col gap-3">
        <AnimatePresence>
          {codes.length === 0 ? (
            <motion.div
              data-ocid="invite.empty_state"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col items-center gap-4 py-16 text-center"
            >
              <div
                className="flex h-16 w-16 items-center justify-center rounded-2xl"
                style={{
                  background: "oklch(0.72 0.17 195 / 0.08)",
                  border: "1px solid oklch(0.72 0.17 195 / 0.2)",
                }}
              >
                <Link2 className="h-7 w-7 text-muted-foreground" />
              </div>
              <div>
                <p className="font-semibold text-foreground">
                  No invite links yet
                </p>
                <p className="mt-1 text-sm text-muted-foreground">
                  Generate your first invite link to start onboarding clinicians
                </p>
              </div>
            </motion.div>
          ) : (
            codes
              .slice()
              .sort((a, b) => b.createdAt - a.createdAt)
              .map((invite, idx) => (
                <InviteLinkRow
                  key={invite.code}
                  invite={invite}
                  index={idx + 1}
                  onDelete={handleDelete}
                />
              ))
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

// ── Main Page ──────────────────────────────────────────────────────────────

export default function AccessManagement() {
  const { identity } = useInternetIdentity();
  const { data: isAdmin, isLoading: adminLoading } = useIsCallerAdmin();
  const { data: users, isLoading: usersLoading } = useGetAllUsers();
  const assignRole = useAssignUserRole();
  const removeUser = useRemoveUser();

  const [search, setSearch] = useState("");
  const [pendingRemove, setPendingRemove] = useState<UserEntry | null>(null);
  const [updatingPrincipal, setUpdatingPrincipal] = useState<string | null>(
    null,
  );

  const pageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (pageRef.current) {
      pageRef.current.classList.add("section-visible");
    }
  }, []);

  const currentPrincipal = identity?.getPrincipal().toString();

  const filteredUsers = (users || []).filter((u) => {
    const name = getUserDisplayName(u).toLowerCase();
    const principal = u.principal.toString().toLowerCase();
    const q = search.toLowerCase();
    return name.includes(q) || principal.includes(q);
  });

  const handleBlock = async (principal: Principal) => {
    setUpdatingPrincipal(principal.toString());
    try {
      await assignRole.mutateAsync({ user: principal, role: UserRole.guest });
    } finally {
      setUpdatingPrincipal(null);
    }
  };

  const handleRestore = async (principal: Principal) => {
    setUpdatingPrincipal(principal.toString());
    try {
      await assignRole.mutateAsync({ user: principal, role: UserRole.user });
    } finally {
      setUpdatingPrincipal(null);
    }
  };

  const handleConfirmRemove = async () => {
    if (!pendingRemove) return;
    setUpdatingPrincipal(pendingRemove.principal.toString());
    try {
      await removeUser.mutateAsync(pendingRemove.principal);
    } finally {
      setUpdatingPrincipal(null);
      setPendingRemove(null);
    }
  };

  if (adminLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div
            className="flex h-14 w-14 items-center justify-center rounded-2xl"
            style={{
              background: "oklch(0.72 0.17 195 / 0.1)",
              border: "1px solid oklch(0.72 0.17 195 / 0.25)",
              boxShadow: "0 0 24px oklch(0.72 0.17 195 / 0.2)",
            }}
          >
            <Loader2 className="h-6 w-6 animate-spin text-[oklch(0.72_0.17_195)]" />
          </div>
          <p className="text-sm text-muted-foreground">Verifying access...</p>
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return <AccessDeniedScreen />;
  }

  const totalUsers = users?.length || 0;
  const activeUsers =
    users?.filter((u) => u.role === UserRole.user).length || 0;
  const blockedUsers =
    users?.filter((u) => u.role === UserRole.guest).length || 0;
  const adminUsers =
    users?.filter((u) => u.role === UserRole.admin).length || 0;

  return (
    <div
      data-ocid="access.page"
      className="section-hidden relative min-h-[calc(100vh-8rem)]"
      ref={pageRef}
    >
      {/* Background decoration */}
      <div className="pointer-events-none absolute inset-0 bg-grid opacity-30" />

      {/* Ambient orbs */}
      <div
        className="pointer-events-none absolute right-0 top-0 h-80 w-80 rounded-full blur-3xl opacity-20"
        style={{
          background:
            "radial-gradient(circle, oklch(0.72 0.17 195 / 0.6) 0%, transparent 70%)",
        }}
      />
      <div
        className="pointer-events-none absolute bottom-20 left-0 h-72 w-72 rounded-full blur-3xl opacity-15"
        style={{
          background:
            "radial-gradient(circle, oklch(0.62 0.22 25 / 0.4) 0%, transparent 70%)",
        }}
      />
      <div
        className="pointer-events-none absolute left-1/3 top-1/2 h-56 w-56 rounded-full blur-3xl opacity-10"
        style={{
          background:
            "radial-gradient(circle, oklch(0.68 0.2 250 / 0.5) 0%, transparent 70%)",
        }}
      />

      <div className="relative z-10 container mx-auto px-4 py-8">
        {/* Page header */}
        <div className="mb-8">
          <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-[oklch(0.72_0.17_195/0.25)] bg-[oklch(0.72_0.17_195/0.08)] px-3 py-1 text-xs font-semibold text-[oklch(0.80_0.12_195)]">
            <Shield className="h-3 w-3" />
            Admin Panel
          </div>
          <h1 className="font-display text-3xl font-bold tracking-tight text-foreground md:text-4xl">
            Access{" "}
            <span
              className="bg-clip-text text-transparent"
              style={{
                backgroundImage:
                  "linear-gradient(135deg, oklch(0.72 0.17 195) 0%, oklch(0.68 0.2 250) 100%)",
              }}
            >
              Management
            </span>
          </h1>
          <p className="mt-1 text-muted-foreground">
            Control user access, manage invite links, block or remove platform
            members
          </p>
        </div>

        {/* Stat tiles */}
        <div className="mb-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {[
            {
              label: "Total Users",
              value: totalUsers,
              color: "oklch(0.72 0.17 195)",
              bg: "oklch(0.72 0.17 195 / 0.1)",
              border: "oklch(0.72 0.17 195 / 0.25)",
            },
            {
              label: "Active",
              value: activeUsers,
              color: "oklch(0.68 0.18 155)",
              bg: "oklch(0.68 0.18 155 / 0.1)",
              border: "oklch(0.68 0.18 155 / 0.25)",
            },
            {
              label: "Blocked",
              value: blockedUsers,
              color: "oklch(0.72 0.18 25)",
              bg: "oklch(0.62 0.22 25 / 0.1)",
              border: "oklch(0.62 0.22 25 / 0.25)",
            },
            {
              label: "Admins",
              value: adminUsers,
              color: "oklch(0.80 0.14 195)",
              bg: "oklch(0.72 0.17 195 / 0.08)",
              border: "oklch(0.72 0.17 195 / 0.2)",
            },
          ].map((stat) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="rounded-2xl p-4"
              style={{
                background: stat.bg,
                border: `1px solid ${stat.border}`,
                boxShadow: `0 4px 16px oklch(0.05 0.05 240 / 0.4), 0 0 20px ${stat.bg}`,
              }}
            >
              <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                {stat.label}
              </p>
              <p
                className="mt-1 font-display text-3xl font-bold"
                style={{ color: stat.color }}
              >
                {stat.value}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Divider */}
        <div className="divider-glow mb-6" />

        {/* Tabs */}
        <Tabs defaultValue="users" data-ocid="access.tab">
          <TabsList className="mb-6 rounded-2xl border border-[oklch(0.5_0.08_240/0.2)] bg-[oklch(0.17_0.03_240/0.8)] p-1 backdrop-blur">
            <TabsTrigger
              value="users"
              data-ocid="access.users.tab"
              className="flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold data-[state=active]:bg-[oklch(0.72_0.17_195/0.15)] data-[state=active]:text-[oklch(0.82_0.14_195)] data-[state=active]:border data-[state=active]:border-[oklch(0.72_0.17_195/0.3)]"
            >
              <Users className="h-4 w-4" />
              Users
            </TabsTrigger>
            <TabsTrigger
              value="invites"
              data-ocid="access.invites.tab"
              className="flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold data-[state=active]:bg-[oklch(0.72_0.17_195/0.15)] data-[state=active]:text-[oklch(0.82_0.14_195)] data-[state=active]:border data-[state=active]:border-[oklch(0.72_0.17_195/0.3)]"
            >
              <Link2 className="h-4 w-4" />
              Invite Links
            </TabsTrigger>
          </TabsList>

          {/* Users tab content */}
          <TabsContent value="users">
            {/* Search */}
            <div className="mb-4 relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                data-ocid="access.search_input"
                placeholder="Search by name or principal..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9 rounded-xl border-[oklch(0.5_0.08_240/0.25)] bg-[oklch(0.16_0.03_242/0.8)] text-sm focus-visible:ring-[oklch(0.72_0.17_195/0.4)]"
                style={{
                  boxShadow:
                    "0 2px 4px oklch(0.05 0.05 240 / 0.4) inset, 0 1px 0 oklch(0.9 0.02 220 / 0.06)",
                }}
              />
            </div>

            {/* User list */}
            <div data-ocid="access.users.table" className="flex flex-col gap-3">
              {usersLoading ? (
                <div
                  data-ocid="access.loading_state"
                  className="flex items-center justify-center py-16"
                >
                  <div className="flex flex-col items-center gap-3">
                    <Loader2
                      className="h-8 w-8 animate-spin"
                      style={{ color: "oklch(0.72 0.17 195)" }}
                    />
                    <p className="text-sm text-muted-foreground">
                      Loading users...
                    </p>
                  </div>
                </div>
              ) : filteredUsers.length === 0 ? (
                <div
                  data-ocid="access.empty_state"
                  className="flex flex-col items-center gap-4 py-16 text-center"
                >
                  <div
                    className="flex h-16 w-16 items-center justify-center rounded-2xl"
                    style={{
                      background: "oklch(0.72 0.17 195 / 0.08)",
                      border: "1px solid oklch(0.72 0.17 195 / 0.2)",
                    }}
                  >
                    <UserX className="h-7 w-7 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">
                      No users found
                    </p>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {search
                        ? "Try a different search query"
                        : "No users have registered yet"}
                    </p>
                  </div>
                </div>
              ) : (
                <AnimatePresence>
                  {filteredUsers.map((entry, idx) => (
                    <UserRow
                      key={entry.principal.toString()}
                      entry={entry}
                      index={idx + 1}
                      isCurrentUser={
                        entry.principal.toString() === currentPrincipal
                      }
                      onBlock={handleBlock}
                      onRestore={handleRestore}
                      onRemove={setPendingRemove}
                      isUpdating={
                        updatingPrincipal === entry.principal.toString()
                      }
                    />
                  ))}
                </AnimatePresence>
              )}
            </div>
          </TabsContent>

          {/* Invite Links tab content */}
          <TabsContent value="invites">
            <InviteLinksTab />
          </TabsContent>
        </Tabs>
      </div>

      {/* Remove confirmation dialog */}
      <Dialog
        open={!!pendingRemove}
        onOpenChange={(open) => !open && setPendingRemove(null)}
      >
        <DialogContent
          data-ocid="access.remove.dialog"
          className="max-w-sm rounded-2xl border-[oklch(0.62_0.22_25/0.35)] bg-[oklch(0.15_0.03_240/0.97)] backdrop-blur-2xl"
          style={{
            boxShadow:
              "0 0 60px oklch(0.62 0.22 25 / 0.15), 0 24px 64px oklch(0.05 0.05 240 / 0.6)",
          }}
        >
          <DialogHeader>
            <div
              className="mb-3 flex h-12 w-12 items-center justify-center rounded-2xl self-start"
              style={{
                background: "oklch(0.62 0.22 25 / 0.12)",
                border: "1px solid oklch(0.62 0.22 25 / 0.35)",
                boxShadow: "0 0 20px oklch(0.62 0.22 25 / 0.25)",
              }}
            >
              <AlertTriangle className="h-5 w-5 text-[oklch(0.72_0.18_25)]" />
            </div>
            <DialogTitle className="font-display text-lg font-bold text-foreground">
              Remove User
            </DialogTitle>
            <DialogDescription className="text-sm text-muted-foreground">
              Are you sure you want to permanently remove{" "}
              <span className="font-semibold text-foreground">
                {pendingRemove ? getUserDisplayName(pendingRemove) : ""}
              </span>{" "}
              from the platform? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="mt-2 flex gap-2">
            <Button
              data-ocid="access.remove.cancel_button"
              variant="outline"
              onClick={() => setPendingRemove(null)}
              className="flex-1 rounded-xl border-[oklch(0.5_0.08_240/0.3)] bg-[oklch(0.2_0.03_240/0.5)] hover:bg-[oklch(0.25_0.04_240/0.8)]"
            >
              Cancel
            </Button>
            <Button
              data-ocid="access.remove.confirm_button"
              onClick={handleConfirmRemove}
              disabled={removeUser.isPending}
              className="flex-1 rounded-xl bg-[oklch(0.62_0.22_25)] text-white hover:bg-[oklch(0.66_0.24_25)] gap-2"
              style={{
                boxShadow:
                  "0 0 20px oklch(0.62 0.22 25 / 0.35), 0 4px 16px oklch(0.05 0.05 240 / 0.4)",
              }}
            >
              {removeUser.isPending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Trash2 className="h-4 w-4" />
              )}
              Remove User
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

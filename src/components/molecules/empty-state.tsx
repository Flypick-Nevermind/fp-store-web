import Link from "next/link";
import type React from "react";
import { Button } from "@/components/atoms";

interface EmptyStateProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  actionText?: string;
  actionHref?: string;
  onAction?: () => void;
}

export function EmptyState({
  icon,
  title,
  description,
  actionText,
  actionHref,
  onAction,
}: EmptyStateProps) {
  return (
    <div className="bg-white border-2 border-[#1A1A24] shadow-[6px_6px_0px_0px_#2323FF] p-10 text-center space-y-4">
      <div className="w-16 h-16 rounded-full bg-[#FFF8E1] border-2 border-[#2323FF] mx-auto flex items-center justify-center text-[#2323FF]">
        {icon}
      </div>
      <div className="space-y-1">
        <h2 className="font-mono text-lg font-bold uppercase text-[#1A1A24]">
          {title}
        </h2>
        <p className="text-xs text-[#1A1A24]/70 max-w-md mx-auto">
          {description}
        </p>
      </div>
      {actionText && (
        <div className="pt-2">
          {actionHref ? (
            <Link href={actionHref}>
              <Button variant="neon" size="lg">
                {actionText}
              </Button>
            </Link>
          ) : (
            <Button variant="neon" size="lg" onClick={onAction}>
              {actionText}
            </Button>
          )}
        </div>
      )}
    </div>
  );
}

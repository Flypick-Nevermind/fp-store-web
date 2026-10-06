import { cn } from "@/lib/utils";

export function TicketPerforatedDivider({
  orientation = "horizontal",
  className,
}: {
  orientation?: "horizontal" | "vertical";
  className?: string;
}) {
  if (orientation === "vertical") {
    return (
      <div
        className={cn(
          "relative w-px border-r-2 border-dashed border-[#1A1A24]/30 my-2",
          className,
        )}
      >
        <div className="absolute -top-3 -right-2 w-4 h-4 rounded-full bg-[#FFF8E1] border-2 border-[#2323FF]" />
        <div className="absolute -bottom-3 -right-2 w-4 h-4 rounded-full bg-[#FFF8E1] border-2 border-[#2323FF]" />
      </div>
    );
  }

  return (
    <div
      className={cn(
        "relative h-px border-b-2 border-dashed border-[#1A1A24]/30 my-4 mx-2",
        className,
      )}
    >
      <div className="absolute -left-4 -top-2 w-4 h-4 rounded-full bg-[#FFF8E1] border-2 border-[#2323FF]" />
      <div className="absolute -right-4 -top-2 w-4 h-4 rounded-full bg-[#FFF8E1] border-2 border-[#2323FF]" />
    </div>
  );
}

import { cn } from "@/lib/utils";

interface FlypickLogoIconProps {
  className?: string;
  size?: number;
}

export function FlypickLogoIcon({
  className,
  size = 36,
}: FlypickLogoIconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("shrink-0", className)}
      aria-label="FLYPICK Icon"
    >
      <defs>
        <linearGradient
          id="flypick-f-grad"
          x1="15"
          y1="10"
          x2="85"
          y2="90"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0%" stopColor="#00F0FF" />
          <stop offset="45%" stopColor="#0099FF" />
          <stop offset="100%" stopColor="#1035D0" />
        </linearGradient>
        <filter
          id="flypick-shadow"
          x="-10%"
          y="-10%"
          width="130%"
          height="130%"
        >
          <feDropShadow
            dx="2"
            dy="4"
            stdDeviation="3"
            floodColor="#1035D0"
            floodOpacity="0.25"
          />
        </filter>
      </defs>

      {/* Modern stylized geometric F with wings */}
      <g filter="url(#flypick-shadow)">
        {/* Main stem & top wing of F */}
        <path
          d="M26 18C26 14.6863 28.6863 12 32 12H76C79.866 12 82.5 15.8 81.3 19.5L78.5 28C77.7 30.4 75.5 32 73 32H45L42.5 42H65C68.5 42 71 45.2 70 48.6L67.5 56.5C66.8 58.7 64.8 60.2 62.5 60.2H38L29 88.5C28.2 91 25.8 92.5 23.2 92.2C20.3 91.8 18.5 88.8 19.4 86L35.5 35L26 18Z"
          fill="url(#flypick-f-grad)"
        />
        {/* Top aerodynamic wing notch accent */}
        <path
          d="M50 12H76C79.866 12 82.5 15.8 81.3 19.5L78.5 28C77.7 30.4 75.5 32 73 32H45L50 12Z"
          fill="#00F0FF"
          fillOpacity="0.85"
        />
      </g>
    </svg>
  );
}

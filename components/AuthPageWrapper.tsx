import AnimatedBackground from "@/components/AnimatedBackground";

interface AuthPageWrapperProps {
  children: React.ReactNode;
}

export default function AuthPageWrapper({ children }: AuthPageWrapperProps) {
  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden">
      {/* Premium gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#1a2a4a] via-[#2d1f4a] to-[#3d1a5f]"></div>

      {/* Radial glow effect */}
      <div className="absolute inset-0 bg-gradient-radial from-purple-600/20 via-transparent to-transparent"></div>

      {/* Animated particles */}
      <AnimatedBackground />

      {/* Content */}
      <div className="relative z-10 w-full px-4">
        {children}
      </div>
    </div>
  );
}

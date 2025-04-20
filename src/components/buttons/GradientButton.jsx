import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const GradientButton = React.forwardRef(
  (
    {
      children,
      className,
      variant = "default",
      size = "default",
      theme = "teal",
      glitchOnHover = true,
      ...props
    },
    ref
  ) => {
    const [isGlitching, setIsGlitching] = useState(false);

    useEffect(() => {
      if (isGlitching) {
        const timer = setTimeout(() => {
          setIsGlitching(false);
        }, 500);
        return () => clearTimeout(timer);
      }
    }, [isGlitching]);

    const themes = {
      teal: {
        bg: "bg-[#1a0b2e45]",
        border: "border-teal-500/70",
        text: "text-teal-300",
        glow: "teal-500",
        grid: "rgba(20, 184, 166, 0.5)",
        rgbColor: "20, 184, 166", 
      },
      yellow: {
        bg: "bg-[#2e2a0b]",              
        border: "border-yellow-500/70",
        text: "text-yellow-300",
        glow: "yellow-500",
        grid: "rgba(234, 179, 8, 0.5)",   
        rgbColor: "234, 179, 8",          
      },
      blue: {                             
        bg: "bg-[#0b1a2e]", 
        border: "border-blue-500/70",     
        text: "text-blue-300",            
        glow: "blue-500",                 
        grid: "rgba(59, 130, 246, 0.5)",
        rgbColor: "59, 130, 246", 
      },
      cyan: {                             
        bg: "bg-[#0b2e2e]", 
        border: "border-cyan-500/70",     
        text: "text-cyan-300",            
        glow: "cyan-500",                 
        grid: "rgba(6, 182, 212, 0.5)",
        rgbColor: "6, 182, 212", 
      },
      rose: {
        bg: "bg-[#2e0b1a]",
        border: "border-rose-500/70",
        text: "text-rose-300",
        glow: "rose-500",
        grid: "rgba(244, 63, 94, 0.5)",
        rgbColor: "244, 63, 94", 
      },
    };

    const selectedTheme = themes[theme] || themes.teal;

    const handleGlitch = () => {
      if (glitchOnHover && !isGlitching) {
        setIsGlitching(true);
      }
    };

    return (
      <Button
        ref={ref}
        variant="none"
        size={size}
        onMouseEnter={handleGlitch}
        onFocus={handleGlitch}
        className={cn(
          "cursor-pointer group relative overflow-hidden rounded-md font-medium transition-all duration-300",
          selectedTheme.bg, 
          selectedTheme.text,
          "border",
          selectedTheme.border,
          "focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900",
          "hover:shadow-[0_0_5px_rgba(var(--tw-shadow-color),0.2)]",
          isGlitching && "animate-glitch",
          className
        )}
        style={{
          "--tw-shadow-color": `rgba(${selectedTheme.rgbColor}, 0.5)`,
        }}
        {...props}
      >
        <span
          className="absolute inset-0 rounded-md opacity-0 group-hover:opacity-30 transition-opacity duration-500"
          style={{
            backgroundImage: `radial-gradient(${selectedTheme.grid} 0.6px, transparent 1px)`,
            backgroundSize: "4px 4px",
            backdropFilter: "blur(1px)",
          }}
        />

        <span
          className="absolute inset-0 opacity-20"
          style={{
            background: `radial-gradient(circle at center, rgba(${selectedTheme.rgbColor}, 0.3) 0%, transparent 70%)`,
          }}
        />

        <span
          className="absolute inset-0 rounded-md opacity-10 group-hover:opacity-30 transition-opacity duration-500"
          style={{
            boxShadow: `inset 0 0 15px 3px rgba(${selectedTheme.rgbColor}, 0.3)`,
            backgroundColor: `rgba(${selectedTheme.rgbColor}, 0.05)`,
          }}
        />

        <span
          className="absolute h-[2px] w-full left-0 top-0 opacity-0 group-hover:opacity-100 scan-line"
          style={{
            backgroundColor: `rgba(${selectedTheme.rgbColor}, 0.7)`,
            boxShadow: `0 0 8px 2px rgba(${selectedTheme.rgbColor}, 0.5)`,
          }}
        />

        <span
          className="absolute h-full w-[2px] left-0 top-0 opacity-0 group-hover:opacity-70 group-hover:animate-scan-right"
          style={{
            backgroundColor: `rgba(${selectedTheme.rgbColor}, 0.7)`,
            boxShadow: `0 0 8px 2px rgba(${selectedTheme.rgbColor}, 0.5)`,
          }}
        />

        <span
          className="absolute inset-0 rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-500"
          style={{
            boxShadow: `0 0 5px 1px rgba(${selectedTheme.rgbColor}, 0.5), 
                        inset 0 0 5px 1px rgba(${selectedTheme.rgbColor}, 0.5)`,
            pointerEvents: "none",
          }}
        />

        <span
          className="absolute inset-0 rounded-md opacity-5 mix-blend-overlay"
          style={{
            backgroundImage:
              "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 300 300' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E\")",
          }}
        />

        {isGlitching && (
          <span
            className="absolute inset-0 z-20 opacity-70"
            style={{
              backgroundImage: `
                repeating-linear-gradient(
                  to bottom,
                  transparent,
                  transparent 2px,
                  rgba(${selectedTheme.rgbColor}, 0.5) 5px,
                  rgba(${selectedTheme.rgbColor}, 0.5) 4px
                )
              `,
            }}
          />
        )}

        {/* Button content */}
        <span
          className={cn(
            "relative font-medium uppercase tracking-wider z-30 flex items-center justify-center",
            "text-shadow-sm",
            isGlitching && "animate-text-glitch"
          )}
          style={{
            textShadow: `0 0 5px rgba(${selectedTheme.rgbColor}, 0.7)`,
          }}
        >
          {children}
        </span>
      </Button>
    );
  }
);

GradientButton.displayName = "GradientButton";

export { GradientButton };

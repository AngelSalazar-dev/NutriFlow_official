'use client';

import Particles from "@tsparticles/react";
import { useTheme } from "next-themes";

export function ParticlesBackground() {
  const { resolvedTheme } = useTheme();

  const isDark = resolvedTheme === 'dark';
  const particleColor = '#10b981'; // Emerald 500
  const linkColor = '#10b981';

  return (
    <Particles
      id="tsparticles"
      className="absolute inset-0 z-0 opacity-50 mix-blend-screen"
      options={{
        fpsLimit: 120,
        interactivity: {
          detectsOn: "window",
          events: {
            onClick: {
              enable: true,
              mode: "push",
            },
            onHover: {
              enable: true,
              mode: "repulse",
            },
          },
          modes: {
            push: {
              quantity: 2,
            },
            repulse: {
              distance: 100,
              duration: 0.4,
            },
            grab: {
              distance: 150,
              links: {
                opacity: 0.8
              }
            }
          },
        },
        particles: {
          color: {
            value: particleColor,
          },
          links: {
            color: linkColor,
            distance: 150,
            enable: true,
            opacity: 0.3,
            width: 1,
            triangles: {
              enable: false,
            }
          },
          move: {
            direction: "none",
            enable: true,
            outModes: {
              default: "out",
            },
            random: true,
            speed: 0.8,
            straight: false,
          },
          number: {
            density: {
              enable: true,
              width: 800,
              height: 800
            },
            value: 60,
          },
          opacity: {
            value: { min: 0.1, max: 0.5 },
          },
          shape: {
            type: "circle",
          },
          size: {
            value: { min: 1, max: 3 },
          },
        },
        detectRetina: true,
        background: {
          color: "transparent"
        }
      }}
    />
  );
}

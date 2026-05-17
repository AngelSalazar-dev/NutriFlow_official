import { View, Text, DimensionValue } from 'react-native';
import Svg, { Circle } from 'react-native-svg';

interface MacroRingProps {
  consumed: number;
  goal: number;
  size?: number;
  strokeWidth?: number;
}

export function CalorieDoughnut({ consumed, goal, size = 180, strokeWidth = 16 }: MacroRingProps) {
  const safeGoal = goal || 2000;
  const percentage = Math.min(consumed / safeGoal, 1);
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const strokeDashoffset = circumference - percentage * circumference;

  return (
    <View className="items-center justify-center" style={{ width: size, height: size }}>
      <Svg width={size} height={size}>
        {/* Círculo de fondo */}
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="#262626"
          strokeWidth={strokeWidth}
          fill="transparent"
        />
        {/* Círculo de progreso activo */}
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="#10b981" // Verde de acento
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          fill="transparent"
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
        />
      </Svg>
      {/* Texto en medio de la dona */}
      <View className="absolute items-center justify-center">
        <Text className="text-3xl font-extrabold text-white tracking-tighter">
          {consumed.toLocaleString()}
        </Text>
        <Text className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mt-1">
          de {safeGoal.toLocaleString()} kcal
        </Text>
      </View>
    </View>
  );
}

interface ProgressBarProps {
  label: string;
  current: number;
  target: number;
  colorClass: string;
}

export function MacroProgressBar({ label, current, target, colorClass }: ProgressBarProps) {
  const safeTarget = target || 100;
  const pct = Math.min(current / safeTarget, 1);
  const percentageStr = `${Math.round(pct * 100)}%` as DimensionValue;

  return (
    <View className="space-y-2 mb-4 w-full">
      <View className="flex-row justify-between items-center text-sm">
        <Text className="font-semibold text-neutral-300">{label}</Text>
        <Text className="text-muted-foreground text-xs">
          <Text className="text-white font-extrabold">{current}g</Text> / {target}g
        </Text>
      </View>
      <View className="h-3 w-full bg-neutral-800 rounded-full overflow-hidden">
        <View
          className={`h-full rounded-full ${colorClass}`}
          style={{ width: percentageStr }}
        />
      </View>
    </View>
  );
}

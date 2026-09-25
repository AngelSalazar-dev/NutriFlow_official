'use client';

import { motion, type MotionProps } from 'framer-motion';
import { type ElementType } from 'react';

type MotionDivProps = MotionProps & React.ComponentPropsWithoutRef<'div'>;

export const MotionDiv = motion.div as React.FC<MotionDivProps>;
export const MotionButton = motion.button as React.FC<MotionProps & React.ComponentPropsWithoutRef<'button'>>;

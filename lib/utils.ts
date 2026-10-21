import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import logger from './logger';

export function cn(...inputs: ClassValue[]) {
  const result = twMerge(clsx(inputs));
  logger.debug({ inputsLength: inputs.length, resultLength: result.length }, 'cn utility called');
  return result;
}

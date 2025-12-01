/**
 * Driver API Service
 * Consumes the /driver endpoints from the backend
 */

import { apiRequest } from './api';

/**
 * Show a file in the browser driver
 * @param userId - The user ID
 * @param fileName - The name of the file to display
 * @returns Success response
 */
export async function showFile(userId: string, fileName: string): Promise<{ ok: boolean }> {
  return await apiRequest<{ ok: boolean }>(
    `/driver/show_file/${userId}?file_name=${encodeURIComponent(fileName)}`
  );
}

/**
 * Clear the browser driver (navigate to blank page)
 * @returns Success response
 */
export async function clearDriver(): Promise<{ ok: boolean }> {
  return await apiRequest<{ ok: boolean }>('/driver/clear');
}


/**
 * Users API Service
 * Consumes the /users endpoints from the backend
 */

import { apiRequest } from './api';
import { User, type UserJSON } from '../model/user';

/**
 * Get all users
 * @returns Array of User instances
 */
export async function getAllUsers(): Promise<User[]> {
  const users: UserJSON[] = await apiRequest<UserJSON[]>('/users/');
  return users.map(user => User.parse(user));
}

/**
 * Get all user IDs
 * @returns Array of user ID strings
 */
export async function getAllUserIds(): Promise<string[]> {
  return await apiRequest<string[]>('/users/ids');
}

/**
 * Get a specific user by ID
 * @param userId - The user ID
 * @returns User instance
 */
export async function getUserById(userId: string): Promise<User> {
  const user: UserJSON = await apiRequest<UserJSON>(`/users/${userId}`);
  return User.parse(user);
}

/**
 * Get user extra_data
 * @param userId - The user ID
 * @returns Extra data object
 */
export async function getUserExtraData(userId: string): Promise<Record<string, any>> {
  return await apiRequest<Record<string, any>>(`/users/${userId}/data`);
}

/**
 * Create user extra_data
 * @param userId - The user ID
 * @param data - The extra data to create
 * @returns Created extra data object
 */
export async function createUserExtraData(
  userId: string,
  data: Record<string, any>
): Promise<Record<string, any>> {
  return await apiRequest<Record<string, any>>(`/users/${userId}/data`, {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

/**
 * Update user extra_data
 * @param userId - The user ID
 * @param data - The extra data to update (will be merged with existing)
 * @returns Updated extra data object
 */
export async function updateUserExtraData(
  userId: string,
  data: Record<string, any>
): Promise<Record<string, any>> {
  return await apiRequest<Record<string, any>>(`/users/${userId}/data`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
}

/**
 * Delete user extra_data
 * @param userId - The user ID
 * @returns Success message
 */
export async function deleteUserExtraData(userId: string): Promise<{ message: string }> {
  return await apiRequest<{ message: string }>(`/users/${userId}/data`, {
    method: 'DELETE',
  });
}


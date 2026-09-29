import { getUsers } from '@/features/users/userService';
import { useFetch } from './useFetch';

export function useUsers() {
  return useFetch(getUsers, []);
}

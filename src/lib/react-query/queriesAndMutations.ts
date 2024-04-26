import { useQuery, useMutation, useQueryClient, useInfiniteQuery } from '@tanstack/react-query';

import { TNewPost, TNewUser } from '@/types';
import { createPost, createUserAccount, signInAccount, signOutAccount } from '../appwrite/api';
import { QUERY_KEYS } from './queryKeys';

// AUTH QUERIES
// ============================================================

export const useCreateUserAccount = () => {
  return useMutation({
    mutationFn: (user: TNewUser) => createUserAccount(user)
  });
};

export const useSignInAccount = () => {
  return useMutation({
    mutationFn: (user: { email: string; password: string; }) => signInAccount(user)
  });
};

export const useSignOutAccount = () => {
  return useMutation({
    mutationFn: signOutAccount,
  });
};

// POST QUERIES
// ============================================================

export const useCreatePost = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (post: TNewPost) => createPost(post),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_RECENT_POSTS],
      });
    }
  });
};

// export const useDeletePost = () => {
//   const queryClient = useQueryClient();
//   return useMutation({
//     mutationFn: ({ postId, imageId }: { postId?: string; imageId: string; }) => deletePost(postId, imageId),
//     onSuccess: () => {
//       queryClient.invalidateQueries({
//         queryKey: [QUERY_KEYS.GET_RECENT_POSTS],
//       });
//     }
//   });
// };
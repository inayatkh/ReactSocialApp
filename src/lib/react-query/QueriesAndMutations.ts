import {
  useQuery,
  useMutation,
  useQueryClient,
  useInfiniteQuery
} from '@tanstack/react-query'

import { QUERY_KEYS } from "@/lib/react-query/queryKeys";

import {
  createUserAccount,
  signInAccount,
  getCurrentUser,
  signOutAccount,
  createPost,
  getRecentPosts,
  getUsers,
  likePost,
  savePost,
  deleteSavedPost,

} from '../appwrite/api'
import { INewUser, INewPost } from '@/types'

export const useCreateUserAccount = () => {

  return useMutation({
    mutationFn: (user: INewUser) => createUserAccount(user),
  });
};

export const useSignInAccount = () => {

  return useMutation({
    mutationFn: (user: {
      email: string; password: string
    }) => signInAccount(user)
  })
}

export const useSignOutAccount = () => {

  return useMutation({
    mutationFn: signOutAccount
  })
}

export const useCreatePost = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (post: INewPost) => createPost(post),
    onSuccess: () => {
      // in order to retrieve new fresh data
      // we have to invalidate the post stored in local cache
      // so that next it has to call it from the server
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_RECENT_POSTS],
      });
    },
  });
}

// fectch all recent posts from the appwrite Posts collection
export const useGetRecentPosts = () => {

  return useQuery({
    queryKey: [QUERY_KEYS.GET_RECENT_POSTS],
    queryFn: getRecentPosts,
  })

}

export const useGetUsers = (limit?: number) => {
  return useQuery({
    queryKey: [QUERY_KEYS.GET_USERS],
    queryFn: () => getUsers(limit),
  });
};

export const useLikePost = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ postId, likesArray }: { postId: string; likesArray: string[] }) =>
      likePost(postId, likesArray),
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_POST_BY_ID, data?.$id]
      })

      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_RECENT_POSTS, data?.$id]
      })

      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_POSTS]
      })

      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_CURRENT_USER]
      })
    }
  })

}

export const useSavePost = () => {
  const queryClient = useQueryClient();

  return useMutation({
    // order of the parameter must be the same to that of mutuationFn
    mutationFn: ({ postId, userId }: { postId: string; userId: string }) =>
      savePost(postId, userId),
    onSuccess: (data) => {
      
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_RECENT_POSTS, data?.$id]
      })

      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_POSTS]
      })

      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_CURRENT_USER]
      })
    }
  })

}

export const useDeleteSavedPost = () => {
  const queryClient = useQueryClient();

  return useMutation({
    // order of the parameter must be the same to that of mutuationFn
    mutationFn: (savedRecordId : string ) =>
      deleteSavedPost(savedRecordId),
    onSuccess: (data) => {
      
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_RECENT_POSTS, data?.$id]
      })

      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_POSTS]
      })

      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_CURRENT_USER]
      })
    }
  })

}

export const useGetCurrentUser = () => {

  return useQuery({
    queryKey: [QUERY_KEYS.GET_CURRENT_USER],
    queryFn: getCurrentUser
  })


}
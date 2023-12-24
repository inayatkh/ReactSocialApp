import {
    useQuery ,
    useMutation ,
    useQueryClient ,
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
    
 } from '../appwrite/api'
import { INewUser , INewPost } from '@/types'

export const useCreateUserAccount = () => {

    return useMutation({
        mutationFn: (user : INewUser) => createUserAccount( user),
    });
};

export const useSignInAccount = () => {

    return useMutation({
        mutationFn: (user : {
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


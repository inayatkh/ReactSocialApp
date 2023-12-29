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
  getPostById,
  updatePost,
  deletePost,
  getUserPosts,
  updateUser,
  getInfinitePosts,
  searchPosts,
  getUserById,
  getPostLikedUsers,
 

} from '../appwrite/api'
import { INewUser, INewPost, IUpdatePost, IUpdateUser } from '@/types'

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

export const useGetPostLikedUsers =(userIds: string | string[]) =>{
  /// to avoid the following error
  /*
    argument of type 'string[] | undefined' is not assignable to parameter of type 'string[]'.
  */
  if (typeof userIds === "string") {
    userIds = [userIds];
  } else {
    userIds = userIds;
  }
  //console.log(userIds)

  return useQuery({
    queryKey: [QUERY_KEYS.GET_POST_LIKE_USERS],
    queryFn: () => getPostLikedUsers(userIds),
  });
}
export const useLikePost = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ 
      postId,
      likesArray,
     }: { 
      postId: string;
      likesArray: string[]
     }) =>  likePost(postId, likesArray),
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_POST_BY_ID, data?.$id]
      })

      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_RECENT_POSTS]
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

export const useGetPostById= (postId: string) => {
  return useQuery({
    queryKey: [QUERY_KEYS.GET_POST_BY_ID, postId],
    queryFn: () => getPostById(postId),
    enabled: !!postId,
  })
}

export const useUpdatePost = () => {
  // update is a mutation not a fetch 
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (post: IUpdatePost) => updatePost(post),
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_POST_BY_ID, data?.$id],
      });
    },
  });
}

export const useDeletePost = () => {
  // deleting is also a mutation not a fetch
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ postId, imageId }: { postId: string; imageId: string }) =>
      deletePost(postId, imageId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_RECENT_POSTS],
      });
    },
  });
};

export const useGetUserPosts = (userId?: string) => {
  return useQuery({
    queryKey: [QUERY_KEYS.GET_USER_POSTS, userId],
    queryFn: () => getUserPosts(userId),
    enabled: !!userId,
  });
};

// ============================================================
// POST QUERIES
// ============================================================

export const useGetPosts = () => {
  return useInfiniteQuery({
    queryKey: [QUERY_KEYS.GET_INFINITE_POSTS],
    queryFn: getInfinitePosts ,
    getNextPageParam: (lastPage) => {
      // If there's no data, there are no more pages.
      if (lastPage && lastPage.documents.length === 0) {
        return null;
      }

      // Use the $id of the last document as the cursor.
      const lastId = lastPage.documents[lastPage.documents.length - 1].$id;
      return lastId;
    },
  });
};

export const useSearchPosts = (searchTerm: string) => {
  return useQuery({
    queryKey: [QUERY_KEYS.SEARCH_POSTS, searchTerm],
    queryFn: () => searchPosts(searchTerm),
    enabled: !!searchTerm,
  });
};

export const useUpdateUser = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (user: IUpdateUser) => updateUser(user),
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_CURRENT_USER],
      });
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_USER_BY_ID, data?.$id],
      });
    },
  });
};

export const useGetUserById = (userId: string) => {
  return useQuery({
    queryKey: [QUERY_KEYS.GET_USER_BY_ID, userId],
    queryFn: () => getUserById(userId),
    enabled: !!userId,
  });
};
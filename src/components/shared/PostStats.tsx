
import {
  useDeleteSavedPost,
  useGetCurrentUser,
  useLikePost,
  useSavePost,
} from "@/lib/react-query/QueriesAndMutations";
import { checkIsLiked } from "@/lib/utils";
import { Models } from "appwrite";
import { useEffect, useState } from "react";
import Loader from "./Loader";

type PostStatsProps = {
  post: Models.Document;
  userId: string;
};

function PostStats({ post, userId }: PostStatsProps) {
  const likesList = post.likes.map((user: Models.Document) => {
    user.$id;
  });

  const [likes, setLikes] = useState(likesList);
  const [isSaved, setisSaved] = useState(false);

  const { mutate: likePost } = useLikePost();
  const { mutate: savePost, isPending: isSavingPost } = useSavePost();
  const { mutate: deleteSavedPost, isPending: isDeletingSaved } = useDeleteSavedPost();

  const { data: currentUser } = useGetCurrentUser();

  /*
  const savedPostRecord = currentUser?.save.find(
    (record: Models.Document) => record.post.$id === post.$id
  );

  useEffect(() => {
    //setisSaved( savedPostRecord? true: false)
    setisSaved( !!savedPostRecord)
  },[currentUser]);

  */

  const handleLikePost = (e: React.MouseEvent) => {
    e.stopPropagation(); // allow to click only this and dont propagate

    

    let newLikes = [...likes]; // spread all the previous likes

    const hasLiked = newLikes.includes(userId); // if the current likes includes the current userid
    console.log(hasLiked)
    console.log(userId)
    console.log(currentUser?.$id)

    if (hasLiked) {
      newLikes = newLikes.filter((id) => id !== userId);
    } else {
      newLikes.push(userId);
    }

    setLikes(newLikes);

    likePost({ postId: post.$id, likesArray: newLikes });
  };

  const handleSavePost = (e: React.MouseEvent) => {
    e.stopPropagation(); // allow to click only this and dont propagate

    const savedPostRecord = currentUser?.save.find(
        (record: Models.Document) => record.post.$id === post.$id
      );

    if (savedPostRecord) { // we have already saved it , therefore we want to remove from save list
        setisSaved(false);
        deleteSavedPost(savedPostRecord.$id);

       

    } else {

        savePost({ postId: post.$id, userId});
    
    
        setisSaved(true);

    }
    

  };

  return (
    <div className="flex justify-between items-center z-20">
      <div className="flex gap-2 mr-5">
        <img
          src={
            checkIsLiked(likes, userId)?
              "/assets/icons/liked.svg"
              : "/assets/icons/like.svg"
            }
          alt="like"
          width={20}
          height={20}
          onClick={handleLikePost}
          className="cursor-pointer"
        />
        <p className="small-medium lg:base-medium">{likes.length}</p>
      </div>

      <div className="flex gap-2">
        <img
          src="/assets/icons/share.svg"
          alt="share"
          width={20}
          height={20}
          onClick={() => {}}
          className="cursor-pointer"
        />
      </div>

      <div className="flex gap-2">
        { isSavingPost || isDeletingSaved ? <Loader /> :
        <img
          src={isSaved ? "/assets/icons/saved.svg" : "/assets/icons/save.svg"}
          
          alt="save"
          width={20}
          height={20}
          onClick={handleSavePost}
          className="cursor-pointer"
        />
        }
      </div>
    </div>
  );
}

export default PostStats;

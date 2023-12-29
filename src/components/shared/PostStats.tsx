
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
import { Button } from "../ui/button";
import { useLocation } from "react-router-dom";
import ShowPostLikesList from "./ShowPostLikesList";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { ScrollArea } from "../ui/scroll-area";


type PostStatsProps = {
  post: Models.Document;
  userId: string;
};

function PostStats({ post, userId }: PostStatsProps) {

  const location = useLocation();
  // remove undefined likes items in post if any
  post.likes = post.likes.filter( (item: any) => !!item)
  
  const likesList = post.likes.map((user: Models.Document) => user.$id);



  //console.log("PostStats: userId",userId)
  //console.log("PostStats: likesList",likesList)

  const [likes, setLikes] = useState<string[]>(likesList);
  const [isSaved, setisSaved] = useState(false);

  const { mutate: likePost } = useLikePost();
  const { mutate: savePost, isPending: isSavingPost } = useSavePost();
  const { mutate: deleteSavedPost, isPending: isDeletingSaved } = useDeleteSavedPost();

  const { data: currentUser } = useGetCurrentUser();

  
  const savedPostRecord = currentUser?.save.find(
    (record: Models.Document) => record.post.$id === post.$id
  );

  useEffect(() => {
    //setisSaved( savedPostRecord? true: false)
    setisSaved( !!savedPostRecord)
  },[currentUser]);

/*
   /// set for likes hover
   const [isLikedHovered, setIsLikedHovered] = useState(false);

   const handleLikeMouseEnter = (e: React.MouseEvent<HTMLParagraphElement, MouseEvent>) => {
    e.stopPropagation();
     setIsLikedHovered(true);
   };

   const handleLikeMouseLeave = (e: React.MouseEvent<HTMLParagraphElement, MouseEvent>) => {
    e.stopPropagation();
     setIsLikedHovered(false);
   };
  */

  const handleLikePost = (e: React.MouseEvent<HTMLImageElement, MouseEvent>) => {
    e.stopPropagation(); // allow to click only this and dont propagate

    
    
    //console.log("LIKES CLICK")
    //let newLikes = [...likes]; // spread all the previous likes
    let likesArray = [...likes];

    // filter out undefined if any
    //likesArray=likesArray.filter(item => !!item);

    //const hasLiked = newLikes.includes(userId); // if the current likes includes the current userid
    const hasLiked = likesArray.includes(userId);
    //console.log('hasLike', userId, likes)
    /*console.log(userId)
    console.log(currentUser?.$id)*/

    if (hasLiked) {
      //newLikes = newLikes.filter((id) => id !== userId);
      likesArray = likesArray.filter((Id) => Id !== userId);
    } else {
      //newLikes.push(userId);
      likesArray.push(userId);
    }

    //setLikes(newLikes);
    setLikes(likesArray);

    //likePost({ postId: post.$id, likesArray: newLikes });
 
    likePost({ postId: post.$id, likesArray});
     
  

   // console.log("LIKES CLICK EXIT")
  };

  const handleSavePost = (e: React.MouseEvent<HTMLImageElement, MouseEvent>) => {
    e.stopPropagation(); // allow to click only this and dont propagate

    const savedPostRecord = currentUser?.save.find(
        (record: Models.Document) => record.post.$id === post.$id
      );

    if (savedPostRecord) { // we have already saved it , therefore we want to remove from save list
        setisSaved(false);
        return deleteSavedPost(savedPostRecord.$id);

       

    } else {

        //savePost({ postId: post.$id, userId});
        savePost({ userId: userId, postId: post.$id });
        setisSaved(true);

    }
    

  };

  const containerStyles = location.pathname.startsWith("/profile")
    ? "w-full"
    : "";
  /*
  console.log(likes);
  console.log(userId);
  console.log(likes.includes(userId))
  */
 //console.log( {likes, userId})
  return (
    <div className={`flex justify-between items-center z-20 ${containerStyles}`}>
      <div className="flex gap-2 mr-5">
        
        <img
          src={`${
            checkIsLiked(likes, userId)
              ? "/assets/icons/liked.svg"
              : "/assets/icons/like.svg"
          }`}
          alt="like"
          width={20}
          height={20}
          onClick={(e) => handleLikePost(e)}
          className="cursor-pointer"
          
        />
        {/* 
        <p 
          className="small-medium lg:base-medium  cursor-pointer"
          onMouseEnter={(e) => handleLikeMouseEnter(e)}
          onMouseLeave={(e) => handleLikeMouseLeave(e)}
        >{likes.length}
        </p>
        {isLikedHovered && <ShowPostLikesList likes={likes} />}
        */}
        <Popover >
          <PopoverTrigger asChild>
              <Button 
                variant="link" 
                className="px-0 small-medium lg:base-medium  cursor-pointer"
              >{likes.length}
            </Button>
          </PopoverTrigger>         
          <PopoverContent className="w-50  px-0 py-0">
              <ShowPostLikesList likes={likes} />
          </PopoverContent>       
        </Popover>

        
        
      </div>

      <div className="flex gap-2">
       
         <Button
          onClick={() => {}}
          variant="ghost"
          className="shad-button_ghost">
          <img
            src={"/assets/icons/share.svg"}
            alt="share"
            width={20}
            height={20}
          />
          
        </Button>
     

        { isSavingPost || isDeletingSaved ? <Loader /> :
        <img
          src={isSaved ? "/assets/icons/saved.svg" : "/assets/icons/save.svg"}
          
          alt="save"
          width={20}
          height={20}
          onClick={(e) => handleSavePost(e)}
          className="cursor-pointer"
        />
        }
      </div>
    </div>
  );
}

export default PostStats;

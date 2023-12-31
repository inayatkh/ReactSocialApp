//import './ShowPostLikesList.css'; // Import the CSS file for styling

import { useGetPostLikedUsers } from "@/lib/react-query/QueriesAndMutations";

import Loader from "./Loader";
import { Link } from "react-router-dom";

import { ScrollArea } from "../ui/scroll-area";
import { Separator } from "../ui/separator";

//import * as ScrollArea from '@radix-ui/react-scroll-area';

type UserIdList = {
  likes: string[];
};

const ShowPostLikesList = (likes: UserIdList) => {
  // console.log(likes);
  //console.log(likes.likes)
  if (!likes.likes) return;

  const {
    data: likeUsers,
    isPending,
    isError: isErrorLikes,
  } = useGetPostLikedUsers(likes.likes);

  if (isErrorLikes) {
    //toast({ title: "Something went wrong." });
    console.log("Something went wrong.");
    return;
  }
  /*if (!isPending)
   console.log( likeUsers)
   <div className="posts-likes-shortlist-container">

   justify-between items-center z-20
   */
   //const TAGS = Array.from({ length: 50 }).map((_, i, a) => `v1.2.0-beta.${a.length - i}`);
  return (
    
      <div className="flex flex-col w-full h-40 px-0 py-0 bg-gray-800 text-light-1 tiny-medium">
        {isPending ? (
          <Loader />
        ) : (
          <ScrollArea className="scrollArea-scrollbar rounded-md border overflow-y-auto">
            <div className="p-4">
              <h4 className="h3-small-regular">Likes: {likeUsers?.documents.length}</h4>
              <Separator className="separator-root  mt-2 " />
              
              {likeUsers?.documents.map((likeUser) => {
                return (
                  <div className="flex flex-col w-full mt-1" key={likeUser.$id}>
                    <Link to={`/profile/${likeUser.$id}`}>
                      <img
                        src={
                          likeUser.imageUrl ||
                          "/assets/icons/profile-placeholder.svg"
                        }
                        alt="creator"
                        className="rounded-full py-1 bg-slate-800"
                        align="left"
                        width={20}
                        height={20}
                      />
                      <p className="ml-8 mt-2 hover:text-blue-900">{likeUser?.name}</p>
                    </Link>
                    <Separator className="my-1" />
                  </div>
                );
              })}
              
            </div>
            
     
          
          </ScrollArea>

         
        )}
      </div>

     
   
  );
};

export default ShowPostLikesList;

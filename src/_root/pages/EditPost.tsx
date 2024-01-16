//use resuable shadcn React Hook Form  component 

import PostForm from '@/components/forms/PostForm';
import Loader from '@/components/shared/Loader';
import { useGetPostById } from '@/lib/react-query/QueriesAndMutations';

import { useParams } from 'react-router-dom';


function EditPost() {
  
  const { id } = useParams();
  // this id is the postid will be obatined from link to route opption /update-post/id=...

  //console.log(id);

  const {data: post, isPending: isLoadingEdit} = useGetPostById( id || "");

  if( isLoadingEdit )
    return (
      <div className="flex-center w-full h-full">
        <Loader />
      </div>
    );
  
  return (
    <div className='flex flex-1'>
      <div className="common-container">
        <div className='max-w-5xl flex-start gap-3 justify-start w-full'>
            <img 
                src="/assets/icons/add-post.svg"
                width={36}
                height={36}
                alt='add'
            />
            <h2 className='h3-bold md:h2-bold text-left w-full'>
              Edit Post
            </h2>

        </div>

        <PostForm action="Update" post={post} />

      </div>

    </div>
  )
}

export default EditPost
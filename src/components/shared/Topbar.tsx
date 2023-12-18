import { Link, useNavigate } from "react-router-dom";
import { Button } from "../ui/button";
import { useSignOutAccount } from "@/lib/react-query/QueriesAndMutations";
import { useEffect } from "react";
import { useUserContext } from "@/context/AuthContext";

function Topbar() {
  const { mutate: signOut, isSuccess } = useSignOutAccount();
  const navigate = useNavigate();

  const {user}= useUserContext();


  useEffect(()=>{
    if (isSuccess){
        navigate(0);

    }
  },[isSuccess]);

  return (
    <section className="topbar">
      <div className="flex-between py-4 px-5">
        <Link to="/" className="flex gap-3 items-center">
          <img
            src="/assets/images/logo.svg"
            alt="logo"
            width={130}
            height={325}
          />
        </Link>
        <div className="flex gap-4">
          <Button
            variant="ghost"
            className="shad-button_ghost"
            onClick={()=> signOut()}
          >
            <img src="/assets/icons/logout.svg" alt="logout" />
          </Button>
        </div>
        <Link to={`/profile/${user.id}`} className="flex-center gap-3">
            <img 
                src={user.imageUrl || '/assets/image/profile-placeholder.svg' }
                alt="profile"
                className="h-8 w-8 rounded-full"
            />
        </Link>
      </div>
    </section>
  );
}

export default Topbar;
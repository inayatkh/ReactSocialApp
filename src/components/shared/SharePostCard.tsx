//import { Separator }  from '@radix-ui/react-separator'

import { Separator } from "../ui/separator";

//import * as Separator from '@radix-ui/react-separator'

import { Button } from "../ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";

import {
  EmailIcon,
  EmailShareButton,
  FacebookIcon,
  FacebookMessengerIcon,
  FacebookMessengerShareButton,
  FacebookShareButton,
  FacebookShareCount,
  LinkedinIcon,
  LinkedinShareButton,
  TelegramIcon,
  TelegramShareButton,
  TwitterShareButton,
  ViberIcon,
  ViberShareButton,
  WhatsappIcon,
  WhatsappShareButton,
  XIcon,
} from "react-share";

import { CopyToClipboard } from 'react-copy-to-clipboard'

import { useLocation } from 'react-router-dom';
import { useState } from "react";
type SharePostCardProps = {
  shareUrl : string;
  
};
function SharePostCard( {shareUrl} : SharePostCardProps) {

const [isPostCardOpen, setPostCardOpen] = useState(true);

function toggle(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
  e.stopPropagation(); // allow to click only this and dont propagate
  setPostCardOpen((isPostCardOpen) => !isPostCardOpen);
}

const location = useLocation()
location.pathname

//const history = useHistory()
//history.location.pathname

  /*console.log(window.location.href)
  console.log(window.location.origin)
  console.log(shareUrl)
  console.log(`${window.location.origin}${shareUrl}`)*/
  
  //const shareUrl = "http://github.com";

  shareUrl=`${window.location.origin}${shareUrl}`;

  const title = "SocialApp";

  return ( 
    <>
     {isPostCardOpen && (
      <Card className="bg-gray-600 ">
        <div className="shadcn-button_close pt-2 pr-2">
                <Button 
                    onClick={(e)=> {toggle(e)}}
                    variant="outline"
                    className="small-semibold hover:bg-gray-500 py-3"
                >              
                  X
                </Button>
        </div>
        <CardHeader className="px-1 py-1 mt-4">
          <CardTitle className="px-4 text-left small-semibold">Share</CardTitle>
        </CardHeader>
        <CardContent className="tiny-medium">
          <div className="flex justify-between items-center  w-full mt-2">
            <div className="flex gap-1 mr-5 bg-transparent">
              <p>Link</p>
              
            </div>
            <div className="flex gap-2">
             
                  <CopyToClipboard 
                        text={shareUrl}
                        options={{message: 'Whoa!'}}
                        >
                    <Button 
                        className="tiny-medium hover:bg-gray-500 px-1"
                        >
                           <img
                            src={"/assets/icons/copy-link.svg"}
                            alt="Copylink"
                            width={20}
                            height={20}
                          />
                          <p className="px-1">Copy Link</p>
                    </Button>
                  </CopyToClipboard>
            </div>
          </div>
          <Separator className="separator-root  mt-1" />
          <div className="flex justify-between items-center  w-full mt-1">
            <p className="pt-0">Share with others</p>
          </div>
          
          {/*
              social network sharing post link
               
        */}

          <div className="flex-social-grid mt-2 text-center tiny">
            <div className="flex-social-col hover:bg-gray-800 p-2">
              <FacebookShareButton
                url={shareUrl}
              >
              <FacebookIcon size={32} round className=""/>
              </FacebookShareButton>
              <div>
                <FacebookShareCount
                  url={shareUrl}
                >
                  {(count) => count}
                </FacebookShareCount>
              </div>
              <p> Facebook</p>
            </div>
            <div className="flex-social-col  hover:bg-gray-800 p-2">
            <FacebookMessengerShareButton
                url={shareUrl}
                appId="521270401588372"
                
              >
                <FacebookMessengerIcon size={32} round />
              </FacebookMessengerShareButton>
              <p> Fb Messenger</p>
            </div>
            <div className="flex-social-col  hover:bg-gray-800 p-2">
            <TwitterShareButton
                url={shareUrl}
                title={title}
                
              >
                <XIcon size={32} round />
              </TwitterShareButton>
              <p>X</p>

            </div>
            
            <div className="flex-social-col  hover:bg-gray-800 p-2">
            <TelegramShareButton
                url={shareUrl}
                title={title}
                
              >
                <TelegramIcon size={32} round />
              </TelegramShareButton>
              <p> Telegram</p>
            </div>
          </div>
          <div className="flex-social-grid mt-2 text-center tiny">
            <div className="flex-social-col  hover:bg-gray-800 p-2">
            <WhatsappShareButton
                url={shareUrl}
                title={title}
                separator=":: "
                
              >
                <WhatsappIcon size={32} round />
              </WhatsappShareButton>
              <p> Whatsapp</p>
            </div>
            <div className="flex-social-col  hover:bg-gray-800 p-2">
                <LinkedinShareButton
                    url={shareUrl}
                    
                  >
                    <LinkedinIcon size={32} round />
                  </LinkedinShareButton>
                  <p> LinkedIn</p>
            </div>
            <div className="flex-social-col  hover:bg-gray-800 p-2">
            <ViberShareButton
                url={shareUrl}
                title={title}
                
              >
                <ViberIcon size={32} round />
              </ViberShareButton>
              <p> Viber</p>
            </div>
            <div className="flex-social-col  hover:bg-gray-800 p-2">
            <EmailShareButton
                url={shareUrl}
                subject={title}
                body="body"
                
              >
                <EmailIcon size={32} round />
              </EmailShareButton>
              <p> e-mail</p>
            </div>
          </div>

          <Separator className="separator-root  mt-3" />

        
      

        
        </CardContent>
         {/*
        <CardFooter className="flex justify-between">
          <Button variant="outline">Cancel</Button>
          <Button variant="outline"> Deploy</Button>
        </CardFooter>
        */}
      </Card>
     )}
    </>
    
  );
}

export default SharePostCard;

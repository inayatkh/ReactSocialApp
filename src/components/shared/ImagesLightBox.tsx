import Lightbox from "yet-another-react-lightbox";
import Inline from "yet-another-react-lightbox/plugins/inline";
import Thumbnails from "yet-another-react-lightbox/plugins/thumbnails";

import "yet-another-react-lightbox/styles.css";
import "yet-another-react-lightbox/plugins/thumbnails.css";



import { useState } from 'react'
import React from "react";

type ImagesLightBoxProps = {
     imageUrls: string[];
  };
function ImagesLightBox({imageUrls}:ImagesLightBoxProps) {

  const [OpenLightbox, setOpenLightbox] = useState(false);
    
 
  const thumbnailsRef = React.useRef(null);
  const inline = {
    style: {
      width: "130%",
      maxWidth: "300px",
      aspectRatio: "3 / 2",
      margin: "0 auto",
    },
  };
  
  const slides=imageUrls.map((item) => ({
    src: item
  }));

//
  return (
    

    <div className="flex flex-1 justify-center w-full p-5 lg:p-10">
    
     <Lightbox
                            
              inline={inline}
              open={OpenLightbox}
              close={() => setOpenLightbox(false)}
              slides={slides}
              carousel={{
                padding: 0,
                spacing: 0,
               
                imageFit: "cover",
              }}
              thumbnails={{
                ref: thumbnailsRef,
                position:"bottom",
                width:50,
                height:50,
                border:1,
                borderRadius:1,
                padding:4,
                gap:0,
                imageFit: "contain",
                showToggle:false,
              }}
              on={{
                click: () => {
                  (thumbnailsRef.current?.visible
                    ? thumbnailsRef.current?.hide
                    : thumbnailsRef.current?.show)?.();

                  setOpenLightbox(true);
                },
              }}

              plugins={[Inline, Thumbnails]}
              
          />
      
          </div>
          
    
    

  )
}

export default ImagesLightBox
import Lightbox from "yet-another-react-lightbox";
import Inline from "yet-another-react-lightbox/plugins/inline";
import "yet-another-react-lightbox/styles.css";

import { useState } from 'react'

type ImagesLightBoxProps = {
     imageUrls: string[];
  };
function ImagesLightBox({imageUrls}:ImagesLightBoxProps) {

  const [isOpenLightbox, setIsOpenLightbox] = useState(false);
  console.log('ImagesLightBox')
  console.log(imageUrls)
  const slides=
    imageUrls.map((item) => ({
      src: item
    }))
  
   console.log(slides)
  return (
    <div className="flex flex-1 justify-center w-full p-5 lg:p-10">
          <Lightbox
               toolbar={{
                buttons: [
                  <button key="my-button" type="button" className="yarl__button">
                    Button
                  </button>,
                  "close",
                ],
              }}
              plugins={[Inline]}
              inline={{
                style: { width: "100%", maxWidth: "900px", aspectRatio: "3 / 2" },
              }}
              open={isOpenLightbox}
              close={() => setIsOpenLightbox(false)}
              slides={imageUrls.map((item) => ({
                  src: item
                }))}
              

              
          />
            
          </div>

  )
}

export default ImagesLightBox

import { useCallback, useEffect, useState } from "react";
import { FileWithPath, useDropzone } from "react-dropzone";

import { convertFileToUrl } from "@/lib/utils";
import { Button } from "../ui/button";



type FilesUploaderProps = {
  fieldChange: (files: File[]) => void;
  mediaUrls: string[];
};

const FilesUploader = ({ fieldChange, mediaUrls }: FilesUploaderProps) => {
  
  // mediaurls is a string array may be needed in update case with previous uploaded files
  const [fileUrls, setFileUrls] = useState<string[]>(mediaUrls ? mediaUrls : []);
  const [files, setFiles] = useState<File[]>([]);
 
  // this has to be recheked for the case of update
  // in case of update mediaUrls contain url of the remote data storage and 
  /// fileUrls are initialized with the medialUrl
  /// however this result in different types of files in files and fileUrls
  /// one way is to download the remote files and reuplaoded again
 // https://stackoverflow.com/questions/61833074/change-the-file-after-uploading-in-react-js-reupload-files

 

  const onDrop = useCallback(
    (acceptedFiles: FileWithPath[]) => {
      //console.log(acceptedFiles);
      //setFile(acceptedFiles); // to removed
      
      for (let index = 0; index < acceptedFiles.length; index++) {
        //console.log(convertFileToUrl(acceptedFiles[index]));
        // add the current url to previous if any
       // console.log('tommorrow remember');
        
        setFiles((prevFiles) => prevFiles.concat(acceptedFiles[index]));
       // fieldChange(files);
        setFileUrls((prevFiles) => prevFiles.concat(convertFileToUrl(acceptedFiles[index])));

     //   console.log(convertFileToUrl(acceptedFiles[index]))

      }
     

      //setFile(file); // update 
      //fieldChange(files);

        

     // setFileUrl(convertFileToUrl(acceptedFiles[0])); // to be removed 
     
    },
    []
  );

  useEffect(() => {
    fieldChange(files);
  }, [files]); // <- add the files are added or removed

  const removeFile = (index: number) => {
    setFiles([
      ...files.slice(0, index),
      ...files.slice(index + 1, files.length)
    ]);
  }

  function handlerDeleteFile(selFile:string) {
  // delete the selected file from the previous selection
    const index=fileUrls.findIndex((e) => e === selFile);
    //if(index )
    //    files.slice(index)
    
    setFileUrls(fileUrls.filter((e) => e !== selFile));

    removeFile(index);

    //setFiles(files);
    URL.revokeObjectURL(selFile);
  }
  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: {
      "image/*": [".png", ".jpeg", ".jpg"],
    },
  });

 



  return fileUrls.length > 0 ? (
    <>
      <div className="flex flex-row flex-wrap justify-center p-5 lg:p-10">
        {fileUrls.map((imageUrl) => {
          return (
            <div key={imageUrl} className="relative shadow-2xl">
              <img
                src={imageUrl}
                alt="upload image"
                height={200}
                width={200}
                className="relative"
              />
              <Button
                className="shad-button-top-right_secondary"
                variant={"secondary"}
                onClick={() =>  handlerDeleteFile(imageUrl)}
              >
                X
              </Button>
            </div>
          );
        })}
      </div>

      <div
        {...getRootProps()}
        className="flex flex-center flex-col bg-dark-3 rounded-xl cursor-pointer"
      >
        <input {...getInputProps()} className="cursor-pointer" />
        <p className="file_uploader-label">Click or drag photo to replace</p>
      </div>

      {/*
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
              slides={
                file.map((item) => ({
                  src: convertFileToUrl(item)
                }))
              }

              
          />
            
          </div>
          
          <div
              {...getRootProps()}
              className="flex flex-center flex-col bg-dark-3 rounded-xl cursor-pointer">
          <input {...getInputProps()} className="cursor-pointer" />
          <p className="file_uploader-label">Click or drag photo to replace</p>
          </div>
        */}
    </>
  ) : (
    <div
      {...getRootProps()}
      className="flex flex-center flex-col bg-dark-3 rounded-xl cursor-pointer"
    >
      <input {...getInputProps()} className="cursor-pointer" />

      <div className="file_uploader-box ">
        <img
          src="/assets/icons/file-upload.svg"
          width={96}
          height={77}
          alt="file upload"
        />

        <h3 className="base-medium text-light-2 mb-2 mt-6">Drag photo here</h3>
        <p className="text-light-4 small-regular mb-6">SVG, PNG, JPG</p>

        <Button type="button" className="shad-button_dark_4">
          Select from computer
        </Button>
      </div>
    </div>
  );
};

export default FilesUploader;

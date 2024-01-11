import { useCallback, useEffect, useState } from "react";
import { FileWithPath, useDropzone } from "react-dropzone";

import { EditFile, convertFileToUrl } from "@/lib/utils";
import { Button } from "../ui/button";
import { deleteFile } from "@/lib/appwrite/api";

type FilesCRUDProps = {
  fieldChange: (filesMap: Map<string, EditFile>) => void;
  remoteMediaUrls: string[];
  remoteMediaIds: string[];
};

const FilesCRUD = ({ fieldChange, remoteMediaUrls, remoteMediaIds }: FilesCRUDProps) => {
  //const filesMap = new Map<string, EditFile>(); //  later to be used with fieldchange
  const [filesMap, setFilesMap] = useState<Map<string, EditFile>>(new Map<string, EditFile>());

  useEffect(() => {
    if (remoteMediaUrls) {
      remoteMediaUrls.map((remoteMediaUrl,index) => {
        const g = new EditFile();
        g.isLocal = false;
        g.remoteFileUrl = remoteMediaUrl;
        g.remoteFileId = remoteMediaIds[index];

        filesMap.set(remoteMediaUrl, g);
      });
    }
    setFilesMap(filesMap);
  }, []); //run once on element load

  
  // this has to be recheked for the case of update
  // in case of update mediaUrls contain url of the remote data storage and
  /// fileUrls are initialized with the medialUrl
  /// however this result in different types of files in files and fileUrls
  /// one way is to download the remote files and reuplaoded again
  // https://stackoverflow.com/questions/61833074/change-the-file-after-uploading-in-react-js-reupload-files

  const onDrop = useCallback((acceptedFiles: FileWithPath[]) => {
    
    if ( acceptedFiles.length ) {
      acceptedFiles.map((acceptedFile) => {
        const g = new EditFile();
        g.isLocal = true;
        g.localFile = acceptedFile;
        g.localFileURL = convertFileToUrl(acceptedFile);
        filesMap.set(g.localFileURL, g);
      });
    }
    setFilesMap(filesMap);

    
  }, []);

  useEffect(() => {
    fieldChange(filesMap);
  }, [filesMap]); // <- add the files are added or removed

  

  function handlerDeleteFile(e : React.MouseEvent<HTMLButtonElement, MouseEvent>, selFile: string) {
    e.stopPropagation();
    if(!filesMap.get(selFile)?.isLocal){

      let remotefileId : string;
      remotefileId = filesMap.get(selFile)?.remoteFileId;
      // delete remote file 
      deleteFile(remotefileId);
      

    }
    filesMap.delete(selFile);
    setFilesMap(filesMap);
    
    //setFiles(files);
    URL.revokeObjectURL(selFile);
    console.log('delete exit')
  }
  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: {
      "image/*": [".png", ".jpeg", ".jpg"],
    },
  });

   console.log('filesMap.size')
   console.log(filesMap.size)
  return (filesMap.size > 0) ? (
    <>
      <div className="flex flex-row flex-wrap justify-center p-5 lg:p-10">
        {Array.from(filesMap).map(([key, value]) => {
            return(
              <div key={key} className="relative shadow-2xl">
                <img
                  src={
                    value.isLocal ? value.localFileURL : value.remoteFileUrl
                  }
                  alt="upload image"
                  height={200}
                  width={200}
                  className="relative"
                  key={`${key}-img`}
                />
                <Button
                  className="shad-button-top-right_secondary"
                  variant={"secondary"}
                  onClick={(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => handlerDeleteFile(e,key)}
                  key={`${key}-button`}
                >
                  X
                </Button>
              </div>
            )
            })}
      </div>

      <div
        {...getRootProps()}
        className="flex flex-center flex-col bg-dark-3 rounded-xl cursor-pointer"
      >
        <input {...getInputProps()} className="cursor-pointer" />
        <p className="file_uploader-label">Add photos</p>
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

export default FilesCRUD;

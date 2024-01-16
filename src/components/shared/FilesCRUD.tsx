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
  const [filesMap, setFilesMap] = useState(new Map<string, EditFile>());

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
    console.log(filesMap.size)
    setFilesMap(filesMap);
    //setFilesMap(filesMap);
    console.log("use effet setfilemaps called")
    
  }, []); //run once on element load

  
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
    
    console.log('secode use effet called')
    console.log(filesMap.size)
  }, [filesMap]); // <- add the files are added or removed

  

  function handlerDeleteFile(e : React.MouseEvent<HTMLButtonElement, MouseEvent>, selFile: string) {
    e.preventDefault()
    if(!filesMap.get(selFile)?.isLocal){

     
      let remoteFileId = filesMap.get(selFile)?.remoteFileId;
      // delete remote file 
      if(remoteFileId)
        deleteFile(remoteFileId);
      
      filesMap.delete(selFile);
      setFilesMap(filesMap);
      return;
    }
    filesMap.delete(selFile);
    setFilesMap(filesMap);
    
    //setFiles(files);
    URL.revokeObjectURL(selFile);
    console.log("deleleted")
    
  };


  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: {
      "image/*": [".png", ".jpeg", ".jpg"],
    },
  });

  
 

  return filesMap.size > 0 ? (
    <>
       <div>
          <h1>{`A filesMap size: ${filesMap.size}`}</h1>
      </div>
      <div className="flex flex-row flex-wrap justify-center p-5 lg:p-10">
       
        { 
         Array.from(filesMap).map(([key,value])=>{
         //filesMap.forEach((value, key) => {
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
                >X          X
                </Button>
              </div>
            )
            })
        }
      </div>

      <div
        {...getRootProps()}
        className="flex flex-center flex-col bg-dark-3 rounded-xl cursor-pointer"
      >
        <input {...getInputProps()} className="cursor-pointer" />
        <p className="file_uploader-label">Add photos</p>
      </div>

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

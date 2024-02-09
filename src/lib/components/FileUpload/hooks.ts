import { useCallback, useReducer } from "react";

import { FileRejection } from "react-dropzone";

import { FileUploadFile } from "./FileUpload";

type FileUploadState = {
  acceptedFiles: FileUploadFile[];
  fileRejections: FileRejection[];
};

type AddFiles = {
  type: "add-files";
  payload: { acceptedFiles: FileUploadFile[]; fileRejections: FileRejection[] };
};
type RemoveAcceptedFile = { type: "remove-accepted"; payload: FileUploadFile };
type RemoveRejectedFile = { type: "remove-rejected"; payload: FileRejection };

type FileUploadActions =
  | AddFiles
  | RemoveAcceptedFile
  | RemoveRejectedFile;

export const useFileUpload = () => {
  const fileUploadReducer = (
    state: FileUploadState,
    action: FileUploadActions,
  ): FileUploadState => {
    switch (action.type) {
      case "add-files":
        return {
          acceptedFiles: [
            ...state.acceptedFiles,
            ...action.payload.acceptedFiles,
          ],
          fileRejections: [
            ...state.fileRejections,
            ...action.payload.fileRejections,
          ],
        };
      case "remove-accepted": {
        const newFiles = [...state.acceptedFiles];
        newFiles.splice(newFiles.indexOf(action.payload), 1);
        return {
          acceptedFiles: [...newFiles],
          fileRejections: [...state.fileRejections],
        };
      }
      case "remove-rejected": {
        const newRejectedFiles = [...state.fileRejections];
        newRejectedFiles.splice(newRejectedFiles.indexOf(action.payload), 1);
        return {
          acceptedFiles: [...state.acceptedFiles],
          fileRejections: [...newRejectedFiles],
        };
      }
    }
  };

  const [{ acceptedFiles, fileRejections }, dispatch] = useReducer(
    fileUploadReducer,
    {
      acceptedFiles: [],
      fileRejections: [],
    },
  );

  const onFileUpload = useCallback(
    (acceptedFiles: FileUploadFile[], fileRejections: FileRejection[]) =>
      dispatch({
        type: "add-files",
        payload: { acceptedFiles, fileRejections },
      }),
    [dispatch],
  );

  const removeFile = (file: FileUploadFile) =>
    dispatch({ type: "remove-accepted", payload: file });

  const removeRejectedFile = (fileRejection: FileRejection) =>
    dispatch({ type: "remove-rejected", payload: fileRejection });
  
  return { acceptedFiles, fileRejections, onFileUpload, removeFile, removeRejectedFile };

}

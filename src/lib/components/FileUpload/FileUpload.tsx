import { ReactElement, ReactNode, useId } from "react";

import { Button, Icon, Label } from "@canonical/react-components";
import classNames from "classnames";
import { useDropzone, DropzoneOptions, FileRejection } from "react-dropzone";

import "./FileUpload.scss";
import { useFileUpload } from "./hooks";

import { ProgressIndicator } from "@/lib/elements";

export type FileUploadFile = File & { percentUploaded?: number };

export interface FileUploadProps {
  accept?: DropzoneOptions["accept"];
  error?: ReactNode;
  files?: FileUploadFile[];
  help?: string;
  label?: string;
  maxFiles?: number;
  maxSize?: number;
  minSize?: number;
  onFileUpload?: NonNullable<DropzoneOptions["onDrop"]>;
  rejectedFiles?: FileRejection[];
  onRemoveFile?: (item: FileUploadFile | FileRejection) => void;
}

export const FileUpload = ({
  accept,
  error,
  files: filesProp,
  help,
  label,
  maxFiles,
  maxSize,
  minSize,
  onFileUpload,
  onRemoveFile,
  rejectedFiles: rejectedFilesProp,
}: FileUploadProps): ReactElement => {
  // Use internal state management if props are not provided (uncontrolled mode)
  const internalState = useFileUpload();

  // Use provided props or fall back to internal state
  const files = filesProp ?? internalState.acceptedFiles;
  const rejectedFiles = rejectedFilesProp ?? internalState.fileRejections;
  const onDrop = onFileUpload ?? internalState.onFileUpload;

  // Unified remove handler with backward compatibility
  const handleRemove = (item: FileUploadFile | FileRejection) => {
    if (onRemoveFile) {
      onRemoveFile(item);
    } else if ("file" in item && "errors" in item) {
      // It's a FileRejection
      internalState.removeRejectedFile(item);
    } else {
      // It's a FileUploadFile
      internalState.removeFile(item as FileUploadFile);
    }
  };

  const { getRootProps, getInputProps } = useDropzone({
    accept,
    maxFiles,
    maxSize,
    minSize,
    onDrop,
  });

  const labelId = useId();

  return (
    <div
      className={classNames("p-form__group p-form-validation", {
        "is-error": !!error,
      })}
    >
      {label && <Label id={labelId}>{label}</Label>}
      {help && <p className="p-form-help-text">{help}</p>}
      <div className="p-form__control">
        {!maxFiles || files.length + rejectedFiles.length < maxFiles ? (
          <div className="file-upload__wrapper">
            <div
              {...getRootProps()}
              aria-labelledby={label ? labelId : undefined}
              className="file-upload"
              data-testid="file-upload"
            >
              <input {...getInputProps()} />
              <button className="file-upload__button" type="button">
                Drag and drop files here or click to upload
              </button>
            </div>
          </div>
        ) : null}
        <div className="file-upload__files-list">
          {rejectedFiles &&
            rejectedFiles.map((rejection) => (
              <span className="is-error" key={rejection.file.name}>
                <div className="file-upload__file is-rejected">
                  {rejection.file.name}
                  <Button
                    appearance="base"
                    className="file-upload__file-remove-button"
                    onClick={() => handleRemove(rejection)}
                    type="button"
                  >
                    <Icon name="close">Remove file</Icon>
                  </Button>
                </div>
                {rejection.errors.map((error) => (
                  <p
                    className="p-form-validation__message"
                    key={`${rejection.file.name}-${error.code}`}
                  >
                    {error.message}
                  </p>
                ))}
              </span>
            ))}
          {files &&
            files.map((file) => (
              <div className="file-upload__file" key={file.name}>
                {file.name}
                {file.percentUploaded !== undefined ? (
                  <ProgressIndicator percentComplete={file.percentUploaded} />
                ) : (
                  <Button
                    appearance="base"
                    className="file-upload__file-remove-button"
                    onClick={() => handleRemove(file)}
                    type="button"
                  >
                    <Icon name="close">Remove file</Icon>
                  </Button>
                )}
              </div>
            ))}
        </div>
        {error ? (
          <p className="p-form-validation__message">
            <strong>Error: </strong>
            {error}.
          </p>
        ) : null}
      </div>
    </div>
  );
};

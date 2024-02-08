import { ReactNode, useCallback, useId, useState } from "react";

import { Button, Icon, Label } from "@canonical/react-components";
import classNames from "classnames";
import { useDropzone, DropzoneOptions, FileRejection } from "react-dropzone";

import "./FileUpload.scss";
import { ProgressIndicator } from "@/lib/elements";

export interface FileUploadProps {
  accept?: DropzoneOptions["accept"];
  error?: ReactNode;
  files: File[];
  help?: string;
  label?: string;
  maxFiles?: number;
  maxSize?: number;
  onFileUpload: NonNullable<DropzoneOptions["onDrop"]>;
  rejectedFiles: FileRejection[];
  removeFile: (file: File) => void;
  removeRejectedFile: (fileRejection: FileRejection) => void;
  uploadingFiles?: { name: string; percentComplete: number }[];
}

export const FileUpload: React.FC<FileUploadProps> = ({
  accept,
  error,
  files,
  help,
  label,
  maxFiles,
  maxSize,
  onFileUpload,
  rejectedFiles,
  removeFile,
  removeRejectedFile,
  uploadingFiles,
}: FileUploadProps) => {
  const { getRootProps } = useDropzone({
    accept,
    maxFiles,
    maxSize,
    onDrop: onFileUpload,
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
        {!uploadingFiles && (!maxFiles || files.length < maxFiles) ? (
          <div className="file-upload__wrapper">
            <div
              {...getRootProps()}
              aria-labelledby={label ? labelId : undefined}
              className="file-upload"
              data-testid="file-upload"
            >
              <button className="file-upload__button" type="button">
                Drag and drop files here or click to upload
              </button>
            </div>
          </div>
        ) : null}
        {error ? (
          <p className="p-form-validation__message">
            <strong>Error: </strong>
            {error}
          </p>
        ) : null}
        <div className="file-upload__files-list">
          {rejectedFiles &&
            !uploadingFiles &&
            rejectedFiles.map((rejection) => (
              <span className="is-error" key={rejection.file.name}>
                <div className="file-upload__file is-rejected">
                  {rejection.file.name}
                  <Button
                    appearance="base"
                    className="file-upload__file-remove-button"
                    onClick={() => removeRejectedFile(rejection)}
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
            !uploadingFiles &&
            files.map((file) => (
              <div className="file-upload__file" key={file.name}>
                {file.name}
                <Button
                  appearance="base"
                  className="file-upload__file-remove-button"
                  onClick={() => removeFile(file)}
                  type="button"
                >
                  <Icon name="close">Remove file</Icon>
                </Button>
              </div>
            ))}
          {uploadingFiles &&
            uploadingFiles.map((file) => (
              <div className="file-upload__file" key={file.name}>
                {file.name}
                <ProgressIndicator percentComplete={file.percentComplete} />
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export const FileUploadContainer = ({
  accept,
  error,
  help,
  label,
  maxFiles,
  maxSize,
  uploadingFiles,
}: Pick<
  FileUploadProps,
  | "accept"
  | "error"
  | "help"
  | "label"
  | "maxFiles"
  | "maxSize"
  | "uploadingFiles"
>) => {
  const [files, setFiles] = useState<File[]>([]);
  const [rejectedFiles, setRejectedFiles] = useState<FileRejection[]>([]);

  const onFileUpload = useCallback(
    (acceptedFiles: File[], fileRejections: FileRejection[]) => {
      setFiles([...files, ...acceptedFiles]);
      setRejectedFiles([...rejectedFiles, ...fileRejections]);
    },
    [files, rejectedFiles],
  );

  const removeFile = (file: File) => {
    const newFiles = [...files];
    newFiles.splice(newFiles.indexOf(file), 1);
    setFiles(newFiles);
  };

  const removeRejectedFile = (fileRejection: FileRejection) => {
    const newRejectedFiles = [...rejectedFiles];
    newRejectedFiles.splice(newRejectedFiles.indexOf(fileRejection), 1);
    setRejectedFiles(newRejectedFiles);
  };

  return (
    <FileUpload
      accept={accept}
      error={error}
      files={files}
      rejectedFiles={rejectedFiles}
      help={help}
      label={label}
      maxFiles={maxFiles}
      maxSize={maxSize}
      onFileUpload={onFileUpload}
      removeFile={removeFile}
      removeRejectedFile={removeRejectedFile}
      uploadingFiles={uploadingFiles}
    />
  );
};

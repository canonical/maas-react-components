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
  onRemoveFile?: (item: FileUploadFile | FileRejection) => void;
  rejectedFiles?: FileRejection[];
}

/**
 * FileUpload - A controllable file upload input field with internal validation
 *
 * A file upload input field supporting both controlled and uncontrolled modes.
 * Can be used standalone for simple file uploads or with external state management
 * (React state or Formik) for complex forms. Built on React Dropzone with support
 * for file validation and upload progress tracking.
 *
 * @param {Object} props - Component props
 * @param {DropzoneOptions["accept"]} [props.accept] - Allowed file types
 * @param {ReactNode} [props.error] - Externally stored error message to display
 * @param {FileUploadFile[]} [props.files] - Externally stored array of accepted files
 * @param {string} [props.help] - Help text displayed below the label
 * @param {string} [props.label] - Field label text
 * @param {number} [props.maxFiles] - Maximum number of files allowed
 * @param {number} [props.maxSize] - Maximum file size in bytes
 * @param {number} [props.minSize] - Minimum file size in bytes
 * @param {NonNullable<DropzoneOptions["onDrop"]>} [props.onFileUpload] - Callback triggered when files are dropped or selected
 * @param {(item: FileUploadFile | FileRejection) => void} [props.onRemoveFile] - Callback triggered when a file is removed
 * @param {FileRejection[]} [props.rejectedFiles] - Externally stored array of rejected files with error details
 *
 * @returns {ReactElement} - The rendered file upload field component
 *
 * @example
 * // Simple usage with React state
 * const [files, setFiles] = useState();
 * const [rejected, setRejected] = useState();
 * <FileUpload
 *   accept={{"image": [".jpeg", ".png"]}}
 *   files={files}
 *   rejectedFiles={rejected}
 *   maxFiles={1}
 *   maxSize={20000}
 *   label="Profile Picture"
 *   onFileUpload={(accepted) => setFiles(accepted)}
 *   onRemoveFile={() => setFiles([])}
 * />
 *
 * @example
 * // With Formik - simplified usage
 * const formik = useFormik();
 * <FileUpload
 *   accept={{"image": [".jpeg", ".png"]}}
 *   files={formik.values.file ? [formik.values.file] : []}
 *   error={formik.touched.file && formik.errors.file}
 *   maxFiles={1}
 *   maxSize={20000}
 *   label="Profile Picture"
 *   onFileUpload={(accepted) => {
 *     if (accepted.length) {
 *       formik.setFieldValue("file", accepted[0]);
 *       formik.setFieldError("file", undefined);
 *     }
 *   }}
 *   onRemoveFile={() => formik.setFieldValue("file", null)}
 * />
 */
export const FileUpload = ({
  accept,
  error,
  files,
  help,
  label,
  maxFiles,
  maxSize,
  minSize,
  onFileUpload,
  onRemoveFile,
  rejectedFiles,
}: FileUploadProps): ReactElement => {
  // Use internal state management if props are not provided (uncontrolled mode)
  const internalState = useFileUpload();

  // Use provided props or fall back to internal state
  const acceptedFileList = files ?? internalState.acceptedFiles;
  const rejectedFileList = rejectedFiles ?? internalState.fileRejections;
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
        {!maxFiles ||
        acceptedFileList.length + rejectedFileList.length < maxFiles ? (
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
          {rejectedFileList &&
            rejectedFileList.map((rejection) => (
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
              </span>
            ))}
          {acceptedFileList &&
            acceptedFileList.map((file) => (
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
            {error}
          </p>
        ) : null}
      </div>
    </div>
  );
};

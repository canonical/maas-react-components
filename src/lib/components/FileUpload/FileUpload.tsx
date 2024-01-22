import { useDropzone, DropzoneOptions } from "react-dropzone";

export interface FileUploadProps {
  onFileUpload: NonNullable<DropzoneOptions["onDrop"]>;
}

import "./FileUpload.scss";

export const FileUpload: React.FC<FileUploadProps> = ({
  onFileUpload,
}: FileUploadProps) => {
  const { getRootProps } = useDropzone({
    onDrop: onFileUpload,
  });

  return (
    <div {...getRootProps()} className="file-upload" data-testid="file-upload">
      <button className="file-upload__button">
        Drag and drop files here or click to upload
      </button>
    </div>
  );
};

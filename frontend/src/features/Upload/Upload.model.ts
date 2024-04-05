export interface IUpload {
  img: File | null;
  setImg: React.Dispatch<React.SetStateAction<File | null>>;
  className?: string;
}

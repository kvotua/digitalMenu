export interface ITagProps {
  title: string;
  color: string;
  id: string;
  tagId: string;
  setTagId: (a: string) => void;
  trashClick?: () => void;
  slice?: boolean;
}

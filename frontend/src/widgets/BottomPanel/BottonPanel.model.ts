export interface IButtonPanelProps {
  deleteFunc?: (() => void) | undefined;
  doneFunc?: (() => void) | undefined;
  disabled?: boolean;
  form?: string;
  isValid?: boolean;
}

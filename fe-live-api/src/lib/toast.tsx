import { toast } from 'sonner';

export const showToastMessage = (text: string, Icon?: JSX.Element) => {
  return toast(
    <p className="flex gap-2 items-center justify-start">
      {Icon && Icon} {text}
    </p>
  );
};

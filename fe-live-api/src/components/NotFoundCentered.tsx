import { useNavigate } from 'react-router-dom';
import { Button } from './ui/button';

interface ComponentProps {
  Icon: JSX.Element;
  title: string;
  description?: string;
  redirectTo?: {
    link: string;
    buttonText?: string;
    Icon?: JSX.Element;
  };
}

const NotFoundCentered = (props: ComponentProps) => {
  const navigate = useNavigate();

  const { Icon, title, description, redirectTo } = props;

  return (
    <div className="child-center">
      <div className="flex flex-col justify-center items-center space-y-3">
        <div className="bg-primary/70 dark:bg-primary/50 p-2 rounded-full">
          {Icon}
        </div>
        <p className="text-base font-medium">{title}</p>
        {description && (
          <span className="text-sm text-center">{description}</span>
        )}
        {redirectTo && (
          <Button size="sm" onClick={() => navigate(redirectTo.link)}>
            {redirectTo?.Icon && redirectTo.Icon} {redirectTo?.buttonText}
          </Button>
        )}
      </div>
    </div>
  );
};

export default NotFoundCentered;

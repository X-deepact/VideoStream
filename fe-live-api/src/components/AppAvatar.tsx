import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';

interface ComponentProps {
  url: string;
  classes?: string;
  fallback?: string;
}

const AppAvatar = ({ url, classes, fallback = 'PF' }: ComponentProps) => {
  return (
    <Avatar className={`w-8 h-8 cursor-pointer ${classes}`}>
      <AvatarImage src={url} alt={fallback} className="object-cover" />
      <AvatarFallback className="text-sm">{fallback}</AvatarFallback>
    </Avatar>
  );
};

export default AppAvatar;

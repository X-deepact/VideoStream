interface ComponentProps {
  id: number;
  label: string;
  onClick?: () => void;
}

const VideoCategory = ({ id, label, onClick }: ComponentProps) => {
  return (
    <p
      key={id}
      className="text-blue-500"
      onClick={() => {
        if (onClick) onClick();
      }}
    >
      {label}
    </p>
  );
};

export default VideoCategory;

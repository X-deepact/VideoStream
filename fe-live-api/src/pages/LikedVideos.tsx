import AppLayout from '@/layouts/AppLayout';
import LayoutHeading from '@/layouts/LayoutHeading';

const title = 'Liked Videos';

const LikedVideos = () => {
  return (
    <AppLayout>
      <LayoutHeading title={title} />
    </AppLayout>
  );
};

export default LikedVideos;

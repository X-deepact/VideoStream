import AppLayout from '@/layouts/AppLayout';
import LayoutHeading from '@/layouts/LayoutHeading';

const title = 'Saved Videos';

const SavedVideos = () => {
  return (
    <AppLayout title={title}>
      <LayoutHeading title={title} />
    </AppLayout>
  );
};

export default SavedVideos;

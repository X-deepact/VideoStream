import AppLayout from '@/layouts/AppLayout';
import LayoutHeading from '@/layouts/LayoutHeading';

const title = 'History';

const History = () => {
  return (
    <AppLayout title={title}>
      <LayoutHeading title={title} />
    </AppLayout>
  );
};

export default History;

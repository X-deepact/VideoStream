import AppLayout from '@/layouts/AppLayout';
import LayoutHeading from '@/layouts/LayoutHeading';

const title = 'Subscriptions';

const Subscriptions = () => {
  return (
    <AppLayout title={title}>
      <LayoutHeading title={title} />
    </AppLayout>
  );
};

export default Subscriptions;

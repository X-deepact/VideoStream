import AppLayout from '@/layouts/AppLayout';
import LayoutHeading from '@/layouts/LayoutHeading';

const title = 'Home';

const Home = () => {
  return (
    <AppLayout title={title}>
      <LayoutHeading title={title} />
      <div className="grid auto-rows-min gap-4 md:grid-cols-3">
        <div className="aspect-video rounded-xl bg-muted" />
        <div className="aspect-video rounded-xl bg-muted" />
        <div className="aspect-video rounded-xl bg-muted" />
      </div>
      <div className="grid auto-rows-min gap-4 md:grid-cols-3">
        <div className="aspect-video rounded-xl bg-muted" />
        <div className="aspect-video rounded-xl bg-muted" />
        <div className="aspect-video rounded-xl bg-muted" />
      </div>
    </AppLayout>
  );
};

export default Home;

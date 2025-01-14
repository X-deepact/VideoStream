import AppLayout from '@/layouts/AppLayout';
import LayoutHeading from '@/layouts/LayoutHeading';

const title = 'User Profile';

const UserProfile = () => {
  return (
    <AppLayout>
      <LayoutHeading title={title} />
      User Profile
    </AppLayout>
  );
};

export default UserProfile;

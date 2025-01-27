import { Link } from 'react-router-dom';
import { PRIVACY_DOCS_PATH, TERMS_OF_SERVICES_DOCS_PATH } from '@/data/route';

const PrivacyAndTerms = () => {
  return (
    <p className="px-8 text-center text-sm text-muted-foreground">
      By clicking continue, you agree to our{' '}
      <Link
        to={TERMS_OF_SERVICES_DOCS_PATH}
        className="underline underline-offset-4 hover:text-primary"
      >
        Terms of Service
      </Link>{' '}
      and{' '}
      <Link
        to={PRIVACY_DOCS_PATH}
        className="underline underline-offset-4 hover:text-primary"
      >
        Privacy Policy
      </Link>
      .
    </p>
  );
};

export default PrivacyAndTerms;

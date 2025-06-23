'use client';

import AccountPageContainer from '@/app/components/account/AccountPageContainer';
import { AmplifyAuthProvider } from '@/app/components/providers/AmplifyAuthProvider';
import { ProductionProvider } from '@/app/components/playground/ProductionContext';

// Import Amplify configuration
import '../../lib/amplify';

const AccountPage = () => {
  return (
    <div>
      <AmplifyAuthProvider>
        <ProductionProvider initialValue={true}>
          <AccountPageContainer />
        </ProductionProvider>
      </AmplifyAuthProvider>
    </div>
  );
};

export default AccountPage;

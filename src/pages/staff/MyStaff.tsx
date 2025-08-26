import React from 'react';
import StaffAccounts from '@/pages/accounts/StaffAccounts';

const MyStaff = () => {
  // Render the existing StaffAccounts component directly. The app's top-level layout
  // will already provide the navbar and sidebar, so avoid re-wrapping here.
  return <StaffAccounts />;
};

export default MyStaff;

import React from 'react';
import SalaryManagement from '@/pages/salary/SalaryManagement';

const Payout = () => {
  // Reuse SalaryManagement; users can filter by status to view payouts
  return <SalaryManagement />;
};

export default Payout;

import type { ReactNode } from 'react';

type DashboardWrapperProps = {
  children: ReactNode;
};

const DashboardWrapper = ({ children }: DashboardWrapperProps) => {
  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-900 p-8">
      <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-6">
        Admin Dashboard
      </h1>
      {children}
    </div>
  );
};

export default DashboardWrapper;

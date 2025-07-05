import React, { ReactNode } from 'react';
import { Award } from 'lucide-react';

interface LayoutProps {
  title?: string;
  children: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ title = '2-Player Game Hub', children }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 to-purple-100 flex flex-col items-center justify-start p-4">
      <div className="max-w-4xl w-full bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="p-6 bg-indigo-600 text-white text-center">
          <h1 className="text-3xl font-bold flex items-center justify-center gap-2">
            <Award className="h-8 w-8" />
            {title}
          </h1>
          <p className="text-indigo-200 mt-1">Enjoy classic 2-player games in one place</p>
        </div>

        <div className="p-6 md:p-8">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Layout;

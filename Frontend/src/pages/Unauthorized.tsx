
import React from 'react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

const Unauthorized = () => {
  const { user } = useAuth();
  
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background">
      <div className="text-center max-w-md px-4">
        <h1 className="text-4xl font-bold text-destructive mb-4">Access Denied</h1>
        <div className="rounded-full w-24 h-24 bg-destructive/10 flex items-center justify-center mx-auto mb-6">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-12 w-12 text-destructive"
          >
            <path d="M18 6 6 18M6 6l12 12" />
          </svg>
        </div>
        <p className="text-lg mb-6">
          You don't have permission to access this page. This resource requires different privileges.
        </p>
        <Button asChild className="bg-edu-purple-400 hover:bg-edu-purple-500">
          <Link to="/dashboard">
            Return to Dashboard
          </Link>
        </Button>
      </div>
    </div>
  );
};

export default Unauthorized;

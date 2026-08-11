import React from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { ArrowLeft, Home } from 'lucide-react';

export default function NotFound() {
  return (
    <>
      <Helmet>
        <title>404 Page Not Found | Strajec</title>
      </Helmet>

      <div className="min-h-screen flex items-center justify-center bg-snow px-4 py-20 text-center">
        <div className="max-w-md space-y-6">
          <span className="font-display font-black text-8xl text-navy/15 select-none leading-none">404</span>
          
          <h1 className="text-3xl font-display font-bold tracking-tight text-navy">Page not found</h1>
          
          <p className="body-md text-[#4A5568] max-w-sm mx-auto">
            The page you are looking for doesn't exist, has been moved, or is temporarily unavailable.
          </p>

          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              to="/"
              className="btn-primary inline-flex items-center gap-2 text-sm px-6 py-3 shadow-sm w-full sm:w-auto justify-center"
            >
              <Home className="w-4 h-4" /> Go back home
            </Link>
            <button
              onClick={() => window.history.back()}
              className="btn-outline inline-flex items-center gap-2 text-sm px-6 py-3 w-full sm:w-auto justify-center"
            >
              <ArrowLeft className="w-4 h-4" /> Previous page
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

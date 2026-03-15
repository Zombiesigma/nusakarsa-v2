import { redirect } from 'next/navigation';

/**
 * @fileOverview Resolves a route conflict by redirecting.
 * This file was a duplicate of the public /welcome page, causing a build error.
 * As it resides within the (main) authenticated route group, it now redirects
 * any authenticated user who might land here to the main dashboard ('/').
 */
export default function DeprecatedWelcomePage() {
  redirect('/');
}

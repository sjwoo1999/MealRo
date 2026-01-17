
'use client';

import AuthGuard from '@/components/auth/AuthGuard';
import DashboardPage from './page'; // Import the original server component? No, server components cannot be imported into client components this way if we want to wrap.
// Correct approach: Rename request-protected pages to include checks, or wrap their content.
// Since we want to update existing pages without deleting them, we can wrap the page content.
// But DashboardPage is likely `export default function DashboardPage() ...`
// We should check the file first.

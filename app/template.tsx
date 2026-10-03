import DbSync from '@/components/db/DbSync';

/**
 * Next.js "template" wraps every page. Used here to mount the invisible database
 * sync without editing layout.tsx or any existing page.
 */
export default function Template({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <DbSync />
    </>
  );
}

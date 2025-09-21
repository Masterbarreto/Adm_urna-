import type { ReactNode } from 'react';
import { Button } from './ui/button';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

type PageHeaderProps = {
  title: string;
  description?: string;
  children?: ReactNode;
  backHref?: string;
};

export default function PageHeader({ title, description, children, backHref }: PageHeaderProps) {
  return (
    <header className="mb-8">
      <div className="flex items-center justify-between">
        <div className='flex items-center gap-4'>
          {backHref && (
            <Button asChild variant="outline" size="icon">
                <Link href={backHref}>
                    <ArrowLeft className="h-4 w-4" />
                    <span className="sr-only">Voltar</span>
                </Link>
            </Button>
          )}
          <div>
            <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
            {description && (
              <p className="mt-1 text-muted-foreground">{description}</p>
            )}
          </div>
        </div>
        <div className="flex items-center gap-2">{children}</div>
      </div>
    </header>
  );
}

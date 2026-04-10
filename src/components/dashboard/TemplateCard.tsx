import { PenLine, Search, Mail, type LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

const iconMap: Record<string, LucideIcon> = {
  PenLine,
  Search,
  Mail,
};

/** Content, Lead, and Research templates stay selectable even if DB status is not yet `active`. */
export function isWorkflowTemplateSelectable(name: string, status: string): boolean {
  if (status === 'active') return true;
  const n = name.trim().toLowerCase();
  if (n.includes('lead')) return true;
  if (n.includes('research')) return true;
  if (n.includes('content')) return true;
  return false;
}

interface TemplateCardProps {
  name: string;
  description: string;
  icon: string;
  status: string;
  onSelect?: () => void;
}

export function TemplateCard({ name, description, icon, status, onSelect }: TemplateCardProps) {
  const Icon = iconMap[icon] || PenLine;
  const isActive = isWorkflowTemplateSelectable(name, status);

  return (
    <button
      type="button"
      onClick={isActive ? onSelect : undefined}
      disabled={!isActive}
      className={cn(
        'surface-panel group relative flex flex-col items-start p-5 text-left transition-all duration-200',
        isActive
          ? 'cursor-pointer hover:-translate-y-0.5 hover:border-primary/30'
          : 'cursor-default opacity-60'
      )}
    >
      {!isActive && (
        <span className="absolute right-3 top-3 rounded-full bg-muted px-2 py-0.5 text-[10px] font-medium text-muted-foreground">
          Coming soon
        </span>
      )}
      {isActive && status !== 'active' && (
        <span className="absolute right-3 top-3 rounded-full bg-primary/15 px-2 py-0.5 text-[10px] font-medium text-primary">
          Live
        </span>
      )}
      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
        <Icon className="h-5 w-5 text-primary" />
      </div>
      <h3 className="mt-3 text-sm font-medium text-foreground">{name}</h3>
      <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{description}</p>
    </button>
  );
}

import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

const AGENTS = [
  {
    name: 'Content Agent',
    path: '/dashboard/agents/content',
    description: 'Social and long-form drafts from a single input.',
  },
  {
    name: 'Lead Agent',
    path: '/dashboard/agents/lead',
    description: 'Replies and follow-up planning from lead context.',
  },
  {
    name: 'Research Agent',
    path: '/dashboard/agents/research',
    description: 'Signals and angles from notes plus optional URLs.',
  },
];

export default function AgentsManagePage() {
  const navigate = useNavigate();

  return (
    <div className="mx-auto max-w-2xl px-4 py-6 sm:px-6 lg:px-8">
      <button
        type="button"
        onClick={() => navigate('/dashboard')}
        className="mb-4 flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" />
        Dashboard
      </button>

      <h1 className="text-xl font-semibold text-foreground sm:text-2xl">Manage agents</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Open each workspace to run workflows and review history. Global tone and audience live in Settings.
      </p>

      <ul className="mt-8 space-y-3">
        {AGENTS.map((a) => (
          <li key={a.path}>
            <button
              type="button"
              onClick={() => navigate(a.path)}
              className="surface-panel w-full p-4 text-left transition-colors hover:border-primary/25"
            >
              <p className="text-sm font-medium text-foreground">{a.name}</p>
              <p className="mt-1 text-xs text-muted-foreground">{a.description}</p>
            </button>
          </li>
        ))}
      </ul>

      <div className="mt-8 flex flex-wrap gap-3">
        <Button variant="outline" asChild>
          <Link to="/dashboard/settings">Open Settings</Link>
        </Button>
        <Button variant="outline" asChild>
          <Link to="/dashboard/run/new">New workflow</Link>
        </Button>
      </div>
    </div>
  );
}

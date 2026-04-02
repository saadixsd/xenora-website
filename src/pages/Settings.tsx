import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';

const Settings = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [displayName, setDisplayName] = useState('');
  const [preferredTone, setPreferredTone] = useState('professional');
  const [defaultAudience, setDefaultAudience] = useState('founders');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!user) return;
    supabase
      .from('profiles')
      .select('*')
      .eq('user_id', user.id)
      .single()
      .then(({ data }) => {
        if (data) {
          setDisplayName(data.display_name || '');
          setPreferredTone(data.preferred_tone || 'professional');
          setDefaultAudience(data.default_audience || 'founders');
        }
      });
  }, [user]);

  const handleSave = async () => {
    if (!user) return;
    setSaving(true);
    const { error } = await supabase
      .from('profiles')
      .update({
        display_name: displayName,
        preferred_tone: preferredTone,
        default_audience: defaultAudience,
      })
      .eq('user_id', user.id);

    if (error) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    } else {
      toast({ title: 'Settings saved' });
    }
    setSaving(false);
  };

  const handleExport = async () => {
    if (!user) return;
    const { data: runs } = await supabase
      .from('workflow_runs')
      .select('*, workflow_outputs(*)')
      .eq('user_id', user.id);

    const blob = new Blob([JSON.stringify(runs, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'nora-export.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="mx-auto max-w-2xl px-4 py-6 sm:px-6 lg:px-8">
      <h1 className="text-xl font-semibold text-foreground sm:text-2xl">Settings</h1>
      <p className="mt-1 text-sm text-muted-foreground">Manage your profile and preferences.</p>

      <div className="mt-8 space-y-6">
        <div className="surface-panel p-5">
          <h2 className="text-sm font-medium text-foreground">Profile</h2>
          <div className="mt-4 space-y-4">
            <div>
              <label className="mb-1.5 block text-sm text-muted-foreground">Display name</label>
              <Input
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                className="bg-card/50 border-border"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm text-muted-foreground">Email</label>
              <Input value={user?.email || ''} disabled className="bg-card/50 border-border opacity-60" />
            </div>
          </div>
        </div>

        <div className="surface-panel p-5">
          <h2 className="text-sm font-medium text-foreground">Preferences</h2>
          <div className="mt-4 space-y-4">
            <div>
              <label className="mb-1.5 block text-sm text-muted-foreground">Preferred tone</label>
              <select
                value={preferredTone}
                onChange={(e) => setPreferredTone(e.target.value)}
                className="w-full rounded-lg border border-border bg-card/50 px-3 py-2 text-sm text-foreground outline-none focus:border-primary/30"
              >
                <option value="professional">Professional</option>
                <option value="casual">Casual</option>
                <option value="bold">Bold</option>
                <option value="witty">Witty</option>
                <option value="inspirational">Inspirational</option>
              </select>
            </div>
            <div>
              <label className="mb-1.5 block text-sm text-muted-foreground">Default audience</label>
              <Input
                value={defaultAudience}
                onChange={(e) => setDefaultAudience(e.target.value)}
                placeholder="e.g. founders, creators, developers"
                className="bg-card/50 border-border"
              />
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row">
          <Button onClick={handleSave} disabled={saving}>
            {saving ? 'Saving...' : 'Save Settings'}
          </Button>
          <Button variant="outline" onClick={handleExport}>
            Export Data
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Settings;

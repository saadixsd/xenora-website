import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { toast } from '@/hooks/use-toast';

const AdminSettings = () => {
  const { user } = useAuth();
  const [displayName, setDisplayName] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!user) return;
    (async () => {
      const { data } = await supabase
        .from('profiles')
        .select('display_name')
        .eq('user_id', user.id)
        .maybeSingle();
      setDisplayName(data?.display_name ?? '');
    })();
  }, [user]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setSaving(true);
    const { error } = await supabase
      .from('profiles')
      .update({ display_name: displayName.trim() })
      .eq('user_id', user.id);
    setSaving(false);
    if (error) {
      toast({ title: 'Could not save', description: error.message, variant: 'destructive' });
    } else {
      toast({ title: 'Profile updated' });
    }
  };

  return (
    <div className="space-y-8">
      <header>
        <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-base-content/45">Settings</p>
        <h1 className="premium-heading mt-1 text-2xl font-medium sm:text-3xl">Admin settings</h1>
      </header>

      <form onSubmit={handleSave} className="surface-panel space-y-4 p-5 sm:p-6">
        <h2 className="text-sm font-semibold">Profile</h2>
        <label className="block text-sm">
          <span className="mb-1.5 inline-block font-medium text-base-content/80">Display name</span>
          <input
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            className="form-input"
            placeholder="Your name"
          />
        </label>
        <label className="block text-sm">
          <span className="mb-1.5 inline-block font-medium text-base-content/80">Email</span>
          <input value={user?.email ?? ''} readOnly className="form-input opacity-60" />
        </label>
        <button
          type="submit"
          disabled={saving}
          className="inline-flex items-center gap-1.5 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
        >
          {saving ? 'Saving…' : 'Save profile'}
        </button>
      </form>

      <section className="surface-panel space-y-2 p-5 sm:p-6">
        <h2 className="text-sm font-semibold">AI &amp; API keys</h2>
        <p className="text-xs text-base-content/55">
          Placeholder. Claude, GPT, and Perplexity keys will be configured here when the lead summary and outreach
          features go live.
        </p>
      </section>

      <section className="surface-panel space-y-2 p-5 sm:p-6">
        <h2 className="text-sm font-semibold">Business profile</h2>
        <p className="text-xs text-base-content/55">
          Placeholder. Your default company name, website, niche tags, and outreach tone will live here.
        </p>
      </section>
    </div>
  );
};

export default AdminSettings;

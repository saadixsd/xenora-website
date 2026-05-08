import { useMemo } from 'react';
import { STAGE_ORDER, STAGE_LABEL, STAGE_HELP, TYPE_LABEL, type WorkflowItem, type WorkflowItemStage } from '@/lib/workflowItems';
import { cn } from '@/lib/utils';

interface Props {
  items: WorkflowItem[];
  selectedId: string | null;
  onSelect: (item: WorkflowItem) => void;
  /** Optional: limit which stages render (e.g. omit `sent` for a tighter view). */
  stages?: WorkflowItemStage[];
}

/**
 * Stage-laned board for a set of workflow items. Click an item to focus it in the
 * detail drawer. Stages with no items still render as labelled empty columns so the
 * pipeline structure is always visible.
 */
export function WorkflowItemBoard({ items, selectedId, onSelect, stages = STAGE_ORDER }: Props) {
  const grouped = useMemo(() => {
    const map = new Map<WorkflowItemStage, WorkflowItem[]>();
    stages.forEach((s) => map.set(s, []));
    for (const item of items) {
      const list = map.get(item.stage);
      if (list) list.push(item);
    }
    return map;
  }, [items, stages]);

  return (
    <div className="grid min-w-0 gap-3 sm:grid-cols-2 lg:grid-cols-5">
      {stages.map((stage) => {
        const list = grouped.get(stage) ?? [];
        return (
          <div key={stage} className="flex min-w-0 flex-col rounded-lg border border-[var(--dash-border)] bg-[var(--dash-surface-deep)] p-2.5">
            <div className="mb-2 flex items-baseline justify-between">
              <p className="dash-label">{STAGE_LABEL[stage]}</p>
              <span className="font-space-mono text-[10.5px] text-[var(--dash-faint)]">{list.length}</span>
            </div>
            {list.length === 0 ? (
              <p className="rounded-md border border-dashed border-[var(--dash-border)] p-3 text-[11px] leading-relaxed text-[var(--dash-faint)]">
                {STAGE_HELP[stage]}
              </p>
            ) : (
              <ul className="flex flex-col gap-1.5">
                {list.map((item) => (
                  <li key={item.id}>
                    <button
                      type="button"
                      onClick={() => onSelect(item)}
                      className={cn(
                        'group block w-full min-w-0 rounded-md border px-2.5 py-2 text-left transition-colors',
                        selectedId === item.id
                          ? 'border-[var(--dash-accent)] bg-[var(--dash-accent-dim)]'
                          : 'border-[var(--dash-border)] bg-[var(--dash-surface)] hover:border-[var(--dash-accent-hover)]',
                      )}
                    >
                      <p className="font-space-mono text-[10px] uppercase tracking-wider text-[var(--dash-faint)]">
                        {TYPE_LABEL[item.type]}
                        {item.platform ? ` · ${item.platform}` : ''}
                      </p>
                      <p className="mt-1 line-clamp-2 break-words text-[12px] leading-snug text-[var(--dash-text)]">
                        {item.title || item.ai_draft || 'Untitled'}
                      </p>
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        );
      })}
    </div>
  );
}

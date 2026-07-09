import { GripVertical, Copy, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface CmsSortableListProps<T> {
  items: T[];
  onChange: (items: T[]) => void;
  renderItem: (item: T, index: number) => React.ReactNode;
  onDuplicate?: (item: T, index: number) => T;
  getKey?: (item: T, index: number) => string;
  className?: string;
}

export function CmsSortableList<T>({
  items,
  onChange,
  renderItem,
  onDuplicate,
  getKey,
  className,
}: CmsSortableListProps<T>) {
  const reorder = (from: number, to: number) => {
    if (from === to || to < 0 || to >= items.length) return;
    const next = [...items];
    const [moved] = next.splice(from, 1);
    next.splice(to, 0, moved);
    onChange(next);
  };

  const remove = (index: number) => {
    onChange(items.filter((_, i) => i !== index));
  };

  const duplicate = (index: number) => {
    if (!onDuplicate) return;
    const copy = onDuplicate(items[index], index);
    const next = [...items];
    next.splice(index + 1, 0, copy);
    onChange(next);
  };

  return (
    <div className={cn('space-y-3', className)}>
      {items.map((item, index) => (
        <div
          key={getKey ? getKey(item, index) : index}
          draggable
          onDragStart={(e) => e.dataTransfer.setData('text/plain', String(index))}
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => {
            e.preventDefault();
            const from = Number(e.dataTransfer.getData('text/plain'));
            reorder(from, index);
          }}
          className="flex gap-2 rounded-xl border border-slate-200 bg-slate-50/50 p-3"
        >
          <button
            type="button"
            className="mt-1 cursor-grab text-slate-400 hover:text-slate-600"
            aria-label="Drag to reorder"
          >
            <GripVertical className="h-4 w-4" />
          </button>
          <div className="min-w-0 flex-1 space-y-3">{renderItem(item, index)}</div>
          <div className="flex flex-col gap-1">
            {onDuplicate ? (
              <Button type="button" variant="ghost" size="icon" onClick={() => duplicate(index)} aria-label="Duplicate">
                <Copy className="h-4 w-4" />
              </Button>
            ) : null}
            <Button type="button" variant="ghost" size="icon" onClick={() => remove(index)} aria-label="Remove">
              <Trash2 className="h-4 w-4 text-red-500" />
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
}

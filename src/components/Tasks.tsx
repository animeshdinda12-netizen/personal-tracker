import { useState } from 'react';
import * as stylex from '@stylexjs/stylex';
import { Button } from '@astryxdesign/core/Button';
import { IconButton } from '@astryxdesign/core/IconButton';
import { TextInput } from '@astryxdesign/core/TextInput';
import { Badge } from '@astryxdesign/core/Badge';
import { Text } from '@astryxdesign/core/Text';
import { VStack, HStack } from '@astryxdesign/core/Layout';
import {
  SegmentedControl,
  SegmentedControlItem,
} from '@astryxdesign/core/SegmentedControl';
import { ProgressBar } from '@astryxdesign/core/ProgressBar';
import { EmptyState } from '@astryxdesign/core/EmptyState';
import type { BadgeVariant } from '@astryxdesign/core/Badge';
import { Panel } from './Panel';
import type { Task } from '../lib/storage';
import { PlusIcon, CheckIcon, TrashIcon, ListIcon } from './icons';

const styles = stylex.create({
  form: { alignItems: 'flex-end', width: '100%' },
  grow: { flexGrow: 1 },
  row: {
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    paddingTop: 12,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomStyle: 'solid',
    borderBottomColor: 'var(--color-border-subtle, #eee)',
  },
  check: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: 22,
    height: 22,
    borderRadius: 6,
    borderWidth: 2,
    borderStyle: 'solid',
    cursor: 'pointer',
    flexShrink: 0,
  },
  checkOpen: { borderColor: 'var(--color-border, #cbd5e1)', color: 'transparent' },
  checkDone: {
    borderColor: 'var(--color-positive, #15803d)',
    backgroundColor: 'var(--color-positive, #15803d)',
    color: '#fff',
  },
  doneText: { textDecoration: 'line-through', color: 'var(--color-content-tertiary, #9ca3af)' },
});

const PRIORITIES: Task['priority'][] = ['low', 'medium', 'high'];
const PRIORITY_VARIANT: Record<Task['priority'], BadgeVariant> = {
  low: 'neutral',
  medium: 'info',
  high: 'error',
};

export function Tasks({
  tasks,
  onAdd,
  onToggle,
  onRemove,
}: {
  tasks: Task[];
  onAdd: (title: string, priority: Task['priority']) => void;
  onToggle: (id: string) => void;
  onRemove: (id: string) => void;
}) {
  const [title, setTitle] = useState('');
  const [priority, setPriority] = useState<Task['priority']>('medium');

  const done = tasks.filter((t) => t.done).length;
  const sorted = [...tasks].sort((a, b) => {
    if (a.done !== b.done) return a.done ? 1 : -1;
    const order = { high: 0, medium: 1, low: 2 };
    return order[a.priority] - order[b.priority];
  });

  const submit = () => {
    onAdd(title, priority);
    setTitle('');
  };

  return (
    <Panel
      title="Tasks"
      subtitle="Stay on top of what matters"
      action={<Badge variant="blue" label={`${done}/${tasks.length} done`} />}
    >
      {tasks.length > 0 && (
        <ProgressBar
          label="Tasks completed"
          value={done}
          max={tasks.length}
          variant="accent"
          hasValueLabel
          formatValueLabel={(v, m) => `${m === 0 ? 0 : Math.round((v / m) * 100)}%`}
        />
      )}

      <VStack gap={3}>
        <HStack gap={3} xstyle={styles.form}>
          <span {...stylex.props(styles.grow)}>
            <TextInput
              label="New task"
              placeholder="e.g. Send the weekly update"
              value={title}
              width="100%"
              onChange={(v: string) => setTitle(v)}
              onEnter={submit}
            />
          </span>
          <Button label="Add" variant="primary" icon={PlusIcon} onClick={submit} />
        </HStack>
        <SegmentedControl
          label="Priority"
          value={priority}
          onChange={(v) => setPriority(v as Task['priority'])}
          size="sm"
        >
          {PRIORITIES.map((p) => (
            <SegmentedControlItem key={p} value={p} label={p[0].toUpperCase() + p.slice(1)} />
          ))}
        </SegmentedControl>
      </VStack>

      {tasks.length === 0 ? (
        <EmptyState
          icon={ListIcon}
          title="Nothing on your list"
          description="Add a task above and pick a priority."
          isCompact
        />
      ) : (
        <VStack>
          {sorted.map((t) => (
            <HStack key={t.id} gap={3} xstyle={styles.row}>
              <HStack gap={3} style={{ alignItems: 'center' }}>
                <span
                  {...stylex.props(styles.check, t.done ? styles.checkDone : styles.checkOpen)}
                  onClick={() => onToggle(t.id)}
                  role="checkbox"
                  aria-checked={t.done}
                >
                  {CheckIcon}
                </span>
                <Text xstyle={t.done ? styles.doneText : undefined}>{t.title}</Text>
                <Badge variant={PRIORITY_VARIANT[t.priority]} label={t.priority} />
              </HStack>
              <IconButton
                label="Delete task"
                icon={TrashIcon}
                variant="ghost"
                size="sm"
                onClick={() => onRemove(t.id)}
              />
            </HStack>
          ))}
        </VStack>
      )}
    </Panel>
  );
}

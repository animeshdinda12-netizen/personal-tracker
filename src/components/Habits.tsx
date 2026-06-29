import { useState } from 'react';
import * as stylex from '@stylexjs/stylex';
import { Button } from '@astryxdesign/core/Button';
import { IconButton } from '@astryxdesign/core/IconButton';
import { TextInput } from '@astryxdesign/core/TextInput';
import { Badge } from '@astryxdesign/core/Badge';
import { Text } from '@astryxdesign/core/Text';
import { VStack, HStack } from '@astryxdesign/core/Layout';
import { ProgressBar } from '@astryxdesign/core/ProgressBar';
import { EmptyState } from '@astryxdesign/core/EmptyState';
import { Panel } from './Panel';
import { currentStreak, todayISO, type Habit } from '../lib/storage';
import { PlusIcon, CheckIcon, TrashIcon, FlameIcon, TargetIcon } from './icons';

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
  name: { fontWeight: 600 },
  doneBtn: {
    backgroundColor: 'var(--color-positive, #15803d)',
    color: '#fff',
    borderColor: 'transparent',
  },
});

export function Habits({
  habits,
  onAdd,
  onToggle,
  onRemove,
}: {
  habits: Habit[];
  onAdd: (name: string) => void;
  onToggle: (id: string) => void;
  onRemove: (id: string) => void;
}) {
  const [name, setName] = useState('');
  const today = todayISO();
  const doneCount = habits.filter((h) => h.history.includes(today)).length;

  const submit = () => {
    onAdd(name);
    setName('');
  };

  return (
    <Panel
      title="Habits"
      subtitle="Build streaks one day at a time"
      action={<Badge variant="purple" label={`${doneCount}/${habits.length} today`} />}
    >
      {habits.length > 0 && (
        <ProgressBar
          label="Today's habit completion"
          value={doneCount}
          max={habits.length}
          variant="success"
          hasValueLabel
          formatValueLabel={(v, m) => `${m === 0 ? 0 : Math.round((v / m) * 100)}%`}
        />
      )}

      <HStack gap={3} xstyle={styles.form}>
        <span {...stylex.props(styles.grow)}>
          <TextInput
            label="New habit"
            placeholder="e.g. Read 20 minutes"
            value={name}
            width="100%"
            onChange={(v: string) => setName(v)}
            onEnter={submit}
          />
        </span>
        <Button label="Add" variant="primary" icon={PlusIcon} onClick={submit} />
      </HStack>

      {habits.length === 0 ? (
        <EmptyState
          icon={TargetIcon}
          title="No habits yet"
          description="Add your first habit above to start tracking streaks."
          isCompact
        />
      ) : (
        <VStack>
          {habits.map((h) => {
            const doneToday = h.history.includes(today);
            const streak = currentStreak(h.history);
            return (
              <HStack key={h.id} gap={3} xstyle={styles.row}>
                <HStack gap={3} style={{ alignItems: 'center' }}>
                  <Text xstyle={styles.name}>{h.name}</Text>
                  {streak > 0 && (
                    <Badge variant="orange" icon={FlameIcon} label={`${streak} day${streak > 1 ? 's' : ''}`} />
                  )}
                </HStack>
                <HStack gap={2}>
                  <Button
                    label={doneToday ? 'Done' : 'Mark done'}
                    variant={doneToday ? 'secondary' : 'primary'}
                    size="sm"
                    icon={doneToday ? CheckIcon : undefined}
                    xstyle={doneToday ? styles.doneBtn : undefined}
                    onClick={() => onToggle(h.id)}
                  />
                  <IconButton
                    label="Delete habit"
                    icon={TrashIcon}
                    variant="ghost"
                    size="sm"
                    onClick={() => onRemove(h.id)}
                  />
                </HStack>
              </HStack>
            );
          })}
        </VStack>
      )}
    </Panel>
  );
}

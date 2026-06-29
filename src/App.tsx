import { useState } from 'react';
import * as stylex from '@stylexjs/stylex';
import { Text } from '@astryxdesign/core/Text';
import { VStack, HStack } from '@astryxdesign/core/Layout';
import { Grid } from '@astryxdesign/core/Grid';
import { Avatar } from '@astryxdesign/core/Avatar';
import { StatusDot } from '@astryxdesign/core/StatusDot';
import {
  SegmentedControl,
  SegmentedControlItem,
} from '@astryxdesign/core/SegmentedControl';
import { useTracker, currentStreak, todayISO } from './lib/storage';
import { Habits } from './components/Habits';
import { Tasks } from './components/Tasks';
import { Expenses } from './components/Expenses';
import { StatCard } from './components/StatCard';
import {
  FlameIcon,
  TargetIcon,
  ListIcon,
  WalletIcon,
  GridIcon,
  SparkIcon,
} from './components/icons';

const styles = stylex.create({
  page: {
    minHeight: '100vh',
    background:
      'linear-gradient(180deg, var(--color-surface-overlay, #f3f4f6) 0%, transparent 240px)',
  },
  shell: {
    width: '100%',
    maxWidth: 880,
    marginInline: 'auto',
    paddingInline: 20,
    paddingTop: 32,
    paddingBottom: 64,
  },
  brandRow: { justifyContent: 'space-between', alignItems: 'center', width: '100%' },
  brandLeft: { alignItems: 'center', gap: 12 },
  logo: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: 44,
    height: 44,
    borderRadius: 12,
    color: '#fff',
    background: 'linear-gradient(135deg, #6366f1, #a855f7)',
  },
  appTitle: { fontSize: 22, fontWeight: 700, letterSpacing: '-0.01em' },
  tagline: { color: 'var(--color-content-secondary, #6b7280)', fontSize: 13 },
  navWrap: { width: '100%', overflowX: 'auto' },
});

type Tab = 'overview' | 'habits' | 'tasks' | 'expenses';

export default function App() {
  const t = useTracker();
  const { habits, tasks, expenses } = t.data;
  const [tab, setTab] = useState<Tab>('overview');

  const today = todayISO();
  const habitsDoneToday = habits.filter((h) => h.history.includes(today)).length;
  const tasksOpen = tasks.filter((x) => !x.done).length;
  const bestStreak = habits.reduce((m, h) => Math.max(m, currentStreak(h.history)), 0);
  const spentToday = expenses
    .filter((e) => e.date === today)
    .reduce((s, e) => s + e.amount, 0);
  const totalSpent = expenses.reduce((s, e) => s + e.amount, 0);
  const allDone = habits.length > 0 && habitsDoneToday === habits.length;

  return (
    <main {...stylex.props(styles.page)}>
      <div {...stylex.props(styles.shell)}>
        <VStack gap={8}>
          {/* Header */}
          <HStack xstyle={styles.brandRow}>
            <HStack xstyle={styles.brandLeft}>
              <span {...stylex.props(styles.logo)}>{SparkIcon}</span>
              <VStack gap={0}>
                <Text xstyle={styles.appTitle}>Personal Tracker</Text>
                <Text xstyle={styles.tagline}>
                  Habits, tasks &amp; spending — all in one place
                </Text>
              </VStack>
            </HStack>
            <HStack gap={3} style={{ alignItems: 'center' }}>
              <StatusDot
                variant={allDone ? 'success' : 'accent'}
                label={allDone ? 'All habits done today' : 'On track'}
                isPulsing={allDone}
              />
              <Avatar name="You" size={36} />
            </HStack>
          </HStack>

          {/* Tab navigation */}
          <div {...stylex.props(styles.navWrap)}>
            <SegmentedControl
              label="Sections"
              value={tab}
              onChange={(v) => setTab(v as Tab)}
            >
              <SegmentedControlItem value="overview" label="Overview" icon={GridIcon} />
              <SegmentedControlItem value="habits" label="Habits" icon={TargetIcon} />
              <SegmentedControlItem value="tasks" label="Tasks" icon={ListIcon} />
              <SegmentedControlItem value="expenses" label="Expenses" icon={WalletIcon} />
            </SegmentedControl>
          </div>

          {/* Content */}
          {tab === 'overview' && (
            <VStack gap={6}>
              <Grid columns={{ minWidth: 150, repeat: 'fit' }} gap={4}>
                <StatCard
                  icon={TargetIcon}
                  value={`${habitsDoneToday}/${habits.length}`}
                  label="Habits today"
                  variant="purple"
                />
                <StatCard
                  icon={FlameIcon}
                  value={bestStreak}
                  label="Best streak"
                  hint="consecutive days"
                  variant="orange"
                />
                <StatCard
                  icon={ListIcon}
                  value={tasksOpen}
                  label="Open tasks"
                  variant="blue"
                />
                <StatCard
                  icon={WalletIcon}
                  value={`$${spentToday.toFixed(0)}`}
                  label="Spent today"
                  hint={`$${totalSpent.toFixed(0)} all-time`}
                  variant="green"
                />
              </Grid>

              <Habits
                habits={habits}
                onAdd={t.addHabit}
                onToggle={t.toggleHabitToday}
                onRemove={t.removeHabit}
              />
            </VStack>
          )}

          {tab === 'habits' && (
            <Habits
              habits={habits}
              onAdd={t.addHabit}
              onToggle={t.toggleHabitToday}
              onRemove={t.removeHabit}
            />
          )}

          {tab === 'tasks' && (
            <Tasks
              tasks={tasks}
              onAdd={t.addTask}
              onToggle={t.toggleTask}
              onRemove={t.removeTask}
            />
          )}

          {tab === 'expenses' && (
            <Expenses
              expenses={expenses}
              onAdd={t.addExpense}
              onRemove={t.removeExpense}
            />
          )}

          <Text style={{ textAlign: 'center', fontSize: 12, opacity: 0.5 }}>
            Built with Astryx · data saved locally in your browser
          </Text>
        </VStack>
      </div>
    </main>
  );
}

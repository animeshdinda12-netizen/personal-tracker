import { useState } from 'react';
import * as stylex from '@stylexjs/stylex';
import { Button } from '@astryxdesign/core/Button';
import { IconButton } from '@astryxdesign/core/IconButton';
import { TextInput } from '@astryxdesign/core/TextInput';
import { NumberInput } from '@astryxdesign/core/NumberInput';
import { Badge } from '@astryxdesign/core/Badge';
import { Text } from '@astryxdesign/core/Text';
import { VStack, HStack } from '@astryxdesign/core/Layout';
import { EmptyState } from '@astryxdesign/core/EmptyState';
import type { BadgeVariant } from '@astryxdesign/core/Badge';
import { Panel } from './Panel';
import type { Expense } from '../lib/storage';
import { PlusIcon, TrashIcon, WalletIcon } from './icons';

const styles = stylex.create({
  form: { alignItems: 'flex-end', width: '100%', flexWrap: 'wrap' },
  what: { flexGrow: 1, minWidth: 160 },
  totalRow: {
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    padding: 16,
    borderRadius: 12,
    backgroundColor: 'var(--color-surface-overlay, rgba(0,0,0,0.04))',
  },
  totalLabel: { fontSize: 13, color: 'var(--color-content-secondary, #6b7280)' },
  totalValue: { fontSize: 26, fontWeight: 700, fontVariantNumeric: 'tabular-nums' },
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
  amount: { fontWeight: 600, fontVariantNumeric: 'tabular-nums' },
  date: { fontSize: 12, color: 'var(--color-content-tertiary, #9ca3af)' },
});

const CATEGORY_VARIANT: Record<string, BadgeVariant> = {
  Food: 'orange',
  Transport: 'cyan',
  Shopping: 'pink',
  Bills: 'purple',
  Fun: 'green',
  Other: 'neutral',
};
const catVariant = (c: string): BadgeVariant => CATEGORY_VARIANT[c] ?? 'teal';

export function Expenses({
  expenses,
  onAdd,
  onRemove,
}: {
  expenses: Expense[];
  onAdd: (label: string, amount: number, category: string) => void;
  onRemove: (id: string) => void;
}) {
  const [label, setLabel] = useState('');
  const [amount, setAmount] = useState<number | null>(null);
  const [category, setCategory] = useState('Other');

  const total = expenses.reduce((s, e) => s + e.amount, 0);

  const submit = () => {
    if (amount == null) return;
    onAdd(label, amount, category);
    setLabel('');
    setAmount(null);
    setCategory('Other');
  };

  return (
    <Panel
      title="Expenses"
      subtitle="Track where your money goes"
      action={<Badge variant="green" label={`$${total.toFixed(2)} total`} />}
    >
      <VStack gap={4}>
        <HStack gap={3} xstyle={styles.form}>
          <span {...stylex.props(styles.what)}>
            <TextInput
              label="Description"
              placeholder="Coffee"
              value={label}
              width="100%"
              onChange={(v: string) => setLabel(v)}
              onEnter={submit}
            />
          </span>
          <NumberInput
            label="Amount"
            placeholder="0.00"
            value={amount}
            min={0}
            step={0.5}
            units="$"
            width={140}
            onChange={(v: number | null) => setAmount(v)}
          />
          <TextInput
            label="Category"
            placeholder="Food"
            value={category}
            width={160}
            onChange={(v: string) => setCategory(v)}
          />
          <Button label="Add" variant="primary" icon={PlusIcon} onClick={submit} />
        </HStack>

        <HStack xstyle={styles.totalRow}>
          <VStack gap={1}>
            <Text xstyle={styles.totalLabel}>Total spent</Text>
            <Text xstyle={styles.totalValue}>${total.toFixed(2)}</Text>
          </VStack>
          <Badge variant="green" label={`${expenses.length} entries`} />
        </HStack>
      </VStack>

      {expenses.length === 0 ? (
        <EmptyState
          icon={WalletIcon}
          title="No expenses logged"
          description="Record your first expense above to see your totals build up."
          isCompact
        />
      ) : (
        <VStack>
          {[...expenses]
            .sort((a, b) => b.createdAt - a.createdAt)
            .map((e) => (
              <HStack key={e.id} gap={3} xstyle={styles.row}>
                <HStack gap={3} style={{ alignItems: 'center' }}>
                  <Text style={{ fontWeight: 600 }}>{e.label}</Text>
                  <Badge variant={catVariant(e.category)} label={e.category} />
                  <Text xstyle={styles.date}>{e.date}</Text>
                </HStack>
                <HStack gap={2} style={{ alignItems: 'center' }}>
                  <Text xstyle={styles.amount}>${e.amount.toFixed(2)}</Text>
                  <IconButton
                    label="Delete expense"
                    icon={TrashIcon}
                    variant="ghost"
                    size="sm"
                    onClick={() => onRemove(e.id)}
                  />
                </HStack>
              </HStack>
            ))}
        </VStack>
      )}
    </Panel>
  );
}

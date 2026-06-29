import * as stylex from '@stylexjs/stylex';
import { Card } from '@astryxdesign/core/Card';
import type { CardVariant } from '@astryxdesign/core/Card';
import { VStack } from '@astryxdesign/core/Layout';
import { Text } from '@astryxdesign/core/Text';
import type { ReactNode } from 'react';

const styles = stylex.create({
  icon: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: 'var(--color-surface-overlay, rgba(0,0,0,0.05))',
    color: 'var(--color-content-primary, #111827)',
  },
  value: {
    fontSize: 28,
    fontWeight: 700,
    lineHeight: 1.1,
    fontVariantNumeric: 'tabular-nums',
  },
  label: { color: 'var(--color-content-secondary, #6b7280)', fontSize: 13 },
  hint: { color: 'var(--color-content-tertiary, #9ca3af)', fontSize: 12 },
});

export function StatCard({
  icon,
  value,
  label,
  hint,
  variant = 'muted',
}: {
  icon: ReactNode;
  value: ReactNode;
  label: string;
  hint?: string;
  variant?: CardVariant;
}) {
  return (
    <Card variant={variant} padding={5}>
      <VStack gap={3}>
        <span {...stylex.props(styles.icon)}>{icon}</span>
        <VStack gap={1}>
          <Text xstyle={styles.value}>{value}</Text>
          <Text xstyle={styles.label}>{label}</Text>
          {hint ? <Text xstyle={styles.hint}>{hint}</Text> : null}
        </VStack>
      </VStack>
    </Card>
  );
}

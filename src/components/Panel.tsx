import * as stylex from '@stylexjs/stylex';
import { VStack, HStack } from '@astryxdesign/core/Layout';
import { Card } from '@astryxdesign/core/Card';
import { Heading, Text } from '@astryxdesign/core/Text';
import type { CardVariant } from '@astryxdesign/core/Card';
import type { ReactNode } from 'react';

const styles = stylex.create({
  header: {
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
  },
  titleWrap: { gap: 2 },
  subtitle: { color: 'var(--color-content-secondary, #6b7280)' },
});

/** A polished surface section built on Astryx Card with an optional
 *  header action slot and subtitle. */
export function Panel({
  title,
  subtitle,
  action,
  variant = 'default',
  children,
}: {
  title: string;
  subtitle?: string;
  action?: ReactNode;
  variant?: CardVariant;
  children: ReactNode;
}) {
  return (
    <Card variant={variant} padding={6} maxWidth="100%">
      <VStack gap={5}>
        <HStack xstyle={styles.header}>
          <VStack xstyle={styles.titleWrap}>
            <Heading level={3}>{title}</Heading>
            {subtitle ? <Text xstyle={styles.subtitle}>{subtitle}</Text> : null}
          </VStack>
          {action}
        </HStack>
        {children}
      </VStack>
    </Card>
  );
}

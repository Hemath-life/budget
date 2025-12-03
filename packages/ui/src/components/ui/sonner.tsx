import type { ToasterProps } from 'sonner';
import { Toaster as Sonner } from 'sonner';
import { useTheme } from '../../common/theme';

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = 'system' } = useTheme();

  return (
    <Sonner
      theme={theme as ToasterProps['theme']}
      className="toaster group [&_div[data-content]]:w-full"
      style={
        {
          '--normal-bg': 'var(--popover)',
          '--normal-text': 'var(--popover-foreground)',
          '--normal-border': 'var(--border)',
        } as React.CSSProperties
      }
      closeButton
      position="top-right"
      {...props}
    />
  );
};

export { Toaster };

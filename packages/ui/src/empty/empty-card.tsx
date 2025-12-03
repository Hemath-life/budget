import { Button, Card, CardContent } from '#/components/ui';
import { Plus } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

interface EmptyCardProps {
    icon?: LucideIcon;
    title: string;
    description: string;
    actionLabel?: string;
    onAction?: () => void;
    className?: string;
    iconClassName?: string;
    iconContainerClassName?: string;
    buttonClassName?: string;
}

export function EmptyCard({
    icon: Icon,
    title,
    description,
    actionLabel,
    onAction,
    className = '',
    iconClassName = 'w-8 h-8',
    iconContainerClassName = 'w-16 h-16 bg-gradient-to-br from-emerald-100 to-teal-100 dark:from-emerald-900 dark:to-teal-900 rounded-full flex items-center justify-center mx-auto mb-4',
    buttonClassName = 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg',
}: EmptyCardProps) {
    return (
        <Card className={`border ${className}`}>
            <CardContent className="text-center py-12">
                {Icon && (
                    <div className={iconContainerClassName}>
                        <Icon
                            className={`text-emerald-600 dark:text-emerald-400 ${iconClassName}`}
                        />
                    </div>
                )}
                <h3 className="text-xl font-semibold mb-2">{title}</h3>
                <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                    {description}
                </p>
                {actionLabel && onAction && (
                    <Button onClick={onAction} className={buttonClassName}>
                        <Plus className="w-4 h-4 mr-2" />
                        {actionLabel}
                    </Button>
                )}
            </CardContent>
        </Card>
    );
}

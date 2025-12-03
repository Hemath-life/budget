import { type ColumnDef } from '@tanstack/react-table';
import { Checkbox } from '#/components/ui/checkbox';
import { Badge } from '#/components/ui/badge';
import { CheckCircle, XCircle, type LucideIcon } from 'lucide-react';
import { DataTableColumnHeader } from './data-table-column-header';
import {
    DataTableRowActions,
    type DataTableRowActionsProps,
} from './data-table-row-actions';
import { format, isValid, parseISO } from 'date-fns';

// ============================================================================
// Checkbox Selection Column
// ============================================================================

export interface CheckboxColumnOptions {
    className?: string;
}

export function createCheckboxColumn<TData>(
    options: CheckboxColumnOptions = {},
): ColumnDef<TData> {
    return {
        id: 'select',
        header: ({ table }) => (
            <div className="flex items-center justify-center">
                <Checkbox
                    checked={
                        table.getIsAllPageRowsSelected() ||
                        (table.getIsSomePageRowsSelected() && 'indeterminate')
                    }
                    onCheckedChange={(value) =>
                        table.toggleAllPageRowsSelected(!!value)
                    }
                    aria-label="Select all"
                />
            </div>
        ),
        cell: ({ row }) => (
            <div className="flex items-center justify-center ">
                <Checkbox
                    checked={row.getIsSelected()}
                    onCheckedChange={(value) => row.toggleSelected(!!value)}
                    aria-label="Select row"
                />
            </div>
        ),
        enableSorting: false,
        enableHiding: false,
        meta: {
            className: options.className || 'w-12',
        },
    };
}

// ============================================================================
// ID Column
// ============================================================================

export interface IdColumnOptions {
    accessorKey?: string;
    headerTitle?: string;
    className?: string;
    formatter?: (id: string) => string;
}

export function createIdColumn<TData>(
    options: IdColumnOptions = {},
): ColumnDef<TData> {
    const {
        accessorKey = 'id',
        headerTitle = 'ID',
        className = 'w-20',
        formatter = (id: string) => id,
    } = options;

    return {
        accessorKey,
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title={headerTitle} />
        ),
        cell: ({ row }) => {
            const id = row.getValue(accessorKey) as string;
            return (
                <div className="flex items-center  font-mono text-xs text-muted-foreground whitespace-nowrap">
                    {formatter(id)}
                </div>
            );
        },
        meta: {
            className,
        },
    };
}

// ============================================================================
// Icon + Text Column
// ============================================================================

export interface IconTextColumnOptions<TData> {
    accessorKey: string;
    headerTitle: string;
    icon: LucideIcon;
    className?: string;
    iconClassName?: string;
    subtitle?: (row: TData) => string | null;
    formatter?: (value: string) => string;
}

export function createIconTextColumn<TData>(
    options: IconTextColumnOptions<TData>,
): ColumnDef<TData> {
    const {
        accessorKey,
        headerTitle,
        icon: Icon,
        className = 'min-w-[120px]',
        iconClassName = 'text-primary',
        subtitle,
        formatter = (v: string) => v,
    } = options;

    return {
        accessorKey,
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title={headerTitle} />
        ),
        cell: ({ row }) => {
            const value = row.getValue(accessorKey) as string;
            const subtitleText = subtitle ? subtitle(row.original) : null;

            return (
                <div className="flex items-center gap-3 ">
                    <div className="flex-shrink-0 p-2 rounded-lg bg-primary/10">
                        <Icon className={`h-4 w-4 ${iconClassName}`} />
                    </div>
                    <div className="flex flex-col gap-0.5 min-w-0">
                        <div className="font-semibold truncate">
                            {formatter(value)}
                        </div>
                        {subtitleText && (
                            <div className="text-sm text-muted-foreground truncate">
                                {subtitleText}
                            </div>
                        )}
                    </div>
                </div>
            );
        },
        meta: {
            className,
        },
    };
}

// ============================================================================
// Status Badge Column
// ============================================================================

export interface StatusBadgeConfig {
    value: string | boolean | number;
    label: string;
    variant?: 'default' | 'secondary' | 'destructive' | 'outline';
    className?: string;
    icon?: LucideIcon;
}

export interface StatusBadgeColumnOptions<TData> {
    accessorKey: string;
    headerTitle: string;
    className?: string;
    getStatus: (row: TData) => StatusBadgeConfig;
}

export function createStatusBadgeColumn<TData>(
    options: StatusBadgeColumnOptions<TData>,
): ColumnDef<TData> {
    const { accessorKey, headerTitle, className = 'w-24', getStatus } = options;

    return {
        accessorKey,
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title={headerTitle} />
        ),
        cell: ({ row }) => {
            const status = getStatus(row.original);
            const Icon = status.icon;

            return (
                <div className="flex items-center ">
                    <Badge
                        variant={status.variant}
                        className={status.className}
                    >
                        {Icon && <Icon className="h-3 w-3 mr-1" />}
                        {status.label}
                    </Badge>
                </div>
            );
        },
        meta: {
            className,
        },
    };
}

// ============================================================================
// Date Column
// ============================================================================

export interface DateColumnOptions {
    accessorKey: string;
    headerTitle: string;
    className?: string;
    dateFormat?: string;
    showTime?: boolean;
    timeFormat?: string;
    emptyText?: string;
}

export function createDateColumn<TData>(
    options: DateColumnOptions,
): ColumnDef<TData> {
    const {
        accessorKey,
        headerTitle,
        className = 'min-w-[180px]',
        dateFormat = 'dd-MM-yyyy',
        showTime = false,
        timeFormat = 'hh:mm a',
        emptyText = '—',
    } = options;

    return {
        accessorKey,
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title={headerTitle} />
        ),
        cell: ({ row }) => {
            const value = row.getValue(accessorKey) as
                | string
                | number
                | undefined;

            if (!value) {
                return (
                    <div className="flex items-center  text-muted-foreground text-sm">
                        {emptyText}
                    </div>
                );
            }

            // Handle timestamp strings or numbers
            let date: Date;
            if (typeof value === 'number') {
                date = new Date(value);
            } else if (typeof value === 'string') {
                // Try parsing as ISO string first, then as number
                if (!isNaN(Number(value))) {
                    date = new Date(Number(value));
                } else {
                    date = parseISO(value);
                }
            } else {
                return (
                    <span className="text-muted-foreground text-sm">
                        Invalid date
                    </span>
                );
            }

            if (!isValid(date)) {
                return (
                    <div className="flex items-center  text-muted-foreground text-sm">
                        Invalid date
                    </div>
                );
            }

            return (
                <div className="flex items-center  text-sm whitespace-nowrap">
                    {showTime ? (
                        <span className="flex items-center gap-2 whitespace-nowrap">
                            <span>{format(date, dateFormat)}</span>
                            <span className="text-muted-foreground">
                                {format(date, timeFormat)}
                            </span>
                        </span>
                    ) : (
                        format(date, dateFormat)
                    )}
                </div>
            );
        },
        meta: {
            className,
        },
    };
}

// ============================================================================
// Text Column
// ============================================================================

export interface TextColumnOptions {
    accessorKey: string;
    headerTitle: string;
    className?: string;
    fontWeight?: 'normal' | 'medium' | 'semibold' | 'bold';
    formatter?: (value: string) => string;
}

export function createTextColumn<TData>(
    options: TextColumnOptions,
): ColumnDef<TData> {
    const {
        accessorKey,
        headerTitle,
        className = 'min-w-[200px]',
        fontWeight = 'medium',
        formatter = (v: string) => v,
    } = options;

    const fontWeightClass = {
        normal: 'font-normal',
        medium: 'font-medium',
        semibold: 'font-semibold',
        bold: 'font-bold',
    }[fontWeight];

    return {
        accessorKey,
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title={headerTitle} />
        ),
        cell: ({ row }) => {
            const value = row.getValue(accessorKey) as string;
            return (
                <div className={`flex items-center  ${fontWeightClass}`}>
                    {formatter(value)}
                </div>
            );
        },
        meta: {
            className,
        },
    };
}

// ============================================================================
// Number Column
// ============================================================================

export interface NumberColumnOptions {
    accessorKey: string;
    headerTitle: string;
    className?: string;
    align?: 'left' | 'center' | 'right';
    fontWeight?: 'normal' | 'medium' | 'semibold' | 'bold';
    prefix?: string;
    suffix?: string;
    decimals?: number;
    thousandsSeparator?: boolean;
    emptyText?: string;
    formatter?: (value: number) => string;
}

export function createNumberColumn<TData>(
    options: NumberColumnOptions,
): ColumnDef<TData> {
    const {
        accessorKey,
        headerTitle,
        className = 'w-34',
        align = 'left',
        fontWeight = 'medium',
        prefix = '',
        suffix = '',
        decimals,
        thousandsSeparator = false,
        emptyText = '—',
        formatter,
    } = options;

    const fontWeightClass = {
        normal: 'font-normal',
        medium: 'font-medium',
        semibold: 'font-semibold',
        bold: 'font-bold',
    }[fontWeight];

    const alignClass = {
        left: 'text-left',
        center: 'text-center',
        right: 'text-right',
    }[align];

    const formatNumber = (value: number): string => {
        if (formatter) {
            return formatter(value);
        }

        let formatted = value.toString();

        // Apply decimals
        if (decimals !== undefined) {
            formatted = value.toFixed(decimals);
        }

        // Apply thousands separator
        if (thousandsSeparator) {
            const parts = formatted.split('.');
            if (parts[0]) {
                parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
            }
            formatted = parts.join('.');
        }

        return `${prefix}${formatted}${suffix}`;
    };

    return {
        accessorKey,
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title={headerTitle} />
        ),
        cell: ({ row }) => {
            const value = row.getValue(accessorKey) as
                | number
                | null
                | undefined;

            if (value === null || value === undefined) {
                return (
                    <div
                        className={`flex items-center  ${alignClass} text-muted-foreground text-sm`}
                    >
                        {emptyText}
                    </div>
                );
            }

            return (
                <div
                    className={`flex items-center  ${alignClass} ${fontWeightClass}`}
                >
                    {formatNumber(value)}
                </div>
            );
        },
        meta: {
            className,
        },
    };
}

// ============================================================================
// Actions Column
// ============================================================================

export interface ActionsColumnOptions<TData> {
    className?: string;
    getActions: (row: TData) => Omit<DataTableRowActionsProps<TData>, 'row'>;
}

export function createActionsColumn<TData>(
    options: ActionsColumnOptions<TData>,
): ColumnDef<TData> {
    const { className = 'w-12', getActions } = options;

    return {
        id: 'actions',
        cell: ({ row }) => {
            const actionProps = getActions(row.original);

            return (
                <div className="flex items-center justify-center ">
                    <DataTableRowActions row={row.original} {...actionProps} />
                </div>
            );
        },
        meta: {
            className,
        },
    };
}

// ============================================================================
// Prebuilt Status Badges
// ============================================================================

export function createActiveInactiveStatus(
    isActive: boolean,
    activeLabel: string = 'Active',
    inactiveLabel: string = 'Inactive',
): StatusBadgeConfig {
    return {
        value: isActive,
        label: isActive ? activeLabel : inactiveLabel,
        variant: isActive ? 'default' : 'secondary',
        className: isActive
            ? 'bg-green-100 text-green-700 hover:bg-green-200'
            : 'bg-gray-100 text-gray-700 hover:bg-gray-200',
        icon: isActive ? CheckCircle : XCircle,
    };
}

export function createDeletedStatus(isDeleted: boolean): StatusBadgeConfig {
    if (isDeleted) {
        return {
            value: isDeleted,
            label: 'Deleted',
            variant: 'secondary',
            className: 'bg-red-100 text-red-700 hover:bg-red-200',
            icon: XCircle,
        };
    }

    return {
        value: isDeleted,
        label: 'Active',
        variant: 'default',
        className: 'bg-green-100 text-green-700 hover:bg-green-200',
        icon: CheckCircle,
    };
}

export function createCurrentStatus(
    isCurrent: boolean,
    isActive: boolean,
): StatusBadgeConfig {
    if (!isActive) {
        return createDeletedStatus(true);
    }

    return {
        value: isCurrent,
        label: isCurrent ? 'Current' : 'Inactive',
        variant: isCurrent ? 'default' : 'secondary',
        className: isCurrent
            ? 'bg-green-100 text-green-700 hover:bg-green-200'
            : 'bg-gray-100 text-gray-700 hover:bg-gray-200',
        icon: isCurrent ? CheckCircle : XCircle,
    };
}

import { LucideIcon } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { cn } from '@/lib/utils'

type Props = {
    icon: LucideIcon
    label: string
    value: string | number
    hint?: string
    className?: string
}

export function StatTile({ icon: Icon, label, value, hint, className }: Props) {
    return (
        <Card className={cn('flex flex-col gap-3 p-5 transition-shadow hover:shadow-md', className)}>
            <div className="flex items-center justify-between">
                <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                    {label}
                </span>
                <Icon className="h-4 w-4 text-muted-foreground" />
            </div>
            <div className="flex flex-col gap-0.5">
                <span className="text-3xl font-bold tabular-nums leading-none">{value}</span>
                {hint && <span className="text-xs text-muted-foreground">{hint}</span>}
            </div>
        </Card>
    )
}

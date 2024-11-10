import { Badge } from "@mantine/core";


export default function StatusBadge({ label, level }: { label: string | undefined, level: number }) {
    enum statusColor {
        'turquoise',
        'green',
        'yellow',
        'orange',
        'red'
    }
    return (
        <Badge color={statusColor[level]} size='lg'>{label}</Badge>
    )
}

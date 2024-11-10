import { Paper, Text, Group } from "@mantine/core"
import { IconArrowDownRight, IconArrowUpRight, IconChecklist } from "@tabler/icons-react";
import { formatMoney } from "@/utils/string";

type Props = {
    label?: string,
    number?: number,
    icon?: JSX.ElementType,
    desc?: string
}
export default function StatusCard({
    label = 'Label',
    number = 123456,
    icon = IconChecklist,
    desc = 'better than you'
}: Props) {

    const Icon = icon

    return (
        <Paper radius='0.25rem' withBorder p='1rem' maw={300}>
            <Group justify="space-between">
                <Text size='xs' fw={700} c='gray.6' tt='uppercase'>{label}</Text>
                <Icon
                    style={{
                        display: 'inline-block',
                        color: 'var(--mantine-color-gray-6)'
                    }}
                    size="1.5rem"
                    stroke={1.5} />
            </Group>
            <Group align='flex-end'>
                <Text size='1.2rem' fw={700} mt='1rem'>{formatMoney(number)}</Text>
            </Group>
            {desc === undefined ? <></> : <Text size='sm' fw='400' c='gray.6' mt='0.25rem'>{desc}</Text>}
        </Paper>
    )
}


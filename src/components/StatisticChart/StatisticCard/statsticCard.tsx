import { Paper, Text, Group } from "@mantine/core"
import { IconArrowDownRight, IconArrowUpRight } from "@tabler/icons-react";
import { formatMoney } from "@/utils/string";

type Props = {
  label?: string,
  number?: number,
  per?: number,
  desc?: string
}
export default function StatsticCard({
  label = 'Label',
  number = 123456,
  per = 36,
  desc = 'better than you'
}: Props) {
  const DiffIcon = per > 0 ? IconArrowUpRight : IconArrowDownRight;

  return (
    <Paper radius='0.25rem' withBorder p='1rem' maw={300}>
      <Text size='xs' fw={700} c='gray.6' tt='uppercase'>{label}</Text>
      <Group align='flex-end'>
        <Text size='1.2rem' fw={700} mt='1rem'>{formatMoney(number)}<span className="text-sm"> đ</span></Text>
        {(per === undefined) ? <></> :
          <Text c={per > 0 ? 'teal' : 'red'} fw='500' fz='sm'>
            <span>{per}%</span>
            <DiffIcon className="inline-block" size="1rem" stroke={1.5} />
          </Text>
        }
      </Group>
      {desc === undefined ? <></> : <Text size='sm' fw='400' c='gray.6' mt='0.25rem'>{desc}</Text>}
    </Paper>
  )
}


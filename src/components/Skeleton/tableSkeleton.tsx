import { Skeleton } from "@mantine/core";

type Props = {
  row?: number,
  col?: number,
}
export default function TableSkeleton({
  row = 5,
  col = 4
}: Props) {

  const Row = Array(col)
    .fill(0)
    .map(i => (
      <Skeleton height={24} radius="sm" />
    ))
  const Table = Array(row)
    .fill(0)
    .map(i => (
      <div className="flex gap-[16px]">
        {Row}
      </div>
    ))
  return (
    <div className="flex flex-col gap-[24px]">
      {Table}
    </div>
  )
}

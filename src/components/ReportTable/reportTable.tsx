'use client';
import { Button, Flex, Group, Pagination, Table, Text } from '@mantine/core';
import { useState } from 'react';

function chunk<T>(array: T[], size: number): T[][] {
  if (!array.length) {
    return [];
  }
  const head = array.slice(0, size);
  const tail = array.slice(size);
  return [head, ...chunk(tail, size)];
}

const mockData = chunk(
  Array(30)
    .fill(0)
    .map((_, index) => ({ id: index, name: 'kjdjsdk' })),
  5
);

type Props = {
  title?: string;
  data?: Object[];
};
export default function ReportTable({
  title = 'Bảng báo cáo bán hàng theo ...',
  data,
}: Props) {
  const [activePage, setPage] = useState(1);
  const items = mockData[activePage - 1].map((item) => (
    <Table.Tr>
      <Table.Td>{item.id}</Table.Td>
      <Table.Td>{item.name}</Table.Td>
      <Table.Td>{item.name}</Table.Td>
      <Table.Td>{item.name}</Table.Td>
    </Table.Tr>
  ));
  return (
    <Flex direction='column' gap='26px'>
      <Group justify='space-between'>
        <Text c='gray.9' fw='700' tt='uppercase' p='0.5rem' bg='turquoise.1'>
          {title}
        </Text>
        <Button>Xuất file</Button>
      </Group>
      <div className='border-[0.5px] border-solid rounded-[4px] w-full py-[12px] px-[16px]'>
        <Table>
          <Table.Thead>
            <Table.Tr>
              <Table.Th>Id</Table.Th>
              <Table.Th>Name</Table.Th>
              <Table.Th>Name</Table.Th>
              <Table.Th>Name</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>{items}</Table.Tbody>
        </Table>
      </div>
      <Pagination
        classNames={{
          control: 'pagination-control'
        }}
        className='self-center'
        total={mockData.length}
        value={activePage}
        onChange={setPage}
        mt='sm'
      />
    </Flex>
  );
}

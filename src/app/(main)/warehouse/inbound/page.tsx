'use client';
import UserContext from '@/contexts/UserContext';
import queryClient from '@/helpers/client';
import BillService from '@/services/billService';
import {
  Button,
  Group,
  Loader,
  Pagination,
  ScrollArea,
  Skeleton,
  Stack,
  Title,
} from '@mantine/core';
import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useContext, useState } from 'react';
import ImportBillTable from './importBillTable';

export default function InboundPage() {
  // some inner constant var
  // --start--
  const numOfBillInDisplay: number = 10;
  // --end--

  const router = useRouter();
  const currentPath = usePathname();
  const { user } = useContext(UserContext);
  const [activePage, setPage] = useState(1);
  const bills = useQuery({
    queryKey: ['inbound_bills', activePage],
    queryFn: () => {
      const billService = new BillService(user);
      return billService.getAllImportBill(numOfBillInDisplay, activePage);
    },
    enabled: !!user,
  });

  const numberOfBill = useQuery({
    queryKey: ['number_of_bill'],
    queryFn: () => {
      const billService = new BillService(user);
      return billService.getNumberOfBill();
    },
    enabled: !!user,
  });

  const calPages = (num: any) => {
    return Math.ceil(num / numOfBillInDisplay);
  };
  return (
    <ScrollArea w='100%' h='100%' py='1rem' px='2rem'>
      <Group justify='space-between' mb='md'>
        <Title order={4}>Danh sách phiếu nhập kho</Title>
        <Button
          // className='bg-0-primary-color-6 text-white'
          bg={'#02B1AB'}
          className=' text-white'
          onClick={() => {
            router.push(`${currentPath}/create_import_bill`);
          }}
        >
          Tạo phiếu
        </Button>
      </Group>
      {bills.isPending ? (
        <div className='w-full h-[500px] flex justify-center items-center'>
          <Loader type='dots' />
        </div>
      ) : (
        <div className='flex flex-col border-[0.5px] border-solid rounded-[4px] w-full py-[12px] px-[16px]'>
          <ImportBillTable bills={bills.data} />
          <Pagination
            classNames={{
              control: 'pagination-control',
            }}
            className='self-center'
            total={calPages(numberOfBill.data?.export)}
            value={activePage}
            onChange={setPage}
            mt='sm'
          />
        </div>
      )}
    </ScrollArea>
  );
}

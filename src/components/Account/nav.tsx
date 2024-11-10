'use client';
import { useContext, useState } from 'react';
import { IconUser, IconChecklist } from '@tabler/icons-react';
import { Box, NavLink, Stack } from '@mantine/core';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import UserContext from '@/contexts/UserContext';

// interface HandleRouterInterface {
//   [id: number]: Function;
// }

const AccountNav = ({ namePage }: { namePage: string }) => {
  const { user } = useContext(UserContext);
  const [active, setActive] = useState(namePage);

  return (
    <Stack
      gap={0}
      p={10}
      w={200}
      h={'100%'}
      pt={90}
      justify='flex-start'
      bg={'white'}
      className=' min-h-screen rounded-md'
    >
      {/* {items} */}
      <NavLink
        active={active === 'details'}
        label='Thông tin tài khoản'
        leftSection={<IconUser size='1rem' stroke={1.5} />}
        className='rounded-[12px]  text-black'
        h={50}
        mb={12}
        href={'/account/details'}
        style={active === 'details' ? { color: '#02B1AB' } : { color: '#000' }}
        component={Link}
      />

      {user?.roles[0] === 'customer' && (
        <NavLink
          active={active === 'orders'}
          label='Đơn hàng'
          leftSection={<IconChecklist size='1rem' stroke={1.5} />}
          className='rounded-[12px] text-black'
          h={50}
          mb={12}
          style={active === 'orders' ? { color: '#02B1AB' } : { color: '#000' }}
          href={'/account/orders'}
          component={Link}
        />
      )}
    </Stack>
  );
};

export default AccountNav;

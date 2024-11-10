import { formatMoney } from '@/utils/string';
import { Divider, Group, HoverCard, Image, Stack, Text } from '@mantine/core';
import toast from 'react-hot-toast';
import { IconInfoCircle } from '@tabler/icons-react';

const Voucher = ({
  image,
  title,
  description,
  expiry,
  detail,
  status,
  isChecked,
  setChecked,
  index,
  code,
  discount_min_order_value,
  type,
  value,
}: {
  image: string;
  title: string;
  description: string;
  expiry: string;
  detail: string | null;
  status: boolean;
  isChecked: boolean;
  setChecked: Function;
  index: number;
  code: string;
  discount_min_order_value: number;
  type: string;
  value: number;
}) => {
  const convertDateFormat = (expiry: string) => {
    let newExpiry = expiry.split('T')[0].split('-');
    return `${newExpiry[2]}/${newExpiry[1]}/${newExpiry[0]}`;
  };
  return (
    <Group
      className={
        isChecked && status
          ? ' h-[100px] w-full border-black border-[1.5px] cursor-pointer rounded-[5px] shadow p-[5px] hover:bg-slate-50 relative'
          : `h-[100px] w-full rounded-[5px] shadow-md p-[5px] border-[0.5px] border-gray-300 hover:bg-slate-50 relative ${
              status ? 'cursor-pointer' : 'cursor-not-allowed'
            }`
      }
      onClick={() => {
        if (status) {
          if (isChecked) {
            setChecked({ _id: 'remove', code: 'remove' });
          } else {
            setChecked({ _id: index, code: code });
          }
        } else {
          toast.error('Không đủ điều kiện để sử dụng Voucher này.');
        }
      }}
    >
      <HoverCard
        width={200}
        shadow='md'
        withArrow
        openDelay={200}
        closeDelay={400}
        position={'left'}
      >
        <HoverCard.Target>
          <IconInfoCircle
            width={15}
            height={15}
            className=' absolute top-[10px] right-[15px]'
          />
        </HoverCard.Target>
        <HoverCard.Dropdown>
          <Text>{description}</Text>
        </HoverCard.Dropdown>
      </HoverCard>
      <div className='flex-[1] flex items-center justify-center'>
        <Image h={80} w='auto' src={image} />
      </div>
      <Divider orientation='vertical' variant='dashed' color='black' />
      <Stack className='flex-[2]'>
        <Stack className=' gap-0'>
          <Text className=' font-bold'>{`Giảm  ${
            type === 'percent' ? `${value}%` : `${formatMoney(value)}K`
          }`}</Text>
          <Group gap={0} className=' items-start'>
            <Text>{`Cho đơn hàng tối thiểu ${formatMoney(
              discount_min_order_value
            )}`}</Text>
            <Text className=' text-[10px]'>đ</Text>
          </Group>
        </Stack>
        <Group className=' relative'>
          <Text>{`HSD: ${convertDateFormat(expiry)}`}</Text>

          {!status && (
            <Text className=' absolute bottom-0 right-0 text-red-500 font-light text-[15px]'>
              {`Chưa thỏa \n điều kiện`}
            </Text>
          )}
        </Group>
      </Stack>
    </Group>
  );
};

export default Voucher;

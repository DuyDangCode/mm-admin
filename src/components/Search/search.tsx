'use client';
import '@/styles/global.css';
import { productService } from '@/services/productService';
import { ActionIcon, Button, LoadingOverlay, TextInput } from '@mantine/core';
import { IconSearch } from '@tabler/icons-react';
import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import toast from 'react-hot-toast';
import queryClient from '@/helpers/client';
import { useHover } from '@mantine/hooks';
type SearchText = {
  content: string;
};
export default function Search({ content }: SearchText) {
  const [keyWord, setKeyWord] = useState<string>('');
  const router = useRouter();
  const { hovered, ref } = useHover<any>();

  const search = async (keyWord: string) => {
    let isSuccess = false;

    await queryClient.prefetchQuery({
      queryKey: ['search', keyWord],
      queryFn: async () => {
        await toast.promise(
          productService.search(keyWord).then((res) => {
            if (res.length != 0) {
              isSuccess = true;
              return res;
            } else {
              throw new Error();
            }
          }),
          {
            loading: 'Đang tìm...',
            success: <b>Đã tìm thấy.</b>,
            error: <b>Không tìm thấy sản phẩm.</b>,
          }
        );
        // await productService.search(keyWord).then((res) => {
        //   if (res.length != 0) {
        //     isSuccess = true;
        //   }
        //   return res;
        // });
      },
    });

    if (isSuccess) {
      router.push(`/find?key=${keyWord}`);
    }
  };
  return (
    <TextInput
      w='37.5rem'
      rightSection={
        <ActionIcon
          bg={'transparent'}
          ref={ref}
          h={'fit-content'}
          w={'fit-content'}
          p={2}
          className=' bg-transparent'
          style={
            hovered
              ? {
                  borderRadius: 9999,
                  backgroundColor: '#F1f5f9',
                }
              : {
                  borderRadius: 9999,
                }
          }
        >
          <IconSearch
            color='#8E8E8E'
            onClick={() => {
              search(keyWord);
            }}
            style={{
              height: '1.5rem',
              width: '1.5rem',
              background: 'transparent',
            }}
          />
        </ActionIcon>
      }
      placeholder='Search...'
      radius='xl'
      size='sm'
      ml='md'
      value={keyWord}
      onChange={(event) => {
        setKeyWord(event.currentTarget.value);
      }}
    />
  );
}

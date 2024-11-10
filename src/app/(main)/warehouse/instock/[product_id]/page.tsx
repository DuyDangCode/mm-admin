'use client';
import UserContext from '@/contexts/UserContext';
import { productService } from '@/services/productService';
import {
  ActionIcon,
  Box,
  Group,
  ScrollArea,
  Stack,
  Tabs,
  Title,
  Text,
  AspectRatio,
  Image,
  Button,
  FileButton,
  Popover,
  Collapse,
  Rating,
  Divider,
  Flex,
  Affix,
  Transition,
  rem,
  Loader,
} from '@mantine/core';
import { useMutation, useQuery } from '@tanstack/react-query';
import React, { useContext, useEffect, useRef, useState } from 'react';
import Loading from './loading';
import BackButton from '@/components/BackButton/backButton';
import {
  IconArrowDown,
  IconArrowUp,
  IconEditCircle,
} from '@tabler/icons-react';
import { formatMoney } from '@/utils/string';
import { useDisclosure, useWindowScroll } from '@mantine/hooks';
import CommentService from '@/services/commentService';
import { useForm } from '@mantine/form';
import GeneralInfoForm from './generalInfoForm';
import DescInfoForm from './descInfoForm';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import toast from 'react-hot-toast';
import queryClient from '@/helpers/client';

const ImageLink = 'https://blog.alliedmarketresearch.com/images/user_icon.png';
function GeneralInfoField({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <Box px='8'>
      <Text fw='700' c='gray.6' size='sm'>
        {label}
      </Text>
      <Text lineClamp={2} w='240'>
        {children}
      </Text>
    </Box>
  );
}

const futherSaveImgSolution =
  'Chức năng này chưa thể hoàn thiện vì chưa có giải pháp cho việc lưu trữ file ảnh.';
const rateData = [
  { id: 0, label: 'Tất cả' },
  { id: 5, label: '5 sao' },
  { id: 4, label: '4 sao' },
  { id: 3, label: '3 sao' },
  { id: 2, label: '2 sao' },
  { id: 1, label: '1 sao' },
];
export default function WarehouseProductPage({
  params,
  searchParams,
}: {
  params: { product_id: string };
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const router = useRouter();
  const currentPath = usePathname();
  const searchParamsHook = useSearchParams();
  const { user } = useContext(UserContext);

  const [generalEdit, setGeneralEdit] = useState(false);
  const [descEdit, setDescEdit] = useState(false);
  const [isRateChoosing, setIsRatechoosing] = useState(0);
  const [scroll, scrollTo] = useWindowScroll();

  const target_product = useQuery({
    queryKey: ['target_product', params.product_id],
    queryFn: () => {
      return productService.getProductById(params.product_id);
    },
    enabled: !!user,
  });

  const updateProductMutation = useMutation({
    mutationKey: ['update_product'],
    mutationFn: (change: Object) => {
      return productService.updateProduct(user, params.product_id, change);
    },
    onSuccess: () => {
      toast.success('Thay đổi thành công');
      return queryClient.invalidateQueries({
        queryKey: ['target_product', params.product_id],
      });
    },
    onError: (status) => {
      toast.error(status.message);
    },
  });
  const comments = useQuery({
    queryKey: ['comments', params.product_id],
    queryFn: () => {
      const commentService = new CommentService();
      return commentService.getAllComments(params.product_id);
    },
    refetchOnWindowFocus: false,
    staleTime: Infinity,
  });

  const publishMutation = useMutation({
    mutationFn: () => {
      return productService.publish(user, params.product_id);
    },
    onSuccess: () => {
      toast.success('Trưng bày thành công');
      router.replace(
        `${currentPath.substring(
          0,
          currentPath.lastIndexOf('/')
        )}?tab=${searchParamsHook.get('state')}`
      );
    },
  });

  const unpublishMutation = useMutation({
    mutationKey: ['unpublish'],
    mutationFn: () => {
      return productService.unpublish(user, params.product_id);
    },
    onSuccess: () => {
      toast.success('Sản phẩm đã được gỡ xuống');
      router.replace(
        `${currentPath.substring(
          0,
          currentPath.lastIndexOf('/')
        )}?tab=${searchParamsHook.get('state')}`
      );
    },
    onError: (err) => {
      toast.error(err.message);
    },
  });

  const handleRateClick = (id: number) => {
    setIsRatechoosing(id);
  };

  return (
    <ScrollArea className='h-full w-full z-[0]' py='1rem' px='2rem'>
      {target_product.isPending ||
        comments.isPending ||
        publishMutation.isPending ||
        unpublishMutation.isPending ? (
        <div className='w-full h-[500px] flex justify-center items-center'>
          <Loader type='dots' />
        </div>
      ) : (
        <div>
          <Group justify='space-between'>
            <Group gap='16'>
              <BackButton />
              <Title order={4}>Thông tin sản phẩm</Title>
            </Group>
            {searchParams.state === 'unpublish' ? (
              <Group gap='16'>
                <Text>*Sản phẩm này chưa được trưng bày</Text>
                <Button
                  className='bg-0-primary-color-6 text-white'
                  variant='filled'
                  size='md'
                  onClick={() => publishMutation.mutate()}
                >
                  <IconArrowUp />
                  Trưng bày
                </Button>
              </Group>
            ) : (
              <Group gap='16'>
                <Text>*Sản phẩm này đã được trưng bày</Text>
                <Button
                  className='bg-rose-500 text-white'
                  variant='filled'
                  size='md'
                  onClick={() => unpublishMutation.mutate()}
                >
                  <IconArrowDown />
                  Không trưng bày
                </Button>
              </Group>
            )}
          </Group>
          <Group mt='lg' align='stretch'>
            {generalEdit === false ? (
              <Stack className='basis-7/12 rounded-[8px] border-[1px]' p='1rem'>
                <Group align='flex-start'>
                  <Title order={5} c='gray.8'>
                    Thông tin chung
                  </Title>
                  <ActionIcon
                    variant='white'
                    size='md'
                    aria-label='Edit product general info'
                    onClick={() => setGeneralEdit(true)}
                  >
                    <IconEditCircle />
                  </ActionIcon>
                </Group>
                <Group align='flex-start'>
                  <GeneralInfoField label='Tên sản phẩm'>
                    {target_product.data?.product_name}
                  </GeneralInfoField>
                  <GeneralInfoField label='Đơn giá'>
                    {formatMoney(target_product.data?.product_price)} đ
                  </GeneralInfoField>
                </Group>
                <Group align='flex-start'>
                  <GeneralInfoField label='Đơn vị'>
                    {target_product.data?.product_unit}
                  </GeneralInfoField>
                  <GeneralInfoField label='Số lượng còn'>
                    {target_product.data?.product_quantity}
                  </GeneralInfoField>
                </Group>
              </Stack>
            ) : (
              <GeneralInfoForm
                id={target_product.data?._id as string}
                name={target_product.data?.product_name as string}
                price={target_product.data?.product_price as number}
                unit={target_product.data?.product_unit as string}
                quantity={target_product.data?.product_quantity as number}
                closeFn={setGeneralEdit}
                mutate={updateProductMutation.mutate}
              />
            )}
            <Stack
              gap='16'
              p='1rem'
              align='center'
              className='w-[400px] rounded-[8px] border-[1px]'
            >
              {/* <AspectRatio ratio={200 / 200} maw={200} w='200' mah={300}> */}
              {/* <div className='h-full w-full flex items-center flex-warp justify-center'> */}

              <Image
                alt='product-thumbnail'
                w='auto'
                h='auto'
                mah={200}
                fit='contain'
                src={target_product.data?.product_thumb}
              />

              {/* </div> */}
              {/* </AspectRatio> */}
              <Popover width={200} position='bottom' withArrow shadow='md'>
                <Popover.Target>
                  <Button variant='light'>Thay ảnh</Button>
                </Popover.Target>
                <Popover.Dropdown>
                  <Text size='xs'>{futherSaveImgSolution}</Text>
                </Popover.Dropdown>
              </Popover>
            </Stack>
          </Group>
          {descEdit === false ? (
            <Stack className='rounded-[8px] border-[1px]' p='1rem' mt='16'>
              <Group>
                <Title order={5} c='gray.8'>
                  Mô tả
                </Title>
                <ActionIcon
                  variant='white'
                  size='md'
                  aria-label='Edit product general info'
                  onClick={() => setDescEdit(true)}
                >
                  <IconEditCircle />
                </ActionIcon>
              </Group>
              <Text>{target_product.data?.product_description}</Text>
            </Stack>
          ) : (
            <DescInfoForm
              id={target_product.data?._id as string}
              desc={target_product.data?.product_description as string}
              closeFn={setDescEdit}
              mutate={updateProductMutation.mutate}
            />
          )}
          <Flex className=' flex-col ml-[100px] mr-[100px] bg-white rounded-[10px] p-[20px] mt-[10px] mb-[20px]'>
            <Text fw='700'>Đánh giá sản phẩm</Text>
            <Group className='ml-[100px] mr-[100px] justify-center align-middle'>
              <Stack className=' gap-1 justify-center items-center'>
                <Text fw={700} size='30px' className=' font-bold text-[30px]'>
                  {target_product.data?.product_ratingAverage}/5
                </Text>
                <Rating
                  value={target_product.data?.product_ratingAverage}
                  fractions={2}
                  readOnly
                />
                <Text className=' font-normal'>
                  {'(' + (comments.data?.length || 1) + ' đánh giá)'}
                </Text>
              </Stack>
              <Group>
                {rateData.map((item) => {
                  return (
                    <Button
                      className={
                        item.id !== isRateChoosing
                          ? 'bg-0-primary-color-6 text-white'
                          : ''
                      }
                      variant={
                        item.id === isRateChoosing ? 'filled' : 'outline'
                      }
                      key={item.id}
                      radius={20}
                      onClick={() => {
                        handleRateClick(item.id);
                      }}
                    >
                      {item.label}
                    </Button>
                  );
                })}
              </Group>
            </Group>
            <Stack>
              {comments.data?.map((person: any) => {
                return (
                  (isRateChoosing == 0 ||
                    isRateChoosing == (person.comment_rating || 3)) && (
                    <Group
                      key={person._id}
                      className='border-b-[1px]'
                      gap='16'
                      align='flex-center'
                      py='1rem'
                      wrap='nowrap'
                    >
                      <Image
                        alt='avt'
                        w='32'
                        h='32'
                        src={
                          person.user_avatar == null || person.user_avatar == ''
                            ? ImageLink
                            : person.user_avatar
                        }
                        className=' rounded-full w-[35px]'
                      />
                      <Stack gap='sm'>
                        <Text>{person.comment_userName}</Text>
                        <Stack gap='0'>
                          <Rating value={person.comment_rating || 3} readOnly />
                          <Text c='gray.6'>{person.createdAt}</Text>
                        </Stack>
                        <Text lineClamp={4}>{person.comment_content}</Text>
                      </Stack>
                    </Group>
                  )
                );
              })}
            </Stack>
          </Flex>
        </div>
      )}
    </ScrollArea>
  );
}

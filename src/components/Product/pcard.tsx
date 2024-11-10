'use client';
import '@/styles/global.css';
import {
  Card,
  Image,
  Group,
  Text,
  Flex,
  ActionIcon,
  Divider,
  Rating,
  Badge,
  Overlay,
  AspectRatio,
  Stack,
} from '@mantine/core';
import { IconShoppingCartPlus } from '@tabler/icons-react';
import { useContext, useEffect, useState } from 'react';
import Styles from './pcard.module.css';
import Link from 'next/link';
import { Product } from '@/utils/response';
import useRQGlobalState from '@/helpers/useRQGlobalState';
import { formatMoney } from '@/utils/string';
import { useMutation } from '@tanstack/react-query';
import useCart from '@/helpers/useCart';
import CartService from '@/services/cartService';
import queryClient from '@/helpers/client';
import toast, { Toaster } from 'react-hot-toast';
import UserContext from '@/contexts/UserContext';
import NImage from 'next/image';

export const PCard = ({ data }: PCardProps) => {
  const { user } = useContext(UserContext);
  const [cart, setCart] = useCart();
  const [discount, setDiscount] = useState(0);

  const addMutation = useMutation({
    mutationKey: ['addProductCart'],
    mutationFn: (productId: string) => {
      const cartServices = new CartService(user);
      console.log('productId', productId);
      return cartServices.addProduct(productId, 1);
    },
    onSuccess: () => {},
    onError: () => {},
    onSettled: () => {},
  });

  const productQuantity =
    data.product_quantity < 1000
      ? data.product_quantity
      : Math.floor(data.product_quantity / 1000) + 'K';

  let quantityNumber = 0;
  if (data.product_quantity && data.product_quantity != 0) {
    quantityNumber = data.product_quantity;
  }

  const random = (max: number = 80, min: number = 0) => {
    return Math.floor(Math.random() * (max - min)) + min;
  };

  const randomDiscount = (setDiscount: any) => {
    useEffect(() => {
      setDiscount(random());
    }, []);
  };

  const calPriceBefore = (
    discount: any = 0,
    priceAfter: number = 0
  ): number => {
    return Math.ceil(priceAfter / ((100 - discount) * 0.01));
  };

  randomDiscount(setDiscount);

  return (
    <Card
      className={`${Styles.containerCard} shadow-md mt-[10px] border-[1px] border-gray-300`}
      pos='relative'
      radius='4'
      withBorder
    >
      <Card.Section component={Link} href={`/products/${data._id}`}>
        <AspectRatio ratio={200 / 150}>
          <Image
            alt='product'
            w={200}
            width={200}
            height={200}
            src={data.product_thumb}
            component={NImage}
            className=' border-b-[1px] border-gray-300 '
          />
          {quantityNumber == 0 && (
            <Flex
              h={'100%'}
              w={'100%'}
              pos={'absolute'}
              justify={'center'}
              align={'center'}
              className='top-50 left-30 bg-gray-200/80'
            >
              <Badge>Hết hàng</Badge>
            </Flex>
          )}
        </AspectRatio>
      </Card.Section>
      <Flex justify={'space-around'} direction={'column'} h={'100%'} w={'100%'}>
        <div className='h-[60px]'>
          <Text
            className='my-2 text-[0.875rem] text-ellipsis gap-0 tracking-tighter'
            lineClamp={2}
          >
            {data.product_name}
          </Text>
        </div>

        <Group justify='space-between'>
          <Stack gap={3}>
            <Group
              gap={0}
              align='start'
              justify='flex-start'
              className=' items-start'
            >
              <Text className='text-[1rem]'>
                {formatMoney(data.product_price)}
              </Text>
              <Text className=' text-[12px]'>đ</Text>
            </Group>
            <Group
              gap={0}
              align='start'
              justify='flex-start'
              h={17}
              className=' items-start'
            >
              {discount !== 0 ? (
                <>
                  <Text
                    td='line-through'
                    color='rgb(248 113 113)'
                    size='14px'
                    className='text-[14px] text-red-400'
                  >
                    {formatMoney(calPriceBefore(discount, data.product_price))}
                  </Text>
                  <Text
                    td='line-through'
                    color='rgb(248 113 113)'
                    size='10px'
                    className=' text-[10px] text-red-400'
                  >
                    đ
                  </Text>
                </>
              ) : (
                <></>
              )}
            </Group>
          </Stack>

          <ActionIcon
            color='#E9F9F8'
            variant='filled'
            aria-label='Add'
            bg={'transparent'}
            onClick={() => {
              if (quantityNumber == 0) {
                toast.error('Sản phẩm đã hết hàng.');
              } else if (user?.userId) {
                if (cart) {
                  const newCart = structuredClone(cart);
                  if (newCart.cart_products == 0) {
                    newCart.cart_products.push({
                      product_name: data.product_name,
                      product_thumb: data.product_thumb,
                      product_description: null,
                      product_price: data.product_price,
                      product_quantity: 1,
                      product_brand: null,
                      product_unit: null,
                      product_ratingAverage: null,
                      product_categories: null,
                      productId: data._id,
                    });
                  } else {
                    let temp = 0;
                    newCart.cart_products.every(
                      (value: any, index: any, array: any) => {
                        if (value.productId == data._id && temp == 0) {
                          value.product_quantity++;
                          temp = 1;
                          return false;
                        }
                        return true;
                      }
                    );
                    if (temp == 0) {
                      newCart.cart_products.push({
                        product_name: data.product_name,
                        product_thumb: data.product_thumb,
                        product_description: null,
                        product_price: data.product_price,
                        product_quantity: 1,
                        product_brand: null,
                        product_unit: null,
                        product_ratingAverage: null,
                        product_categories: null,
                        productId: data._id,
                      });
                    }
                  }
                  addMutation.mutate(data._id);
                  setCart(newCart);
                  toast.success('Thêm sản phẩm thành công');
                } else {
                  toast.error('Thêm sản phẩm thất bại.');
                }
              } else {
                toast.error(
                  'Bạn cần phải đăng nhập để thực hiện chức năng này.'
                );
              }
            }}
          >
            <IconShoppingCartPlus color='#02B1AB' />
          </ActionIcon>
        </Group>
        <Group justify='space-between' wrap='nowrap'>
          <Rating value={data.product_ratingAverage} readOnly />
          <Group wrap='nowrap'>
            <Divider size='xs' orientation='vertical' />
            <Text c='dimmed'>{productQuantity}</Text>
          </Group>
        </Group>
      </Flex>
      {discount !== 0 && (
        <Badge
          className='absolute top-3 right-1 text-sx font-light'
          color='#F76D6D'
        >
          {`-${discount} %`}
        </Badge>
      )}
    </Card>
  );
};

interface PCardProps {
  data: Product;
}

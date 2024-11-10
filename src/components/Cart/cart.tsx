'use client';

import {
  Grid,
  Text,
  Checkbox,
  ActionIcon,
  Container,
  Group,
  Button,
} from '@mantine/core';
import '@/styles/global.css';
import { IconTrash } from '@tabler/icons-react';
import CartItem from '../CartItem/cartItem';
import useCart from '@/helpers/useCart';
import { CartProduct } from '@/utils/response';
import { useContext, useEffect, useRef, useState } from 'react';
import { formatMoney } from '@/utils/string';
import useRQGlobalState from '@/helpers/useRQGlobalState';
import { useRouter } from 'next/navigation';
import { data } from 'cypress/types/jquery';
import { Toaster, toast } from 'react-hot-toast';
import queryClient from '@/helpers/client';
import { useMutation } from '@tanstack/react-query';
import CartService from '@/services/cartService';
import UserContext from '@/contexts/UserContext';
import { userService } from '@/services/userService';

const Cart = () => {
  const [cart, setCart] = useCart();
  const [totalCost, setTotalCost] = useState(0);
  const [allChecked, setAllChecked] = useState(false);
  const productsChosen = useRef<CartProduct[]>([]);
  const router = useRouter();
  const [products, setProducts] = useRQGlobalState('productsChosen', []);
  const [numberChecked, setNumberChecked] = useState(-1);
  const { user } = useContext(UserContext);

  useEffect(() => {
    if (cart) {
      if (
        numberChecked != -1 &&
        numberChecked == cart.cart_products.length - 1
      ) {
        setAllChecked(true);
        if (totalCost != 0 && !allChecked) setTotalCost(0);
      }
    }
  }, [numberChecked]);

  useEffect(() => {
    queryClient.prefetchQuery({
      queryKey: ['userInfor'],
      queryFn: () => {
        return userService.getUserById(user);
      },
    });
  }, []);

  const addCost = (cost: number) => {
    if (cost == -1) setTotalCost(0);
    else setTotalCost((prev) => prev + cost);
  };

  const deleteMutation = useMutation({
    mutationKey: ['deleteProductCart'],
    mutationFn: (productId: string) => {
      const cartService = new CartService(user);
      return cartService.deleteProduct(productId);
    },
    onSuccess: (res) => {
      console.log('delete success: ', res);
    },
    onError: (err) => {
      console.log('delete fail: ', err);
    },
    onSettled: () => {},
  });

  const updateQuantityMutation = useMutation({
    mutationKey: ['updateQuantityCart'],
    mutationFn: ({
      productId,
      quantity,
      oldQuantity,
    }: {
      productId: string;
      quantity: string | number;
      oldQuantity: string | number;
    }) => {
      const cartService = new CartService(user);
      return cartService.updateQuantityProduct(
        productId,
        quantity,
        oldQuantity
      );
    },
    onSuccess: (res) => {
      // console.log('update success: ', res);
    },
    onError: (err) => {
      // console.log('update fail: ', err);
    },
    onSettled: () => {},
  });

  const deleteOne = (id: string) => {
    const data = structuredClone(cart);

    for (let i = 0; i < data.cart_products.length; i++) {
      if (data.cart_products[i].productId == id) {
        data.cart_products.splice(i, 1);
        break;
      }
    }
    deleteMutation.mutate(id);
    setCart(data);
    toast.success('Xóa sản phẩm thành công.');
  };

  const deleteAll = () => {
    const data = structuredClone(cart);

    if (data.cart_products.length !== 0) {
      for (let i = 0; i < data.cart_products.length; i++) {
        deleteMutation.mutate(data.cart_products[i].productId);
      }

      setCart();
      setTotalCost(0);
      toast.success('Xóa sản phẩm thành công.');
    } else {
      toast.error('Bạn không có sản phẩm để xóa.');
    }
  };

  const updateQuantity = (
    productId: string,
    quantity: string | number,
    oldQuantity: string | number
  ) => {
    const data = structuredClone(cart);

    for (let i = 0; i < data.cart_products.length; i++) {
      if (data.cart_products[i].productId == productId) {
        data.cart_products[i].product_quantity = quantity;
        break;
      }
    }
    setCart(data);
    updateQuantityMutation.mutate({ productId, quantity, oldQuantity });
  };

  return (
    <div>
      <Grid>
        <Grid.Col span={9}>
          <Grid columns={10} my={20} py={5} className='bg-white rounded-lg'>
            <Grid.Col span={1} className='flex items-center justify-center'>
              <Checkbox
                checked={allChecked}
                onChange={(event) => {
                  if (cart && cart.cart_products) {
                    if (event.currentTarget.checked) {
                      while (productsChosen.current.length)
                        productsChosen.current.pop();
                      productsChosen.current.push(...cart.cart_products);
                      setNumberChecked(cart.cart_products.length - 1);
                    } else {
                      while (productsChosen.current.length)
                        productsChosen.current.pop();
                      setNumberChecked(-1);
                    }
                  }
                  setTotalCost(0);
                  setAllChecked(event.currentTarget.checked);
                }}
              />
            </Grid.Col>
            <Grid.Col span={4} className='flex items-center'>
              <Text className='text-[0.8rem]'>Sản phẩm</Text>
            </Grid.Col>
            <Grid.Col span={1} className='flex items-center'>
              <Text className='text-[0.8rem]'>Đơn giá</Text>
            </Grid.Col>
            <Grid.Col span={2} className='flex items-center'>
              <Text className='text-[0.8rem]'>Số lượng</Text>
            </Grid.Col>
            <Grid.Col span={1} className='flex items-center'>
              <Text className='text-[0.8rem]'>Thành tiền</Text>
            </Grid.Col>
            <Grid.Col span={1} className='flex items-center'>
              <ActionIcon
                variant='filled'
                aria-label='Delete'
                onClick={deleteAll}
              >
                <IconTrash
                  color='#000'
                  stroke={1.5}
                  style={{ color: '#000' }}
                />
              </ActionIcon>
            </Grid.Col>
          </Grid>
          <div className='bg-white rounded-[10px] py-[10px]'>
            {cart &&
              cart.cart_products.map((item: CartProduct) => (
                <CartItem
                  key={item.productId}
                  data={item}
                  setTotalCost={addCost}
                  allChecked={allChecked}
                  setAllChecked={setAllChecked}
                  deleteItem={deleteOne}
                  productChosen={productsChosen}
                  setNumberChecked={setNumberChecked}
                  updateQuantity={updateQuantity}
                />
              ))}
          </div>
        </Grid.Col>
        <Grid.Col span={3}>
          <Container className='bg-white rounded' mt={20} py={20}>
            <Group pb={20} justify='space-between' align='flex-start'>
              <Text>Tạm tính</Text>
              <div className='text-[#02B1AB] text-right'>
                <p>
                  {formatMoney(totalCost)}
                  <span>đ</span>
                </p>
                <Text size='xs' c='dimmed'>
                  (Chưa bao gồm phí vận chuyển)
                </Text>
              </div>
            </Group>
            <Button
              fullWidth
              className='bg-[#02B1AB]'
              onClick={() => {
                if (productsChosen.current.length != 0) {
                  const temp: any = productsChosen.current;
                  setProducts(temp);
                  router.push('/payment');
                } else {
                  toast.error('Vui lòng chọn sản phẩm để thanh toán.');
                }
              }}
            >
              Mua hàng
            </Button>
          </Container>
        </Grid.Col>
      </Grid>
      <Toaster position='bottom-center' reverseOrder={false} />
    </div>
  );
};

export default Cart;

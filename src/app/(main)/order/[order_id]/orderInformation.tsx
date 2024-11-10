import StatusBadge from '@/components/StatusBadge/statusBadge';
import { Order } from '@/utils/response';
import { Button, Divider, Grid, Group, Stack, Text } from '@mantine/core';
import { IconCash, IconMapPinFilled } from '@tabler/icons-react';
import Product from './product';
import { formatMoney } from '@/utils/string';
import { useRouter } from 'next/navigation';

enum paymentStatusOrder {
  'pending' = 0,
  'paid' = 1,
}
const paymentStatusMapping = {
  pending: 'Chưa thanh toán',
  paid: 'Đã thanh toán',
};
const paymentMethodMapping = {
  'upon receipt': 'Thanh toán khi nhận hàng',
};
export default function OrderInformation({
  data,
}: {
  data: Order | undefined;
}) {
  const router = useRouter();

  return (
    <Stack gap='1rem' px='1rem' pt='1rem'>
      <Group grow>
        <Stack
          className='rounded-[0.5rem] border-[0.5px] px-[32px] py-[24px] self-stretch'
          gap='1rem'
        >
          <Group c='turquoise'>
            <IconMapPinFilled />
            <Text fw={700}>Thông tin giao hàng</Text>
          </Group>
          <p>{data?.order_address.city}</p>
        </Stack>
        <Stack
          className='rounded-[0.5rem] border-[0.5px] px-[32px] py-[24px] self-stretch'
          gap='1rem'
        >
          <Group c='turquoise'>
            <IconCash />
            <Text fw={700}>Thông tin thanh toán</Text>
          </Group>
          <Group justify='space-between'>
            <Text>Phương thức</Text>
            {data?.order_payment.method === undefined ? (
              'Thanh toán khi nhận hàng'
            ) : (
              <Text>
                {
                  paymentMethodMapping[
                    data?.order_payment
                      .method as keyof typeof paymentMethodMapping
                  ]
                }
              </Text>
            )}
          </Group>
          <Group justify='space-between'>
            <Text>Trạng thái</Text>
            <StatusBadge
              label={
                paymentStatusMapping[
                  data?.order_payment
                    .status as keyof typeof paymentStatusMapping
                ]
              }
              level={
                paymentStatusOrder[
                  data?.order_payment.status as keyof typeof paymentStatusOrder
                ]
              }
            />
          </Group>
        </Stack>
      </Group>
      <Grid align='flex-start'>
        <Grid.Col span={8}>
          <Stack
            className='rounded-[0.5rem] border-[0.5px] px-[32px] py-[24px]'
            gap='1rem'
          >
            <Text fw={700}>Sản phẩm</Text>
            <Stack>
              {data?.order_products.map((product: any) => {
                return (
                  <Product
                    key={product.item_products[0].productId}
                    productId={product.item_products[0].productId}
                    quantity={product.item_products[0].product_quantity}
                    priceRaw={product.priceRaw}
                  />
                );
              })}
            </Stack>
            {(data?.order_status == 'shipping' ||
              data?.order_status == 'shipped') && (
              <Button
                className='mt-3 bg-0-primary-color-6 text-white'
                onClick={() =>
                  router.push(
                    `/manager/warehouse/outbound/${data.order_exportId}`
                  )
                }
              >
                Thông tin phiếu xuất kho
              </Button>
            )}
          </Stack>
        </Grid.Col>
        <Grid.Col span={4} className='flex flex-col gap-[12px]'>
          <Stack
            className='rounded-[0.5rem] border-[0.5px] px-[32px] py-[24px]'
            gap='1rem'
          >
            <Group justify='space-between'>
              <Text fw={700}>Đơn hàng</Text>
              <Text>{data?.order_products.length} sản phẩm</Text>
            </Group>
            <Divider />
            <div className='flex flex-col gap-[12px]'>
              <Group justify='space-between'>
                <Text>Tạm tính</Text>
                <Text>{formatMoney(data?.order_checkout.totalPrice)} đ</Text>
              </Group>
              <Group justify='space-between'>
                <Text>Phí vận chuyển</Text>
                <Text>{formatMoney(data?.order_checkout.feeShip)} đ</Text>
              </Group>
              <Group justify='space-between'>
                <Text>Khuyến mãi</Text>
                <Text>{formatMoney(data?.order_checkout.totalDiscount)} đ</Text>
              </Group>
            </div>
            <Divider />
            <Group justify='space-between'>
              <Text>Tổng tiền</Text>
              <Text size='lg' fw='700' c='turquoise'>
                {formatMoney(data?.order_checkout.finalPrice)} đ
              </Text>
            </Group>
          </Stack>
          <Stack
            className='rounded-[0.5rem] border-[0.5px] px-[32px] py-[24px] grow-[1]'
            gap='1rem'
          >
            <Text>Ghi chú</Text>
            <div className='px-[16px] py-[8px] rounded-[8px] border-[1px] bg-gray-100'>
              {data?.order_note}
            </div>
          </Stack>
        </Grid.Col>
      </Grid>
    </Stack>
  );
}

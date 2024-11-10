'use client'
import { ActionIcon, ScrollArea } from '@mantine/core'
import { IconArrowLeft } from '@tabler/icons-react';
import { useContext } from 'react';
import UserContext from '@/contexts/UserContext';
import { useMutation, useQuery } from '@tanstack/react-query'
import OrderService from '@/services/orderService'
import Loading from './loading';
import { useRouter } from 'next/navigation';
import { Toaster } from 'react-hot-toast';
import OrderStepper from './stepper';
import queryClient from '@/helpers/client';
import { Bill_Export_Request } from '@/utils/request';



export default function OrderDetailsForStaffPage({ params }: { params: { order_id: string } }) {

    const router = useRouter()
    const { user } = useContext(UserContext);

    const target_order = useQuery({
        queryKey: ['target_order', params.order_id],
        queryFn: () => {
            const orderService = new OrderService(user);
            return orderService.getOrderById(params.order_id);
        },
        enabled: !!user,
        refetchOnMount: 'always'
    })


    const updateOrderStatusMutation = useMutation({
        mutationKey: ['update_order_status'],
        mutationFn: ({ orderId, status }: { orderId: string | undefined, status: string }) => {
            const orderService = new OrderService(user);
            return orderService.modifyOrderStatus(orderId, status)
        },
        onSuccess: () => {
            return queryClient.invalidateQueries({
                queryKey: ['target_order', params.order_id],
            });
        }
    })

    const updateOrderPaymentStatusMutation = useMutation({
        mutationKey: ['update_order_payment_status'],
        mutationFn: ({ orderId }: { orderId: string | undefined }) => {
            const orderService = new OrderService(user);
            return orderService.updateOrderPaymentStatus(orderId)
        },
        onSuccess: () => {
            return queryClient.invalidateQueries({
                queryKey: ['target_order', params.order_id],
            });
        }
    })

    const updateOrderStatusToShippingMutation = useMutation({
        mutationFn: ({ orderId, body }: { orderId: string | undefined, body: Bill_Export_Request }) => {
            const orderService = new OrderService(user);
            return orderService.updateOrderStatusToShipping(orderId, body)
        },
        onSuccess: () => {
            return queryClient.invalidateQueries({
                queryKey: ['target_order', params.order_id],
            });
        }
    })

    return (
        <ScrollArea className='h-full w-full z-[0]' >
            {target_order.isPending || updateOrderStatusMutation.isPending || updateOrderStatusToShippingMutation.isPending
                || updateOrderPaymentStatusMutation.isPending ?
                (<Loading />) :
                (

                    <div className='flex flex-col gap-[24px] py-[16px] px-[16px]'>
                        <ActionIcon variant="light" size='lg' aria-label="Back to Order page"
                            onClick={() => router.back()}><IconArrowLeft /></ActionIcon>
                        <OrderStepper data={target_order.data} mutate={updateOrderStatusMutation.mutate}
                            updateToShippingMutate={updateOrderStatusToShippingMutation.mutate}
                            updatePaymentStatusMutate={updateOrderPaymentStatusMutation.mutate}
                        />
                    </div>

                )
            }
            < Toaster position='bottom-center' reverseOrder={false} />
        </ScrollArea >
    )


}



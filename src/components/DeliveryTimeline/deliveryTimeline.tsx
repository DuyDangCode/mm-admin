import { Timeline, Text, Group, Button, Stack, Divider } from "@mantine/core";
import { IconArrowNarrowRight, IconCash, IconChecklist, IconChecks, IconCircleCheck, IconTruckDelivery, IconTruckReturn } from "@tabler/icons-react";

type Props = {
    staffName?: string,
    customerName?: string,
    create_time?: string,
    confirm_time?: string,
    delivery_time?: string,
    isPay: boolean,
    onSuccess: any,
    onFailed: any,
    onPayment: any
}
export default function DeliveryTimeline(
    {
        staffName = 'Khai',
        customerName = 'khai',
        create_time = '12:00',
        confirm_time = '1:00',
        delivery_time = '2:00',
        isPay,
        onSuccess,
        onFailed,
        onPayment
    }: Props
) {
    return (
        <Group justify="center" align='flex-end' gap='64px'>
            <Timeline active={2} bulletSize={24} lineWidth={2} mb='1.6rem'>
                <Timeline.Item bullet={<IconChecklist size={16} />} title="Tạo đơn">
                    {/* <Text c="gray.6" size='sm'>Tạo vào lúc {create_time}. <Text size='sm' component="span">Khách hàng: {customerName}</Text></Text> */}
                </Timeline.Item >
                <Timeline.Item bullet={<IconCircleCheck size={16} />} title="Xác nhận">
                    {/* <Text c="gray.6" size='sm'>Xác nhận vào lúc {confirm_time}. <Text size='sm' component="span">Nhân viên: {staffName}</Text></Text> */}
                </Timeline.Item>
                <Timeline.Item bullet={<IconTruckDelivery size={16} />} title="Đang giao">
                    {/* <Text c="gray.6" size='sm'>Xuất kho vào lúc {delivery_time}.</Text> */}
                </Timeline.Item>
                <Timeline.Item bullet={<IconChecks size={16} />} title="">
                </Timeline.Item>
            </Timeline>
            <Stack >
                <Button variant='light' size='lg' color='green' disabled={isPay}
                    // leftSection={<IconArrowNarrowRight />}
                    rightSection={<IconCash />}
                    onClick={onPayment}
                >Xác nhận thanh toán thành công</Button>
                <Divider />
                <Button variant='light' size='lg' disabled={!isPay}
                    leftSection={<IconArrowNarrowRight />}
                    rightSection={<IconTruckDelivery />}
                    onClick={onSuccess}
                > Giao thành công</Button>
                <Button variant='light' size='lg' color='red'
                    leftSection={<IconArrowNarrowRight />}
                    rightSection={<IconTruckReturn />}
                    onClick={onFailed}
                > Giao thất bại</Button>
            </Stack>

        </Group>
    )
}

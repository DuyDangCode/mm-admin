
import { Product } from "@/utils/response";
import { Button, Divider, Group, Input, NumberInput, Stack, Text, TextInput, Title, Tooltip, rem } from "@mantine/core";
import { formatMoney, formatProductId } from "@/utils/string";
import dayjs from "dayjs";
import { Bill_Product } from "@/utils/object";
import { useState } from "react";
import { number } from "zod";
import { IconCurrencyDong, IconCurrencyDram, IconX } from "@tabler/icons-react";

const mockData: Bill_Product = {
    _id: "655f10ef4bf37f313fb9552e",
    product_name: "1/2\ x 4' x 8' Drywall Panel",
    product_price: 400000,
    quantity: 1,
    product_unit: "Panel",
    product_category: "Drywall",
    totalPrice: 100000
}

function ProductInfo({
    label,
    content
}: {
    label: string, content: any
}) {
    return (
        <Stack gap='0' w='150'>
            <Text fw={700} size='sm' c='dimmed'>{label}</Text>
            <Text >{content}</Text>
        </Stack>
    )
}
export default function BillProduct({
    data = mockData,
    order,
    max = 10,
    refBills,
    refSetBills,
    deleteFn,
    calBillFn,
    type = 'export'
}: {
    data?: Bill_Product,
    order: number,
    max?: number,
    refBills: Bill_Product[],
    refSetBills: any,
    deleteFn: any,
    calBillFn: any,
    type?: string
}) {
    const [quantity, setQuantity] = useState<number | string>(1)

    console.log(data)

    return (
        <Stack key={data._id} w='fit-content' className="rounded-[8px] border-[1px]" p='16'>
            <Group justify="space-between">
                <Title order={5} c='orange.8' bg='orange.0' px='8' py='4'>Mặt hàng {order + 1}</Title>
                <Group>
                    <Text fw={700} size='sm' c='dimmed'>Mã mặt hàng</Text>
                    <Text c='turquoise'>{formatProductId(data._id, data.product_price.toString())}</Text>
                </Group>
                <Tooltip label="Xóa sản phẩm" color='red'>
                    <Button size='sm' variant="light" c='red' bg='red.0'
                        onClick={() => deleteFn(data._id)}><IconX></IconX></Button>
                </Tooltip>
            </Group>
            <Divider />
            <Group align="flex-center">
                <ProductInfo label='Loại vật liệu' content={data.product_category} />
                <ProductInfo label='Tên vật liệu' content={data.product_name} />
                <Stack gap='0' w='150'>
                    <Text fw={700} size='sm' c='dimmed'>Số lượng</Text>
                    <NumberInput
                        aria-label="My input"
                        value={quantity}
                        onChange={(value) => {
                            setQuantity(value)
                            const tmp = refBills
                            tmp[order].quantity = value as number
                            tmp[order].totalPrice = tmp[order].quantity * tmp[order].product_price
                            refSetBills(tmp)
                            calBillFn()
                        }}
                        allowNegative={false}
                        clampBehavior="strict"
                        min={1}
                        max={max > -1 ? max : Infinity} />
                    {max === -1 ? <></> :
                        <Text fs='italic' c='gray.6' size='sm'>Tồn kho: {max}</Text>}
                </Stack>
            </Group>
            <Group align="flex-center">
                <ProductInfo label='Đơn vị tính' content={data.product_unit} />
                {type === 'export' ?
                    <ProductInfo label='Đơn giá' content={`${formatMoney(data.product_price)} đ`} /> :
                    <Input.Wrapper>
                        <Text fw={700} size='sm' c='dimmed'>Đơn giá</Text>
                        <NumberInput
                            rightSection={<IconCurrencyDong style={{ width: rem(20), height: rem(20) }} stroke={1.5} />}
                            value={refBills[order].product_price}
                            onChange={(value) => {
                                const tmp = refBills
                                tmp[order].product_price = value as number
                                tmp[order].totalPrice = tmp[order].quantity * tmp[order].product_price
                                refSetBills(tmp)
                                calBillFn()
                            }}
                        />
                    </Input.Wrapper>
                }
                <ProductInfo label='Thành tiền' content={`${formatMoney(data.totalPrice)} đ`} />
            </Group>
        </Stack>
    )
}

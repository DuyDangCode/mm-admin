import { LoadingOverlay, Container, Flex, Skeleton } from '@mantine/core';
export default function Loading() {
    // You can add any UI inside Loading, including a Skeleton.
    return (
        <div className='p-[24px] mt-[40px] h-full w-full'>
            <Flex justify='space-between' align='center'>
                <Skeleton circle height={50} />
                <Flex direction='column' gap='10px' w='10%'>
                    <Skeleton height={25} radius="md" />
                    <Skeleton height={15} radius="md" />
                </Flex>
                <Skeleton height={2} width='10%' />
                <Skeleton circle height={50} />
                <Flex direction='column' gap='10px' w='10%'>
                    <Skeleton height={25} radius="md" />
                    <Skeleton height={15} radius="md" />
                </Flex>
                <Skeleton height={2} width='10%' />
                <Skeleton circle height={50} />
                <Flex direction='column' gap='10px' w='10%'>
                    <Skeleton height={25} radius="md" />
                    <Skeleton height={15} radius="md" />
                </Flex>
                <Skeleton height={2} width='10%' />
                <Skeleton circle height={50} />
                <Flex direction='column' gap='10px' w='10%'>
                    <Skeleton height={25} radius="md" />
                    <Skeleton height={15} radius="md" />
                </Flex>
            </Flex>
            <Flex gap='lg' mt='lg'>
                <Skeleton height={150} width='60%' radius="md" />
                <Skeleton height={150} width='30%' radius="md" />
            </Flex>
        </div>
    );
}

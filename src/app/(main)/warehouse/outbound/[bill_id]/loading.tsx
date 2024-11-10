import { LoadingOverlay, Container, Flex, Skeleton } from '@mantine/core';
export default function Loading() {
    // You can add any UI inside Loading, including a Skeleton.
    return (
        <div className='p-[24px] mt-[40px] h-full w-full'>
            <Flex gap='lg' mt='lg'>
                <Skeleton height={30} radius="md" />
                <Skeleton height={30} radius="md" />
                <Skeleton height={30} radius="md" />
            </Flex>
            <Flex gap='lg' mt='lg'>
                <Skeleton height={30} radius="md" />
                <Skeleton height={30} radius="md" />
                <Skeleton height={30} radius="md" />
            </Flex>
            <Skeleton mt='lg' height={300} radius="md" />
        </div>
    );
}

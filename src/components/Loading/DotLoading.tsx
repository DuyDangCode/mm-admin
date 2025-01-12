import { LoadingOverlay, Container, Loader } from '@mantine/core'
export default function DotLoading() {
  // You can add any UI inside Loading, including a Skeleton.
  // return (
  //   <div className='w-full h-full flex justify-center items-center'>
  //     <Loader type='dots' />
  //   </div>
  // )
  // You can add any UI inside Loading, including a Skeleton.
  return (
    <div className='flex justify-center items-center space-x-2'>
      <span className='w-2 h-2 bg-[#02B1AB] rounded-full animate-bounce'></span>
      <span className='w-2 h-2 bg-[#02B1AB] rounded-full animate-bounce delay-[200ms]'></span>
      <span className='w-2 h-2 bg-[#02B1AB] rounded-full animate-bounce delay-[400ms]'></span>
    </div>
  )
}

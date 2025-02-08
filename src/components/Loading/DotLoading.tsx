export default function DotLoading() {
  return (
    <div className='flex justify-center items-center space-x-2 w-full h-full'>
      <span className='w-2 h-2 bg-[#02B1AB] rounded-full animate-bounce'></span>
      <span className='w-2 h-2 bg-[#02B1AB] rounded-full animate-bounce delay-[200ms]'></span>
      <span className='w-2 h-2 bg-[#02B1AB] rounded-full animate-bounce delay-[400ms]'></span>
    </div>
  )
}

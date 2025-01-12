import { LoadingOverlay, Container } from '@mantine/core'
export default function Loading() {
  // You can add any UI inside Loading, including a Skeleton.
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
      }}
    >
      <p>Loading...</p>
    </div>
  )
}

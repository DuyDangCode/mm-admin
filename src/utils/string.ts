const formatMoney = (
  money: string | number = 0,
  options: {
    currency?: 'VND' | 'USD'
    notation?: Intl.NumberFormatOptions['notation']
  } = {},
) => {
  const { currency = 'VND', notation = 'standard' } = options
  const numericPrice = typeof money == 'string' ? parseFloat(money) : money
  if (isNaN(numericPrice)) {
    return 0
  }
  return new Intl.NumberFormat('vi-VN', {
    // style: 'currency',
    currency,
    notation,
    maximumFractionDigits: 3,
  }).format(numericPrice)
}

const formatOrderId = (id: string, createdAt: string) => {
  const parts = [...createdAt.split('/')]
  return (
    'MM' +
    `${parts[0]}${parts[1]}${parts[2].slice(2)}`.split('').reverse().join('') +
    id.slice(-3)
  )
}

const formatIdWithoutCreateAt = (prefix: string, id: string) => {
  return prefix + '-' + id.slice(0, 8) + '-' + id.slice(8, 16)
}
const formatOrderIdWithoutCreateAt = (id: string) => {
  return formatIdWithoutCreateAt('MM', id)
}
const formatVoucherIdWithoutCreateAt = (id: string) => {
  return formatIdWithoutCreateAt('VC', id)
}
const formatDeliveryIdWithoutCreateAt = (id: string) => {
  return formatIdWithoutCreateAt('D', id)
}
const formatCatergoryIdWithoutCreateAt = (id: string) => {
  return formatIdWithoutCreateAt('C', id)
}
const formatStaffIdWithoutCreateAt = (id: string) => {
  return formatIdWithoutCreateAt('S', id)
}
const formatExportBillIdWithoutCreateAt = (id: string) => {
  return formatIdWithoutCreateAt('EB', id)
}
const formatImportBillIdWithoutCreateAt = (id: string) => {
  return formatIdWithoutCreateAt('IB', id)
}
const formatExportBillId = (id: string, createdAt: string) => {
  const parts = [...createdAt.split('/')]
  return (
    'EB' +
    `${parts[0]}${parts[1]}${parts[2].slice(2)}`.split('').reverse().join('') +
    id.slice(-3)
  )
}

const formatImportBillId = (id: string, createdAt: string) => {
  const parts = [...createdAt.split('/')]
  return (
    'IB' +
    `${parts[0]}${parts[1]}${parts[2].slice(2)}`.split('').reverse().join('') +
    id.slice(-3)
  )
}

const formatProductId = (id: string, price: string) => {
  return 'PD' + id.slice(0, 3) + price.slice(0, 3) + id.slice(-3)
}

const formatDate = (date: string) => {
  return (
    date.split('T')[0].split('-')[2] +
    '/' +
    date.split('T')[0].split('-')[1] +
    '/' +
    date.split('T')[0].split('-')[0]
  )
}

export {
  formatMoney,
  formatOrderId,
  formatProductId,
  formatExportBillId,
  formatImportBillId,
  formatDate,
  formatOrderIdWithoutCreateAt,
  formatVoucherIdWithoutCreateAt,
  formatStaffIdWithoutCreateAt,
  formatCatergoryIdWithoutCreateAt,
  formatDeliveryIdWithoutCreateAt,
  formatImportBillIdWithoutCreateAt,
  formatExportBillIdWithoutCreateAt,
}

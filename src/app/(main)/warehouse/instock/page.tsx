'use client'
import BackButton from '@/components/BackButton/backButton'
import UserContext from '@/contexts/UserContext'
import { categoryService } from '@/services/categoryService'
import { productService } from '@/services/productService'
import { Product } from '@/utils/response'
import {
  ActionIcon,
  AspectRatio,
  Card,
  Flex,
  Group,
  ScrollArea,
  TextInput,
  Image,
  Stack,
  Text,
  Button,
  Badge,
  Table,
  Divider,
  Loader,
  Skeleton,
  Tabs
} from '@mantine/core'
import {
  IconCategory,
  IconLayoutList,
  IconSearch,
  IconX
} from '@tabler/icons-react'
import { useMutation, useQuery } from '@tanstack/react-query'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import React, { useCallback, useContext, useState } from 'react'
import Loading from './loading'

function ProductSkeleton() {
  const skeletons = Array(4).fill(
    <Stack>
      <Skeleton h='150' w='200' radius='8px' animate />
      <Skeleton h='10' w='200' radius='8px' animate />
      <Skeleton h='10' w='100' radius='8px' animate />
    </Stack>
  )
  return (
    <Flex wrap='wrap' gap='16'>
      {skeletons}
    </Flex>
  )
}
function ProductCard({
  data,
  onChoose
}: {
  data: Product | undefined
  onChoose?: any
}) {
  return (
    <Card shadow='sm' padding={0} radius='md' withBorder>
      <Card.Section display='flex' className='justify-center'>
        <AspectRatio
          ratio={200 / 150}
          maw={200}
          className='w-[200px] border-b-[1px] border-gray-300 '
        >
          <Image alt='product' src={data?.product_thumb} />
          {data?.product_quantity == 0 && (
            <div className='flex w-full h-full absolute top-50 left-30 items-start justify-center bg-gray-200/80'>
              <Badge>Hết hàng</Badge>
            </div>
          )}
        </AspectRatio>
      </Card.Section>
      <Stack p='4px' justify='space-between' h='100%'>
        <Stack justify='space-between' className='basis-2/3'>
          <Text lineClamp={2} w='200' size='sm'>
            {data?.product_name}
          </Text>
          <Text size='sm' c='gray.6'>
            SL: {data?.product_quantity}
          </Text>
        </Stack>
        <Button
          variant='light'
          onClick={onChoose}
          bg={'transparent'}
          className=' text-[#02B1AB] bg-transparent'
        >
          Xem
        </Button>
      </Stack>
    </Card>
  )
}
export default function InstockPage({
  searchParams
}: {
  searchParams: { [key: string]: string | string[] | undefined } | any
}) {
  //params controll
  const { tab } = React.use<any>(searchParams)
  const [activedTab, setActivedTab] = useState(tab)
  // category display type controll
  const [displayType, setDisplayType] = useState(['filled', 'default'])

  // publish tab d=sreach controll
  const [keyword, setKeyword] = useState('')
  const [pubSearching, setPubSearching] = useState('sleeping')

  // publish product data controll
  const [productData, setProductData] = useState<Product[]>()
  const [categoryId, setCategoryId] = useState<string>('')

  // draft page controll
  const [draftActivedPage, setDraftActivedPage] = useState(1)

  const router = useRouter()
  const currentPath = usePathname()
  const searchParamsHook = useSearchParams()

  // Get a new searchParams string by merging the current
  // searchParams with a provided key/value pair
  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParamsHook)
      params.set(name, value)

      return params.toString()
    },
    [searchParamsHook]
  )
  const { user } = useContext(UserContext)
  const categories = useQuery({
    queryKey: ['categories'],
    queryFn: categoryService.getAllCategories,
    staleTime: Infinity,
    gcTime: Infinity
  })

  const searchMutation = useMutation({
    mutationKey: ['search', keyword],
    mutationFn: () => {
      return productService.search(keyword)
    },
    onSuccess: (data) => {
      if (data.length != 0) {
        setPubSearching('success')
        setProductData(data)
      } else setPubSearching('failed')
    }
  })
  const productByCategory = useQuery({
    queryKey: ['products_by_category', categoryId],
    queryFn: () => {
      return productService.getAllProductsByCategory(categoryId)
    },
    enabled: !!user
  })
  const draftProducts = useQuery({
    queryKey: ['draft_products', draftActivedPage],
    queryFn: () => {
      return productService.getAllDraftProducts(user, 20, draftActivedPage)
    },
    enabled: !!user
  })

  const search = async () => {
    setPubSearching('pending')
    searchMutation.mutate()
  }
  const handleChooseCategory = (id: string) => {
    setCategoryId(id)
  }

  const productsBySearchElement = (
    <Flex wrap='wrap' gap='16'>
      {productData?.map((product) => (
        <ProductCard
          data={product}
          onChoose={() => {
            router.push(`${currentPath}/${product._id}?state=${activedTab}`)
          }}
        />
      ))}
    </Flex>
  )

  return (
    <ScrollArea className='h-full w-full z-[0]' py='1rem' px='2rem'>
      <Tabs
        defaultValue='publish'
        value={activedTab as string | null | undefined}
        onChange={(value) => {
          setActivedTab(value as string)
          router.push(
            currentPath + '?' + createQueryString('tab', value as string)
          )
        }}
        activateTabWithKeyboard={false}
      >
        <Tabs.List>
          <Tabs.Tab key='publish' value='publish'>
            Đã trưng bày
          </Tabs.Tab>
          <Tabs.Tab key='unpublish' value='unpublish'>
            Chưa trưng bày
          </Tabs.Tab>
        </Tabs.List>
        <Tabs.Panel key='publish' value='publish'>
          <Group justify='space-between' my='lg'>
            <TextInput
              className='basis-3/4'
              placeholder='Tìm kiếm danh mục hoặc sản phẩm.'
              value={keyword}
              onChange={(event) => {
                setKeyword(event.currentTarget.value)
                setPubSearching('sleeping')
              }}
              onKeyDown={(event) => {
                if (event.key === 'Enter') {
                  search()
                }
              }}
              leftSectionPointerEvents='painted'
              leftSection={
                <ActionIcon variant='white' color='gray'>
                  <IconSearch
                    onClick={() => {
                      search()
                    }}
                    style={{ height: '1.5rem', width: '1.5rem' }}
                  />
                </ActionIcon>
              }
              rightSectionPointerEvents='painted'
              rightSection={
                keyword !== '' ? (
                  <ActionIcon variant='white' color='gray'>
                    <IconX
                      onClick={() => {
                        setKeyword('')
                      }}
                      style={{ height: '1.5rem', width: '1.5rem' }}
                    />
                  </ActionIcon>
                ) : (
                  <></>
                )
              }
            ></TextInput>
            <ActionIcon.Group>
              <ActionIcon
                variant={displayType[0]}
                size='lg'
                onClick={() => setDisplayType(['filled', 'default'])}
              >
                <IconCategory style={{ width: '32px' }} stroke={1.5} />
              </ActionIcon>
              <ActionIcon
                variant={displayType[1]}
                size='lg'
                onClick={() => setDisplayType(['default', 'filled'])}
              >
                <IconLayoutList style={{ width: '32px' }} stroke={1.5} />
              </ActionIcon>
            </ActionIcon.Group>
          </Group>
          {categoryId === '' ? (
            <ScrollArea h='550'>
              {categories.isPending ? (
                <div className='w-full h-[200px] flex justify-center items-center'>
                  <Loader type='dots' />
                </div>
              ) : displayType[0] === 'filled' ? (
                <Flex wrap='wrap' gap='1rem'>
                  {categories.data
                    ?.filter((i) => {
                      if (keyword === '') return true
                      else
                        return i.category_name
                          .toLowerCase()
                          .includes(keyword.toLowerCase())
                    })
                    .map((category) => (
                      <Button
                        variant='default'
                        bg={'white'}
                        className=' text-black'
                        onClick={() => handleChooseCategory(category._id)}
                      >
                        {category.category_name}
                      </Button>
                    ))}
                </Flex>
              ) : (
                <Table
                  highlightOnHover
                  highlightOnHoverColor='turquoise.0'
                  verticalSpacing='sm'
                >
                  <Table.Tbody>
                    {categories.data
                      ?.filter((i) => {
                        if (keyword === '') return true
                        else
                          return i.category_name
                            .toLowerCase()
                            .includes(keyword.toLowerCase())
                      })
                      .map((category) => (
                        <Table.Tr key={category._id}>
                          <Table.Td
                            onClick={() => handleChooseCategory(category._id)}
                            className=' cursor-pointer'
                          >
                            {category.category_name}
                          </Table.Td>
                        </Table.Tr>
                      ))}
                  </Table.Tbody>
                </Table>
              )}
              <Divider my='32px' />
              {(() => {
                switch (pubSearching) {
                  case 'sleeping':
                    return <></>
                  case 'pending':
                    return <ProductSkeleton />
                  case 'success':
                    return productsBySearchElement
                  case 'failed':
                    return <p className='mt-[24px]'>Không tìm thấy</p>
                  default:
                    return <></>
                }
              })()}
            </ScrollArea>
          ) : (
            <ScrollArea h='550'>
              {productByCategory.isPending ? (
                <div className='w-full h-[200px] flex justify-center items-center'>
                  <Loader type='dots' />
                </div>
              ) : (
                <>
                  <BackButton fn={() => setCategoryId('')} />
                  {productByCategory.data?.length !== 0 ? (
                    <Flex wrap='wrap' gap='16' mt='16'>
                      {productByCategory.data?.map((product) => {
                        const productWithCategory: Product = {
                          ...product,
                          product_categories: [categoryId]
                        }
                        return (
                          <ProductCard
                            data={productWithCategory}
                            onChoose={() => {
                              router.push(
                                `${currentPath}/${product._id}?state=${activedTab}`
                              )
                            }}
                          />
                        )
                      })}
                    </Flex>
                  ) : (
                    <div className='h-full w-full text-center'>
                      Không có sản phẩm nào
                    </div>
                  )}
                </>
              )}
            </ScrollArea>
          )}
        </Tabs.Panel>
        <Tabs.Panel key='unpublish' value='unpublish'>
          {draftProducts.isPending ? (
            <Loading />
          ) : (
            <ScrollArea h='550' mt='lg'>
              {/* {(() => {
                                switch (pubSearching) {
                                    case 'sleeping':
                                        return <></>
                                    case 'pending':
                                        return <ProductSkeleton />
                                    case 'success':
                                        return productsBySearchElement
                                    case 'failed':
                                        return <p className="mt-[24px]">Không tìm thấy</p>
                                    default:
                                        return <></>
                                }
                            })()} */}
              <Flex wrap='wrap' gap='16' key={Math.random()}>
                {draftProducts.data?.map((product) => (
                  <ProductCard
                    data={product}
                    onChoose={() => {
                      router.push(
                        `${currentPath}/${product._id}?state=${activedTab}`
                      )
                    }}
                  />
                ))}
              </Flex>
            </ScrollArea>
          )}
        </Tabs.Panel>
      </Tabs>
    </ScrollArea>
  )
}

'use client'
import {
  Stack,
  Group,
  Image,
  Button,
  TextInput,
  Text,
  Flex,
  LoadingOverlay,
  Modal,
  Input,
  Textarea,
  Box,
} from '@mantine/core'
import NextImage from 'next/image'
import { useDisclosure } from '@mantine/hooks'

import defaultAvatar from '@/public/pic/Avatar.png'
import queryClient from '@/helpers/client'
import { useRouter } from 'next/navigation'
import { IconMapPinFilled } from '@tabler/icons-react'
import { useContext, useRef, useState } from 'react'
import { useMutation, useQuery } from '@tanstack/react-query'
import toast, { Toaster } from 'react-hot-toast'
import {
  checkAddressFormat,
  checkEmailFormat,
  checkNameFormat,
  checkPhoneFormat,
} from '@/utils/regex'
import { userService } from '@/services/userService'
import UserContext from '@/contexts/UserContext'
import AccountNav from '@/components/Account/nav'

const AccountPage = () => {
  const { user } = useContext(UserContext)

  const userInfor = useQuery({
    queryKey: ['userInfor'],
    queryFn: () => {
      return userService.getUserById(user)
    },
    enabled: !!user,
    staleTime: Infinity,
    refetchOnMount: false,
  })

  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [address, setAddress] = useState('')
  const [avatar, setAvatar] = useState<any>(null)
  const [avatarInput, setAvatarInput] = useState<any>(null)
  const [email, setEmail] = useState('')

  const [enableBox1, setEnableBox1] = useState(false)
  const [enableBox2, setEnableBox2] = useState(false)

  // store initial value
  const isSet = useRef(false)
  let initialName = useRef('')
  let initialEmail = useRef('')
  let initialPhone = useRef('')
  let initialAddress = useRef('')
  let initialImage = useRef(null)

  if (!isSet.current && userInfor.isSuccess) {
    initialName.current = userInfor.data.display_name
    initialEmail.current = userInfor.data.email
    initialPhone.current = userInfor.data.phone
    initialAddress.current = userInfor.data.user_attributes.address
    initialImage.current = userInfor.data.user_attributes.avatar
      ? userInfor.data.user_attributes.avatar
      : 'https://res.cloudinary.com/dqcsednbr/image/upload/v1732502600/360_F_349497933_Ly4im8BDmHLaLzgyKg2f2yZOvJjBtlw5_pyvagm.jpg'
    setName(initialName.current)
    setPhone(initialPhone.current)
    setAddress(initialAddress.current)
    setAvatar(initialImage.current)
    setAvatarInput(initialImage.current)
    setEmail(initialEmail.current)

    isSet.current = true
  }

  const returnInitialValue = (type: number) => {
    if (type == 0) {
      setName(initialName.current)
      setPhone(initialPhone.current)
    } else setAddress(initialAddress.current)
  }

  const userId = user?.userId

  const token = user?.accessToken
  const [opened, { open, close }] = useDisclosure(false)

  const userMutation = useMutation({
    mutationKey: ['update-user'],
    mutationFn: () =>
      userService.updateUser(userId, token, name, phone, address, avatar),
    onSuccess: async (res) => {
      toast.success('Cập nhập thành công')
      await queryClient.refetchQueries({
        queryKey: ['userInfor'],
        type: 'active',
        exact: true,
      })
    },
    onError: (err) => {
      toast.error('Cập nhập thất bại.')
      console.log('err: ', err)
    },
    retry: 3,
  })

  const updateClick = async () => {
    const a = await userMutation.mutateAsync()
  }

  return (
    <Stack w={'100%'} h={'100%'} px={100}>
      <Modal opened={opened} onClose={close} centered>
        <Stack>
          <Stack>
            <Text>Đường dẫn avatar: </Text>
            <Input
              value={avatarInput}
              onChange={(event) => {
                setAvatarInput(event.target.value)
              }}
            />
          </Stack>
          <Group w={'100%'} justify='space-evenly'>
            <Button
              h={'1.25 rem'}
              bg={'transparent'}
              className='text-[#02B1AB] border-0'
              onClick={() => {
                if (avatarInput != '') {
                  setAvatar(avatarInput)
                  updateClick()
                  close()
                } else {
                  toast.error('Đường dẫn không thể để trống.')
                }
              }}
            >
              Lưu
            </Button>
            <Button
              h={'1.25 rem'}
              bg={'transparent'}
              className=' text-[#02B1AB] border-0'
              onClick={() => {
                setAvatarInput('')
                close()
              }}
            >
              Hủy
            </Button>
          </Group>
        </Stack>
      </Modal>
      <Group>
        <Stack align='center' justify='center' className='flex-[1]'>
          <Group
            w={140}
            h={140}
            justify='center'
            align='center'
            className=' rounded-full '
          >
            <Image
              alt='avatar'
              h={120}
              w='auto'
              fit='contain'
              className='rounded-full '
              src={avatar}
            />
          </Group>

          <Button
            bg={'transparent'}
            h={25}
            w={120}
            className=' text-[#02B1AB] font-light border-[1.5px] border-[#02B1AB] rounded-[5px]'
            onClick={() => {
              open()
            }}
          >
            Thay đổi
          </Button>
        </Stack>
        <Stack
          bg={'white'}
          p={20}
          className='flex-[2] rounded-[10px] box-content'
        >
          <Flex w={'100%'} direction={'row-reverse'}>
            {enableBox1 && (
              <Button
                bg={'transparent'}
                className=' h-5 text-[#02B1AB] border-0'
                //style={{ height: '1.25rem', color: '#02B1AB' }}
                onClick={() => {
                  returnInitialValue(0)
                  setEnableBox1(!enableBox1)
                }}
              >
                Hủy
              </Button>
            )}
            <Button
              bg={'transparent'}
              className=' h-5 text-[#02B1AB] border-0'
              onClick={() => {
                if (enableBox1) {
                  // input valid check function will return null
                  if (checkNameFormat(name)) {
                    toast.error('Tên không hợp lệ')
                    returnInitialValue(0)
                  } else if (checkPhoneFormat(phone)) {
                    returnInitialValue(0)
                    toast.error('Số điện thoại không hợp lệ')
                  } else {
                    updateClick()
                  }
                }
                setEnableBox1(!enableBox1)
              }}
            >
              {enableBox1 ? 'Lưu' : 'Thay đổi'}
            </Button>
          </Flex>
          <TextInput
            withAsterisk
            label={'Tên'}
            value={name}
            disabled={!enableBox1}
            onChange={(event) => {
              setName(event.currentTarget.value)
            }}
          />
          <TextInput
            withAsterisk
            label={'Email'}
            value={email}
            disabled={true}
          />
          <TextInput
            withAsterisk
            label={'Số điện thoại'}
            value={phone}
            disabled={!enableBox1}
            onChange={(event) => {
              setPhone(event.currentTarget.value)
            }}
          />
        </Stack>
      </Group>
      {/* <Stack p={20} bg={'white'} className='rounded-[10px]'> */}
      {/*   <Group justify='space-between' w={'100%'}> */}
      {/*     <Group className='gap-2'> */}
      {/*       <IconMapPinFilled style={{ color: '#02B1AB' }} /> */}
      {/*       <Text className='text-[#02B1AB] font-bold'>Địa chỉ</Text> */}
      {/*     </Group> */}
      {/*     <Group gap={0}> */}
      {/*       <Button */}
      {/*         onClick={() => { */}
      {/*           if (enableBox2) { */}
      {/*             // input valid check function will return null */}
      {/*             if (checkAddressFormat(address)) { */}
      {/*               toast.error('Địa chỉ không hợp lệ') */}
      {/*               returnInitialValue(1) */}
      {/*             } else { */}
      {/*               updateClick() */}
      {/*             } */}
      {/*           } */}
      {/*           setEnableBox2(!enableBox2) */}
      {/*         }} */}
      {/*         bg={'transparent'} */}
      {/*         className=' h-5 cursor-pointer text-[#02B1AB]  border-0' */}
      {/*       > */}
      {/*         {enableBox2 ? 'Lưu' : 'Thay đổi'} */}
      {/*       </Button> */}
      {/*       {enableBox2 && ( */}
      {/*         <Button */}
      {/*           onClick={() => { */}
      {/*             returnInitialValue(1) */}
      {/*             setEnableBox2(!enableBox2) */}
      {/*           }} */}
      {/*           bg={'transparent'} */}
      {/*           className=' h-5 text-[#02B1AB] border-0' */}
      {/*         > */}
      {/*           Hủy */}
      {/*         </Button> */}
      {/*       )} */}
      {/*     </Group> */}
      {/*   </Group> */}
      {/*   <Textarea */}
      {/*     withAsterisk */}
      {/*     disabled={!enableBox2} */}
      {/*     value={address} */}
      {/*     onChange={(event) => { */}
      {/*       setAddress(event.currentTarget.value) */}
      {/*     }} */}
      {/*   /> */}
      {/* </Stack> */}
      {userInfor.isPending && (
        <LoadingOverlay
          visible={true}
          zIndex={1000}
          overlayProps={{ radius: 'sm', blur: 2 }}
        />
      )}
    </Stack>
  )
}

// export default dynamic(() => Promise.resolve(DetailsPage), { ssr: false });
export default AccountPage

'use client'
import '@/styles/global.css'
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
  FileInput,
} from '@mantine/core'
import NextImage from 'next/image'
import { useDisclosure } from '@mantine/hooks'
import defaultAvatar from '@/public/pic/Avatar.png'
import queryClient from '@/helpers/client'
import { useRouter } from 'next/navigation'
import { IconMapPinFilled } from '@tabler/icons-react'
import { useContext, useRef, useState, useMemo } from 'react'
import { useMutation, useQuery } from '@tanstack/react-query'
import { constant } from '@/utils/constant'
import toast, { Toaster } from 'react-hot-toast'
import {
  checkAddressFormat,
  checkEmailFormat,
  checkNameFormat,
  checkPhoneFormat,
} from '@/utils/regex'
import { userService } from '@/services/userService'
import UserContext from '@/contexts/UserContext'
import { FilePreview } from '@/types/file'
import dynamic from 'next/dynamic'
import { Pos } from '@/types/mapType'

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
  const [avatar, setAvatar] = useState<string>()
  const [avatarInput, setAvatarInput] = useState<FilePreview>()
  const [email, setEmail] = useState('')

  const [enableBox1, setEnableBox1] = useState(false)

  // store initial value
  const isSet = useRef(false)
  let initialName = useRef('')
  let initialEmail = useRef('')
  let initialPhone = useRef('')
  let initialAddress = useRef('')

  if (!isSet.current && userInfor.isSuccess) {
    initialName.current = userInfor.data.display_name
    initialEmail.current = userInfor.data.email
    initialPhone.current = userInfor.data.phone
    if (userInfor.data?.user_attributes?.address)
      initialAddress.current = userInfor.data.user_attributes.address
    else {
      const userAttributes = JSON.parse(userInfor.data.user_attributes)
      initialAddress.current = userAttributes.address
    }
    setName(initialName.current)
    setPhone(initialPhone.current)
    setAddress(initialAddress.current)
    setEmail(initialEmail.current)
    setAvatar(userInfor.data?.avatar || constant.DEFAULT_AVATAR)

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

  const namePhoneMutation = useMutation({
    mutationKey: ['update-user', 'name', 'phone'],
    mutationFn: () => {
      const updateUserPromise = userService.updateNamePhone(
        userId,
        token,
        name,
        phone,
      )
      toast.promise(updateUserPromise, {
        success: "Cập nhập thành công'",
        error: 'Cập nhập thất bại.',
        loading: 'Đang xử lý',
      })
      return updateUserPromise
    },

    onSuccess: async (res) => {
      await queryClient.refetchQueries({
        queryKey: ['userInfor'],
        type: 'active',
        exact: true,
      })
    },
    throwOnError: false,
  })
  const avatarMutation = useMutation({
    mutationKey: ['update-user', 'avatar'],
    mutationFn: (newAvatar: File) => {
      const updateUserPromise = userService.updateAvatar(
        userId,
        token,
        newAvatar,
      )
      toast.promise(updateUserPromise, {
        success: "Cập nhập thành công'",
        error: 'Cập nhập thất bại.',
        loading: 'Đang xử lý',
      })
      return updateUserPromise
    },

    onSuccess: async (res) => {
      await queryClient.refetchQueries({
        queryKey: ['userInfor'],
        type: 'active',
        exact: true,
      })
    },
    throwOnError: false,
  })

  const selectAvatarImage = (newAvatar: File | null) => {
    if (!newAvatar) return
    setAvatarInput({
      file: newAvatar,
      previewUrl: URL.createObjectURL(newAvatar),
    })
  }
  return (
    <Stack w={'100%'} h={'100%'} px={100}>
      <Modal
        opened={opened}
        onClose={() => {
          close()
          setAvatarInput(undefined)
        }}
        centered
      >
        <Stack>
          <Stack>
            {/* <Text>Chọn ảnh</Text> */}
            {avatarInput && (
              <img
                src={avatarInput?.previewUrl}
                style={{ width: '200px', height: 'auto' }}
              />
            )}
            <FileInput
              accept='image/*'
              withAsterisk
              clearable
              onChange={selectAvatarImage}
              placeholder='Chọn ảnh'
            />
          </Stack>
          <Group w={'100%'} justify='space-evenly'>
            <Button
              h={'1.25 rem'}
              bg={'transparent'}
              className='text-[#02B1AB] border-0 hover:text-[#02B1AB]'
              onClick={async () => {
                if (!avatarInput?.file) return
                setAvatar(avatarInput.previewUrl)
                setAvatarInput(undefined)
                close()
                avatarMutation.mutate(avatarInput.file)
              }}
            >
              Lưu
            </Button>
            <Button
              h={'1.25 rem'}
              bg={'transparent'}
              className=' text-[#02B1AB] border-0 hover:text-[#02B1AB]'
              onClick={() => {
                setAvatarInput(undefined)
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
            className=' text-[#02B1AB] font-light border-[1.5px] border-[#02B1AB] rounded-[5px] hover:text-[#02B1AB]'
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
                className=' h-5 text-[#02B1AB] border-0 hover:text-[#02B1AB]'
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
              className=' h-5 text-[#02B1AB] border-0 hover:text-[#02B1AB]'
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
                    namePhoneMutation.mutate()
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

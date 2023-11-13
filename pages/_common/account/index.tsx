import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'
import 'react-photo-view/dist/react-photo-view.css'

// next
import Head from 'next/head'

import { styled } from '@mui/system'

import UploadImage from 'src/components/uploadImage'
import { useAppSelector } from 'src/store/hooks'
import { userInfoActions } from 'src/store/userInfo/userInfoSlice'
import { objToStringParam, platform } from 'src/utils/global.utils'
import AddressBook from './_address-book'
import ChangePassword from './_change-password'
import PersonalInformation from './_update-information'

import classes from './styles.module.scss'

import moment from 'moment'
// dayjs

// mui

import { Box, Breadcrumbs, Stack, Tab, Tabs, Typography } from '@mui/material'
import { TypographyTitlePage } from 'src/components'
import { useAppDispatch } from 'src/store/hooks'
import { loadingActions } from 'src/store/loading/loadingSlice'

// mui
// import { styled } from '@mui/material/styles'
import { yupResolver } from '@hookform/resolvers/yup'
import { useForm } from 'react-hook-form'
import { schema } from './validations'

// // api
import Link from 'next/link'
import { useEnqueueSnackbar } from 'src/components/enqueueSnackbar'
import { handlerGetErrMessage } from 'src/utils/global.utils'
import { updateUserInfo } from './accountAPI'
import { AccountDataType } from './accountModel'
import WorkLogHistoryComponent from './_work-log-history'
import { useTranslation } from 'next-i18next'

// import { BoxCustom, TypographyCustom } from './styled'

const formatPhoneNumber = (phoneNumber: string) => {
  return phoneNumber.replace(/(\d{3})(\d{3})(\d{4})/, '($1) $2 $3')
}

const TabsCustom = styled(Tabs)(({ theme }) => ({
  '& .MuiTabs-indicator': {
    left: '0',
    backgroundColor: theme.palette.primary.main,
    paddingLeft: '5px',
  },
  '& .Mui-selected': {
    backgroundColor: '#F1F3F9',
    gap: 10,
    textTransform: 'none',
    color: `${theme.palette.primary.main} !important`,
  },
  '& .MuiTabs-flexContainer': {
    backgroundColor: '#F8F9FC',
  },
  '& .MuiTabs-root': { backgroundColor: 'white !important' },
  '& .MuiTabs-fixed': { padding: '4px' },
  '& .MuiTab-root': {
    textTransform: 'none',
    alignItems: 'self-start',
    color: '#49516F',
    fontWeight: '400',
    lineHeight: '2.4rem',
  },
}))

const BoxCustom = styled(Box)(() => ({
  backgroundColor: '#F8F9FC',
  border: '1px none #E1E6EF',
}))

const TypographyCustom = styled(Typography)(() => ({
  fontSize: '1.6rem',
  // fontWeight: '400',
  color: '#49516F',
}))

interface TabPanelProps {
  children?: React.ReactNode
  type: string
  value: string
}

const TabPanel = (props: TabPanelProps) => {
  const { children, value, type, ...other } = props
  return (
    <div
      role="tabpanel"
      hidden={value !== type}
      id={`vertical-tabpanel-${type}`}
      aria-labelledby={`vertical-tab-${type}`}
      {...other}
    >
      {value === type && (
        <Box sx={{ padding: '0px', width: '100%' }}>{children}</Box>
      )}
    </div>
  )
}

const a11yProps = (index: number) => {
  return {
    id: `vertical-tab-${index}`,
    'aria-controls': `vertical-tabpanel-${index}`,
  }
}

const AccountComponent: React.FC = () => {
  const { t } = useTranslation('account')
  const [pushMessage] = useEnqueueSnackbar()
  const router = useRouter()
  const tab = router.query.tab
  const address = router.query.address
  const dispatch = useAppDispatch()
  const userInfo = useAppSelector((state) => state.userInfo)
  const [stateBreadcrumbs, setBreadCrumbs] = useState<string>()
  const [stateBreadcrumbs2, setBreadCrumbs2] = useState<string>()
  const [stateValue, setValueTabs] = React.useState<string>('')

  const {
    setValue,
    watch,
    trigger,
    // getValues,
  } = useForm<AccountDataType>({
    resolver: yupResolver(schema),
    mode: 'all',
  })

  const onSubmit = (values: string) => {
    const obj = { avatar: values }

    dispatch(loadingActions.doLoading())
    updateUserInfo(obj)
      .then(() => {
        dispatch(loadingActions.doLoadingSuccess())
        pushMessage(t('avatarUpdateSuccessfully'), 'success')
        dispatch(userInfoActions.doUserInfo())
      })
      .catch(({ response }) => {
        const { status, data } = response
        dispatch(loadingActions.doLoadingFailure())
        pushMessage(handlerGetErrMessage(status, data), 'error')
      })
  }

  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    console.log('🚀 ~ handleChange ~ newValue:', newValue)

    setValueTabs(newValue)
    console.log(event)

    if (newValue === 'personal-profile') {
      router.replace({
        search: `${objToStringParam({
          ...router.query,
          tab: '',
          address: '',
          id: '',
        })}`,
      })
    }
    if (newValue === 'update-profile') {
      router.replace({
        search: `${objToStringParam({
          ...router.query,
          tab: 'update-profile',
          address: '',
          id: '',
        })}`,
      })
    }
    if (newValue === 'change-password') {
      router.replace({
        search: `${objToStringParam({
          ...router.query,
          tab: 'change-password',
          address: '',
          id: '',
        })}`,
      })
    }

    if (userInfo.data.user_type == 'MERCHANT' && newValue === 'address-book') {
      router.replace({
        search: `${objToStringParam({
          ...router.query,
          tab: 'address-book',
          address: '',
          id: '',
        })}`,
      })
    }

    if (newValue === 'work-log-history') {
      router.replace({
        search: `${objToStringParam({
          ...router.query,
          tab: 'work-log-history',
          address: '',
          id: '',
        })}`,
      })
    }
  }

  useEffect(() => {
    if (!tab) {
      setValueTabs('personal-profile')
      setBreadCrumbs('')
    }
    if (tab === 'update-profile') {
      setValueTabs('update-profile')
      setBreadCrumbs(t('updatePersonalInformation'))
    }
    if (tab === 'change-password') {
      setValueTabs('change-password')
      setBreadCrumbs(t('changePassword'))
    }

    if (userInfo.data.user_type == 'MERCHANT') {
      if (tab === 'address-book') {
        setValueTabs('address-book')
        setBreadCrumbs(t('changePassword'))

        if (address === 'update') {
          setBreadCrumbs2(t('updateAddress'))
        }
        if (address === 'create') {
          setBreadCrumbs2(t('createAddress'))
        }
      }
    }
    if (tab === 'work-log-history') {
      setValueTabs('work-log-history')
      setBreadCrumbs(t('workLogHistory'))
    }
  }, [address, router.query, stateBreadcrumbs, tab, userInfo, router.query.tab])

  return (
    <>
      <Head>
        <title>{t('accountInformation')} | TWSS</title>
      </Head>
      <TypographyTitlePage variant="h1" mb={2}>
        {!stateBreadcrumbs
          ? t('accountInformation')
          : !router.query.address
          ? stateBreadcrumbs
          : stateBreadcrumbs2}
      </TypographyTitlePage>
      <Breadcrumbs
        separator=">"
        aria-label="breadcrumb"
        sx={{ marginBottom: '35px' }}
      >
        <Typography>{t('accountInformation')}</Typography>
        {!stateBreadcrumbs ? (
          ''
        ) : tab === 'addres-book' ? (
          <Link href="&tab=addressbook">
            <Typography> {stateBreadcrumbs}</Typography>
          </Link>
        ) : (
          <Typography> {stateBreadcrumbs}</Typography>
        )}
        {!address ? '' : <Typography>{stateBreadcrumbs2}</Typography>}
      </Breadcrumbs>

      <Stack direction="row" spacing={2}>
        <BoxCustom
          sx={{ width: '263px', height: '100%', backgroundColor: 'white' }}
        >
          <TabsCustom
            orientation="vertical"
            // variant="scrollable"
            value={stateValue}
            onChange={handleChange}
            aria-label="Vertical tabs example"
          >
            <Tab
              label={t('personalProfile')}
              value="personal-profile"
              {...a11yProps(0)}
            />
            <Tab
              label={t('updateProfile')}
              value="update-profile"
              {...a11yProps(1)}
            />
            <Tab
              label={t('changePassword')}
              value="change-password"
              {...a11yProps(2)}
            />
            {userInfo.data.user_type == 'MERCHANT' ? (
              <Tab
                label={t('addressBook')}
                onClick={() =>
                  router.replace({
                    search: `${objToStringParam({
                      ...router.query,
                      tab: 'address-book',
                      address: '',
                      id: '',
                    })}`,
                  })
                }
                value="address-book"
                {...a11yProps(3)}
              />
            ) : (
              ''
            )}
            <Tab
              label={t('workLogHistory')}
              value="work-log-history"
              {...a11yProps(4)}
            />
          </TabsCustom>
        </BoxCustom>

        <Box sx={{ width: '100%' }}>
          <TabPanel value={stateValue} type={'personal-profile'}>
            <Box
              sx={{
                width: '100%',
                border: '1px solid #E1E6EF',
                padding: '25px',
                borderRadius: '10px',
              }}
            >
              <Box
                sx={{
                  marginBottom: '25px',
                }}
              >
                <TypographyCustom
                  sx={{
                    fontWeight: '500',
                    fontSize: '1.4rem',
                    lineHeight: '2.2rem',
                    marginBottom: '15px',
                  }}
                >
                  {t('profilePhoto')}
                </TypographyCustom>
                <UploadImage
                  file={
                    userInfo.data.avatar
                      ? userInfo.data.avatar
                      : (watch('avatar') as string)
                  }
                  onFileSelectSuccess={(file: string) => {
                    onSubmit(file)
                    setValue('avatar', file)
                    trigger('avatar')
                  }}
                  onFileSelectError={() => {
                    return
                  }}
                  onFileSelectDelete={() => {
                    setValue('avatar', '')
                    trigger('avatar')
                  }}
                />
              </Box>
              <Stack spacing={2}>
                <Stack
                  direction="row"
                  spacing={2}
                  justifyContent="space-between"
                  sx={{ marginBottom: '15px' }}
                >
                  <TypographyCustom
                    sx={{
                      fontWeight: '500',
                      fontSize: '1.4rem',
                      lineHeight: '2.2rem',
                      // marginBottom: '15px',
                      color: '#49516F',
                    }}
                  >
                    {t('about')}
                  </TypographyCustom>
                  <Link
                    href={`/${platform().toLowerCase()}/account?tab=update-information&`}
                  >
                    <a className={classes['text-link']}>
                      {t('updateAccountInformation')}
                    </a>
                  </Link>
                </Stack>
                <Stack
                  spacing={2}
                  sx={{ backgroundColor: '#F8F9FC', padding: '15px' }}
                >
                  <Stack
                    direction="row"
                    spacing={2}
                    justifyContent="space-between"
                  >
                    <TypographyCustom>{t('firstName')}</TypographyCustom>
                    <TypographyCustom sx={{ color: '#1B1F27' }}>
                      {userInfo.data.first_name}
                    </TypographyCustom>
                  </Stack>
                  <Stack
                    direction="row"
                    spacing={2}
                    sx={{ gap: '10' }}
                    justifyContent="space-between"
                  >
                    <TypographyCustom>{t('lastName')}</TypographyCustom>
                    <TypographyCustom sx={{ color: '#1B1F27' }}>
                      {userInfo.data.last_name}
                    </TypographyCustom>
                  </Stack>

                  <Stack
                    direction="row"
                    spacing={2}
                    justifyContent="space-between"
                  >
                    <TypographyCustom>{t('phoneNumber')}</TypographyCustom>
                    <TypographyCustom sx={{ color: '#1B1F27' }}>
                      {formatPhoneNumber(userInfo.data.phone_number)}
                    </TypographyCustom>
                  </Stack>
                  <Stack
                    direction="row"
                    spacing={2}
                    sx={{ gap: '10' }}
                    justifyContent="space-between"
                  >
                    <TypographyCustom>{t('email')}</TypographyCustom>
                    <TypographyCustom sx={{ color: '#1B1F27' }}>
                      {userInfo.data.email}
                    </TypographyCustom>
                  </Stack>
                  <Stack
                    direction="row"
                    spacing={2}
                    justifyContent="space-between"
                  >
                    <TypographyCustom>{t('dateOfBirth')}</TypographyCustom>
                    <TypographyCustom sx={{ color: '#1B1F27' }}>
                      {!userInfo.data.dob
                        ? 'N/A'
                        : moment(userInfo.data.dob).format('MM/DD/YYYY')}
                    </TypographyCustom>
                  </Stack>
                  <Stack
                    direction="row"
                    spacing={2}
                    justifyContent="space-between"
                  >
                    <TypographyCustom>{t('address')}</TypographyCustom>
                    <TypographyCustom sx={{ color: '#1B1F27' }}>
                      {userInfo.data.address ? userInfo.data.address : 'N/A'}
                    </TypographyCustom>
                  </Stack>
                </Stack>
              </Stack>
            </Box>
          </TabPanel>
          <TabPanel value={stateValue} type={'update-profile'}>
            <PersonalInformation />
          </TabPanel>
          <TabPanel value={stateValue} type={'change-password'}>
            <ChangePassword />
          </TabPanel>
          {userInfo.data.user_type == 'MERCHANT' ? (
            <TabPanel value={stateValue} type={'address-book'}>
              <AddressBook />
            </TabPanel>
          ) : (
            <></>
          )}
          <TabPanel value={stateValue} type={'work-log-history'}>
            <WorkLogHistoryComponent />
          </TabPanel>
        </Box>
      </Stack>
    </>
  )
}

export default AccountComponent

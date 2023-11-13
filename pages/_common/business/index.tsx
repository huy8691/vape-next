import { Box, Breadcrumbs, Stack, Tab, Tabs, Typography } from '@mui/material'
import { styled } from '@mui/system'
import Head from 'next/head'
import React, { useEffect, useState } from 'react'
import { TypographyTitlePage } from 'src/components'

import { yupResolver } from '@hookform/resolvers/yup'
import Link from 'next/link'
import { useForm } from 'react-hook-form'
import UploadImage from 'src/components/uploadImage'
import { BusinessAvatarType, BusinessProfileType } from './businessModel'
import { schema } from './validations'

import { Download } from '@phosphor-icons/react'
import { useRouter } from 'next/router'
import { useEnqueueSnackbar } from 'src/components/enqueueSnackbar'
import { useAppDispatch } from 'src/store/hooks'
import { loadingActions } from 'src/store/loading/loadingSlice'
import {
  handlerGetErrMessage,
  objToStringParam,
  platform,
} from 'src/utils/global.utils'
import { getBusinessProfile, updateLogoBusiness } from './apiBusiness'
import PaymentMethodComponent from './part/payment-method'
import TaxConfigurationComponent from './part/tax-configuration'
import UpdateBusinessComponent from './part/update'
import WorkLogConfigurationComponent from './part/work-log-configuration'
import { useTranslation } from 'next-i18next'

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
    fontWeight: '600 !important',
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
const TypographyCustom = styled(Typography)(() => ({
  color: '#49516F',
  width: '200px',
}))
const BoxCustom = styled(Box)(() => ({
  backgroundColor: '#F8F9FC',
  border: '1px none #E1E6EF',
}))

const a11yProps = (index: number) => {
  return {
    id: `vertical-tab-${index}`,
    'aria-controls': `vertical-tabpanel-${index}`,
  }
}

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
const BusinessComponent: React.FC = () => {
  const { t } = useTranslation('business')
  const [stateBreadcrumbs, setBreadCrumbs] = useState<string>('')
  const [stateTabValue, setStateTabValue] = useState<string>('')
  const [stateBusinessProfile, setStateBusinessProfile] =
    useState<BusinessProfileType>()
  const router = useRouter()
  const tab = router.query.tab
  const [pushMessage] = useEnqueueSnackbar()
  const dispatch = useAppDispatch()
  const handleChangeTab = (event: React.SyntheticEvent, newValue: string) => {
    console.log('event', event)
    setStateTabValue(newValue)
    router.replace({
      search: `${objToStringParam({
        tab: newValue,
      })}`,
    })
    console.log('newValue', newValue)
  }
  const handleGetBusinessProfile = () => {
    getBusinessProfile()
      .then((res) => {
        const { data } = res.data
        setStateBusinessProfile(data)
      })
      .catch(({ response }) => {
        const { status, data } = response
        pushMessage(handlerGetErrMessage(status, data), 'error')
      })
  }
  useEffect(() => {
    if (!tab) {
      setStateTabValue('')
      handleGetBusinessProfile()
      setBreadCrumbs('')
      return
    }

    console.log('tab', tab)

    if (tab === 'business-profile') {
      setStateTabValue('business-profile')
      setBreadCrumbs('Business Profile')
    }
    if (tab === 'update-business-profile') {
      setStateTabValue('update-business-profile')
      setBreadCrumbs('Update Business Profile')
    }
    if (tab === 'tax-configuration') {
      setStateTabValue('tax-configuration')
      setBreadCrumbs('Tax Configuration')
    }

    if (tab === 'payment-methods') {
      setStateTabValue('payment-methods')
      setBreadCrumbs('Payment methods')
    }
    if (tab === 'work-log-configuration') {
      setStateTabValue('work-log-configuration')
      setBreadCrumbs('Work Log Configuration')
    }

    setStateTabValue(tab as string)
  }, [tab])
  const {
    setValue,
    watch,
    trigger,
    // getValues,
  } = useForm<BusinessAvatarType>({
    resolver: yupResolver(schema(t)),
    mode: 'all',
  })
  const onSubmit = (values: string) => {
    const obj: BusinessAvatarType = { logo: values }
    console.log('obj', obj)
    dispatch(loadingActions.doLoading())
    updateLogoBusiness(obj)
      .then(() => {
        dispatch(loadingActions.doLoadingSuccess())
        pushMessage(t('message.updateLogoSuccessfully'), 'success')
        handleGetBusinessProfile()
      })
      .catch(({ response }) => {
        const { status, data } = response
        dispatch(loadingActions.doLoadingFailure())
        pushMessage(handlerGetErrMessage(status, data), 'error')
      })
  }

  return (
    <Box>
      <Head>
        <title>{t('businessInformation')} | TWSS</title>
      </Head>
      <TypographyTitlePage>{t('businessInformation')}</TypographyTitlePage>
      <Breadcrumbs
        separator=">"
        aria-label="breadcrumb"
        sx={{ marginBottom: '35px' }}
      >
        <Typography>{t('businessManagement')}</Typography>
        {!stateBreadcrumbs ? '' : <Typography>{stateBreadcrumbs}</Typography>}
      </Breadcrumbs>

      <Stack direction="row" spacing={2}>
        <BoxCustom
          sx={{ width: '263px', height: '100%', backgroundColor: 'white' }}
        >
          <TabsCustom
            orientation="vertical"
            // variant="scrollable"
            value={stateTabValue}
            onChange={handleChangeTab}
            aria-label="Vertical tabs example"
          >
            <Tab
              label={t('businessProfile')}
              value="business-profile"
              {...a11yProps(0)}
            />
            <Tab
              label={t('updateBusinessProfile')}
              value="update-business-profile"
              {...a11yProps(1)}
            />
            <Tab
              label={t('taxConfiguration')}
              value="tax-configuration"
              {...a11yProps(2)}
            />
            <Tab
              label={t('paymentMethods')}
              value="payment-methods"
              {...a11yProps(3)}
            />
            <Tab
              label={t('workLogConfiguration')}
              value="work-log-configuration"
              {...a11yProps(4)}
            />
          </TabsCustom>
        </BoxCustom>
        <Box sx={{ width: '100%' }}>
          <TabPanel value={stateTabValue} type="business-profile">
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
                  {t('businessLogo')}
                </TypographyCustom>
                <UploadImage
                  file={
                    stateBusinessProfile?.logo
                      ? stateBusinessProfile.logo
                      : watch('logo')
                  }
                  onFileSelectSuccess={(file: string) => {
                    onSubmit(file)
                    setValue('logo', file)
                    trigger('logo')
                  }}
                  onFileSelectError={() => {
                    return
                  }}
                  onFileSelectDelete={() => {
                    setValue('logo', '')

                    trigger('logo')
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
                      // marginBottom: '15px',
                      color: '#49516F',
                    }}
                  >
                    {t('about')}
                  </TypographyCustom>
                  <Link href={`/${platform().toLowerCase()}/business?tab=1`}>
                    <a style={{ color: '#2f6fed', fontWeight: 500 }}>
                      {t('updateBusinessProfile')}
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
                    sx={{
                      paddingBottom: '15px',
                      borderBottom: '1px solid #BABABA80',
                    }}
                  >
                    <TypographyCustom>{t('businessName')}</TypographyCustom>
                    <TypographyCustom sx={{ color: '#1B1F27' }}>
                      {stateBusinessProfile?.business_name
                        ? stateBusinessProfile.business_name
                        : 'N/A'}
                    </TypographyCustom>
                  </Stack>
                  <Stack
                    direction="row"
                    spacing={2}
                    sx={{
                      paddingBottom: '15px',
                      borderBottom: '1px solid #BABABA80',
                    }}
                  >
                    <TypographyCustom>{t('websiteUrl')}</TypographyCustom>
                    <TypographyCustom sx={{ color: '#1B1F27' }}>
                      {stateBusinessProfile?.website_link_url
                        ? stateBusinessProfile.website_link_url
                        : 'N/A'}
                    </TypographyCustom>
                  </Stack>
                  <Stack
                    direction="row"
                    spacing={2}
                    sx={{
                      paddingBottom: '15px',
                      borderBottom: '1px solid #BABABA80',
                    }}
                  >
                    <TypographyCustom>{t('federalTaxId')}</TypographyCustom>
                    <TypographyCustom sx={{ color: '#1B1F27' }}>
                      {stateBusinessProfile?.federal_tax_id
                        ? stateBusinessProfile.federal_tax_id
                        : 'N/A'}
                    </TypographyCustom>
                  </Stack>
                  <Stack
                    direction="row"
                    spacing={2}
                    sx={{
                      paddingBottom: '15px',
                      borderBottom: '1px solid #BABABA80',
                    }}
                  >
                    <TypographyCustom>
                      {t('businessTaxDocument')}
                    </TypographyCustom>
                    <a
                      href={`${stateBusinessProfile?.business_tax_document}`}
                      style={{ color: '#2200CC' }}
                    >
                      <Stack direction="row" spacing={1} alignItems="center">
                        <Download color="#2200CC" size={18} />
                        <Typography
                          style={{
                            width: '100%',
                            maxWidth: '135px',
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            direction: 'rtl',
                            color: '#2F6FED',
                          }}
                        >
                          {stateBusinessProfile?.business_tax_document}
                        </Typography>
                      </Stack>
                    </a>
                  </Stack>
                  <Stack
                    direction="row"
                    spacing={2}
                    sx={{
                      paddingBottom: '15px',
                      borderBottom: '1px solid #BABABA80',
                    }}
                  >
                    <TypographyCustom>
                      {t('vaporTobaccoLicense')}
                    </TypographyCustom>
                    <a href={`${stateBusinessProfile?.vapor_tobacco_license}`}>
                      <Stack direction="row" spacing={1} alignItems="center">
                        <Download color="#2200CC" size={18} />
                        <Typography
                          style={{
                            width: '100%',
                            maxWidth: '135px',
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            direction: 'rtl',
                            color: '#2F6FED',
                          }}
                        >
                          {stateBusinessProfile?.vapor_tobacco_license}
                        </Typography>
                      </Stack>
                    </a>
                  </Stack>
                  <Stack
                    direction="row"
                    spacing={2}
                    sx={{
                      paddingBottom: '15px',
                      borderBottom: '1px solid #BABABA80',
                    }}
                  >
                    <TypographyCustom>{t('address')}</TypographyCustom>
                    <TypographyCustom sx={{ color: '#1B1F27' }}>
                      {stateBusinessProfile?.address
                        ? stateBusinessProfile.address
                        : 'N/A'}
                    </TypographyCustom>
                  </Stack>
                  <Stack
                    direction="row"
                    spacing={2}
                    sx={{
                      paddingBottom: '15px',
                      borderBottom: '1px solid #BABABA80',
                    }}
                  >
                    <TypographyCustom>{t('city')}</TypographyCustom>
                    <TypographyCustom sx={{ color: '#1B1F27' }}>
                      {stateBusinessProfile?.city
                        ? stateBusinessProfile.city
                        : 'N/A'}
                    </TypographyCustom>
                  </Stack>
                  <Stack
                    direction="row"
                    spacing={2}
                    sx={{
                      paddingBottom: '15px',
                      borderBottom: '1px solid #BABABA80',
                    }}
                  >
                    <TypographyCustom>{t('state')}</TypographyCustom>
                    <TypographyCustom sx={{ color: '#1B1F27' }}>
                      {stateBusinessProfile?.state
                        ? stateBusinessProfile.state
                        : 'N/A'}
                    </TypographyCustom>
                  </Stack>
                  <Stack direction="row" spacing={2}>
                    <TypographyCustom>{t('zipcode')}</TypographyCustom>
                    <TypographyCustom sx={{ color: '#1B1F27' }}>
                      {stateBusinessProfile?.postal_zipcode
                        ? stateBusinessProfile.postal_zipcode
                        : 'N/A'}
                    </TypographyCustom>
                  </Stack>
                </Stack>
              </Stack>
            </Box>
          </TabPanel>
          <TabPanel value={stateTabValue} type="update-business-profile">
            <UpdateBusinessComponent />
          </TabPanel>
          <TabPanel value={stateTabValue} type="tax-configuration">
            <TaxConfigurationComponent />
          </TabPanel>
          <TabPanel value={stateTabValue} type="payment-methods">
            <PaymentMethodComponent />
          </TabPanel>
          <TabPanel value={stateTabValue} type="work-log-configuration">
            <WorkLogConfigurationComponent />
          </TabPanel>
        </Box>
      </Stack>
    </Box>
  )
}

export default BusinessComponent

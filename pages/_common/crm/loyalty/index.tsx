import { TabContext, TabPanel } from '@mui/lab'
import { Box, Modal, styled, IconButton } from '@mui/material'
import Head from 'next/head'
import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'
import {
  ButtonCustom,
  TabCustom,
  TabsTws,
  TypographyTitlePage,
} from 'src/components'
import { X, Info } from '@phosphor-icons/react'
import { objToStringParam } from 'src/utils/global.utils'
import { link } from 'src/constants/link.constant'
import PointBurningComponent from './part/PointBurning'
import PointEarningComponent from './part/PointEarning'
import LoyaltyLevelCompany from './part/LoyaltyLevel'
import LoyaltyBenefitComponent from './part/LoyaltyBenefit'
import { useTranslation } from 'next-i18next'

const BoxModalCustom = styled(Box)(() => ({
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '740px',
  background: 'white',
  borderStyle: 'none',
  padding: '20px',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  borderRadius: '8px',
}))
const LoyaltyComponent = () => {
  const [openDialog, setOpenDialog] = useState(false)
  const { t } = useTranslation('loyalty')
  const router = useRouter()
  const [stateValueTab, setStateValueTab] = useState<string>('point-earning')
  const handleChangeTab = (_event: React.SyntheticEvent, newValue: string) => {
    router.replace(
      {
        search: `${objToStringParam({
          tab: newValue,
        })}`,
      },
      undefined,
      { scroll: false }
    )
    console.log('newValue', newValue)
    setStateValueTab(newValue)
  }
  useEffect(() => {
    if (router.query.tab) {
      setStateValueTab(router.query.tab.toString())
    }
  }, [router.query.tab])
  return (
    <Box>
      <Head>
        <title>{t('title')} | VAPE</title>
      </Head>
      <TypographyTitlePage>{t('title')}</TypographyTitlePage>
      <TabContext value={stateValueTab}>
        <TabsTws
          value={stateValueTab}
          onChange={handleChangeTab}
          TabIndicatorProps={{
            children: <span className="MuiTabs-indicatorSpan" />,
          }}
          sx={{
            marginBottom: '20px',
          }}
        >
          <TabCustom
            sx={{
              paddingLeft: 0,
            }}
            label={t('pointsEarningConfiguration')}
            value="point-earning"
          />
          <TabCustom
            label={t('pointsBurningConfiguration')}
            value="point-burning"
          />
          <TabCustom label={t('tieredLoyaltyLevels')} value="loyalty-level" />
          <TabCustom label={t('tieredBenefit')} value="tiered-benefit" />
        </TabsTws>
        <TabPanel value="point-earning" sx={{ padding: 0 }}>
          <PointEarningComponent />
        </TabPanel>

        <TabPanel value="point-burning" sx={{ padding: 0 }}>
          <PointBurningComponent />
        </TabPanel>
        <TabPanel value="loyalty-level" sx={{ padding: 0 }}>
          <LoyaltyLevelCompany />
        </TabPanel>
        <TabPanel value="tiered-benefit" sx={{ padding: 0 }}>
          <LoyaltyBenefitComponent />
        </TabPanel>
      </TabContext>

      <Modal open={openDialog} onClose={() => setOpenDialog(!openDialog)}>
        <BoxModalCustom>
          <Box
            sx={{
              position: 'absolute',
              top: '0',
              right: '0',
              padding: '10px',
            }}
          >
            <IconButton onClick={() => setOpenDialog(!openDialog)}>
              <X size={24} />
            </IconButton>
          </Box>

          <Box sx={{ mt: 4 }}>
            <iframe
              width="700"
              height="398"
              src={link.loyalty}
              title="YouTube video player"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
            ></iframe>
          </Box>
        </BoxModalCustom>
      </Modal>
      <ButtonCustom
        onClick={() => setOpenDialog(!openDialog)}
        variant="contained"
        size="small"
        startIcon={<Info />}
        sx={{
          position: 'absolute',
          bottom: '20px',
          boxShadow: '0px 1px 0px 0px #E1E6EF',
          borderRadius: '30px',
          background: '#ffffff',
          '&.MuiButton-contained': {
            color: '#000000',
          },
        }}
      >
        Help
      </ButtonCustom>
    </Box>
  )
}

export default LoyaltyComponent

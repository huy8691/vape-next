import { NextPageWithLayout } from 'pages/_app.page'
import { ReactElement, useState } from 'react'
import NestedLayout from 'src/layout/nestedLayout'
import {
  Breadcrumbs,
  Typography,
  Box,
  Modal,
  IconButton,
  styled,
} from '@mui/material'
import Head from 'next/head'
import { TypographyTitlePage, ButtonCustom } from 'src/components'
import { KEY_MODULE, PERMISSION_RULE } from 'src/utils/global.utils'
import ListVoucherComponent from 'pages/_common/promotion/voucher/list'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { useTranslation } from 'next-i18next'
import { X, Info } from '@phosphor-icons/react'
import { link } from 'src/constants/link.constant'
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
const ListVoucher: NextPageWithLayout = () => {
  const [openDialog, setOpenDialog] = useState(false)
  const { t } = useTranslation('voucher')
  return (
    <Box>
      <Head>
        <title>{t('voucher')} | TWSS</title>
      </Head>
      <TypographyTitlePage variant="h1" mb={2}>
        {t('voucherManagement')}
      </TypographyTitlePage>

      <Breadcrumbs
        separator=">"
        aria-label="breadcrumb"
        sx={{ marginBottom: '15px' }}
      >
        <Typography>{t('voucherManagement')}</Typography>
      </Breadcrumbs>
      <ListVoucherComponent />
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
              src={link.voucher}
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

export const getStaticProps = async ({ locale }: { locale: string }) => {
  return {
    props: {
      locale,
      ...(await serverSideTranslations(locale, [
        'common',
        'account',
        'voucher',
      ])),
    },
  }
}

ListVoucher.getLayout = function getLayout(page: ReactElement) {
  return <NestedLayout>{page}</NestedLayout>
}
ListVoucher.permissionPage = {
  key_module: KEY_MODULE.Order,
  permission_rule: PERMISSION_RULE.ViewListRetailOrder,
}

export default ListVoucher

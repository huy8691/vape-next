import React, { useState } from 'react'
import { Box, Stack, TextField, Divider } from '@mui/material'
import ListCard from './parts/listCard'
import { TypographyTitlePage, ButtonCustom } from 'src/components'
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers'
import { CalendarBlank } from '@phosphor-icons/react'
import { styled } from '@mui/material/styles'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import dayjs, { Dayjs } from 'dayjs'
import ListPieChartValueByProductCategory from './parts/listPieChartValueByProductCategory'
import ListPieChartProducts from './parts/listPieChartProducts'
import ListPieChartCategoryProduct from './parts/listPieChartCategoryProduct'
// import ListPieChartEmployees from './parts/listPieChartEmployees'
// import ListPieChartValueProductCategory from './parts/listPieChartCategory'
import ListBarChartAverageNumberOfUnitsPerTransaction from './parts/listBarChartAverageNumberOfUnitsPerTransaction'
import ListPieChartEmployees from './parts/listPieChartEmployees'
import ListPieChartStore from './parts/listPieChartStore'
import ListPieChartBrands from './parts/listPieChartBrands'
import { useTranslation } from 'react-i18next'
const CalendarIcon = () => {
  return <CalendarBlank size={16} />
}
const TextFieldDate = styled(TextField)({
  width: '100px',
  '& .MuiInput-underline': {
    fontSize: '12px',
    '&:hover': {
      '&:before': {
        borderBottomWidth: '1px !important',
      },
    },
    '&:before': {
      border: 'none !important',
    },
    '&:after': {
      borderWidth: '1px',
    },
    '& .MuiButtonBase-root': {
      marginTop: '-3px',
    },
  },
})
const DashboardMasterAccount = () => {
  const { t } = useTranslation('report')
  const [count, setCount] = useState(0)
  const [stateDateRange, setStateDateRange] = React.useState<{
    fromDate: Dayjs
    toDate: Dayjs
  }>({
    fromDate: dayjs().startOf('month'),
    toDate: dayjs().endOf('month'),
  })
  return (
    <Box>
      <Stack direction="row" spacing={2} mb={2}>
        <TypographyTitlePage>{t('dashBoardMaster.title')}</TypographyTitlePage>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <Stack
            direction="row"
            spacing={1}
            sx={{
              border: '1px solid #E1E6EF',
              padding: '8px 10px 1px',
              borderRadius: '8px',
            }}
          >
            <DatePicker
              inputFormat="MM/DD/YYYY"
              renderInput={(props) => (
                <TextFieldDate size="small" variant="standard" {...props} />
              )}
              onChange={(e) => {
                if (e) {
                  if (e > stateDateRange.toDate) {
                    setStateDateRange({
                      fromDate: e,
                      toDate: e,
                    })
                  } else {
                    setStateDateRange({
                      ...stateDateRange,
                      fromDate: e,
                    })
                  }
                }
              }}
              value={stateDateRange.fromDate}
              // readOnly
              // disabled
              shouldDisableDate={(day: any) => {
                const date = new Date()
                if (
                  dayjs(day).format('YYYY-MM-DD') >
                  dayjs(date).format('YYYY-MM-DD')
                ) {
                  return true
                }
                return false
              }}
              components={{
                OpenPickerIcon: CalendarIcon,
              }}
            />
            <Divider
              orientation="vertical"
              flexItem
              sx={{ margin: '5px 5px 7px 15px !important' }}
            />
            <DatePicker
              inputFormat="MM/DD/YYYY"
              renderInput={(props) => (
                <TextFieldDate size="small" variant="standard" {...props} />
              )}
              value={stateDateRange.toDate}
              onChange={(e) => {
                setStateDateRange({
                  ...stateDateRange,
                  toDate: e,
                })
              }}
              // readOnly
              // disabled
              shouldDisableDate={(day: any) => {
                const date = new Date()
                if (
                  dayjs(day).format('YYYY-MM-DD') <
                  stateDateRange.fromDate.format('YYYY-MM-DD')
                ) {
                  return true
                }
                if (
                  dayjs(day).format('YYYY-MM-DD') >
                  dayjs(date).format('YYYY-MM-DD')
                ) {
                  return true
                }
                return false
              }}
              components={{
                OpenPickerIcon: CalendarIcon,
              }}
            />
          </Stack>
        </LocalizationProvider>
        <ButtonCustom
          variant="contained"
          onClick={() => {
            setCount((current) => current + 1)
          }}
        >
          {t('dashBoardMaster.applyForAll')}
        </ButtonCustom>
      </Stack>
      <ListCard
        api="api/report/master/revenue"
        count={count}
        dateRange={stateDateRange}
        title={t('dashBoardMaster.revenue')}
        type="values"
      />
      <ListCard
        api="api/report/master/cogs"
        count={count}
        dateRange={stateDateRange}
        title={t('dashBoardMaster.cogsCostOfGoodsSold')}
        type="cogs"
      />
      <ListCard
        api="api/report/master/gross-margin"
        count={count}
        dateRange={stateDateRange}
        title={t('dashBoardMaster.grossMargin')}
        type="gross_margin"
      />
      <ListCard
        api="api/report/master/avg-revenue"
        count={count}
        dateRange={stateDateRange}
        title={t('dashBoardMaster.averageTransactionAmountBy')}
        type="values"
        money={true}
      />
      <ListCard
        api="api/report/master/sold-quantity"
        count={count}
        dateRange={stateDateRange}
        title={t('dashBoardMaster.totalNumberOfUnitsSold')}
        type="values"
      />
      <ListBarChartAverageNumberOfUnitsPerTransaction
        api="api/report/master/avg-number-units"
        count={count}
        dateRange={stateDateRange}
        title={t('dashBoardMaster.averageNumberOfUnitsPerTransaction')}
      />
      <ListPieChartProducts
        api="api/report/master/top-selling"
        count={count}
        dateRange={stateDateRange}
        title={t('dashBoardMaster.top_5SellingProducts')}
      />
      <ListPieChartProducts
        api="api/report/master/bottom-selling"
        count={count}
        dateRange={stateDateRange}
        title={t('dashBoardMaster.bottom_5SellingProducts')}
      />
      <ListPieChartCategoryProduct
        api="api/report/master/top-margin/category"
        count={count}
        dateRange={stateDateRange}
        title={t('dashBoardMaster.top_5MarginByProductCategory')}
      />
      <ListPieChartCategoryProduct
        api="api/report/master/least-margin/category"
        count={count}
        dateRange={stateDateRange}
        title={t('dashBoardMaster.least_5MarginByProductCategory')}
      />
      <ListPieChartBrands
        api="api/report/master/top-brands"
        count={count}
        dateRange={stateDateRange}
        title={t('dashBoardMaster.top_5Brand')}
      />
      <ListPieChartStore count={count} dateRange={stateDateRange} />
      <ListPieChartProducts
        api="api/report/master/top-returned"
        count={count}
        dateRange={stateDateRange}
        title={t('dashBoardMaster.top_5ReturnedProductsDamagedOutOfDate')}
      />
      <ListPieChartValueByProductCategory
        api="api/report/master/value-product-category"
        count={count}
        dateRange={stateDateRange}
        title={t('dashBoardMaster.inventoryValueByProductCategory')}
      />
      <ListPieChartEmployees
        api="api/report/master/top-employees"
        count={count}
        dateRange={stateDateRange}
        title={t('dashBoardMaster.top_5SellingEmployees')}
      />
    </Box>
  )
}

export default DashboardMasterAccount

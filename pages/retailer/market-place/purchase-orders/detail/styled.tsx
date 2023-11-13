import { TableRow, Typography, Box } from '@mui/material'
import { styled } from '@mui/system'

export const TypographyH2 = styled(Typography)(({ theme }) => ({
  fontSize: '2rem',
  fontWeight: '600',
  color: theme.palette.mode === 'dark' ? '#ddd' : '#49516F',
}))
export const TypographyH3 = styled(Typography)(({ theme }) => ({
  fontSize: '1.4rem',
  fontWeight: '600',
  marginTop: '15px',
  marginBottom: '10px',
  color: theme.palette.mode === 'dark' ? '#ddd' : '#49516F',
}))
export const TypographyCustom = styled(Typography)(({ theme }) => ({
  fontSize: '1.6rem',
  fontWeight: '400',
  color: theme.palette.mode === 'dark' ? '#ddd' : '#1B1F27',
}))
export const TypographyInformationCustom = styled(Typography)(({ theme }) => ({
  fontSize: '1.6rem',
  fontWeight: '600',
  color: theme.palette.mode === 'dark' ? '#ddd' : '#49516F',
  textTransform: 'capitalize',
}))
export const TypographyTableHeadCustom = styled(Typography)(() => ({
  fontSize: '1.4rem',
  fontWeight: '400',
  color: '#BABABA',
}))
export const TypographyTotalCustom = styled(Typography)(({ theme }) => ({
  fontSize: '1.8rem',
  fontWeight: '600',
  color: theme.palette.primary.main,
}))

export const BoxCustom = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#121212' : '#F8F9FC',
  border: theme.palette.mode === 'dark' ? '1px solid #E1E6EF' : 'none',
}))

export const TableRowCustom = styled(TableRow)(() => ({
  '& .MuiTableCell-root': {
    borderBottom: '0px',
  },
}))

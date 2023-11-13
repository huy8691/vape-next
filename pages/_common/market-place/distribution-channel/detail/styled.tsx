import { Grid, Typography } from '@mui/material'
import { styled } from '@mui/system'

export const TypographyHeadTable = styled(Typography)(({ theme }) => ({
  fontSize: '2rem',
  fontWeight: '600',
  lineHeight: '28px',
  color: theme.palette.mode === 'dark' ? '#ddd' : '#49516F',
}))

export const TypographyCustom1 = styled(Typography)(({ theme }) => ({
  fontSize: '1.4rem',
  lineHeight: '28px',
  color: theme.palette.mode === 'dark' ? '#ddd' : '#49516F',
}))

export const TypographyCustom2 = styled(Typography)(({ theme }) => ({
  fontSize: '1.4rem',
  lineHeight: '28px',
  color: theme.palette.mode === 'dark' ? '#ddd' : '##1B1F27',
}))

export const GridCustom1 = styled(Grid)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#212125' : '#F1F3F9',
}))

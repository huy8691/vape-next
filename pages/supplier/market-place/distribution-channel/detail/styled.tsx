import { Typography } from '@mui/material'
import { styled } from '@mui/system'

export const TypographyHead = styled(Typography)(({ theme }) => ({
  fontSize: '2rem',
  fontWeight: '600',
  lineHeight: '28px',
  textTransform: 'capitalize',
  color: theme.palette.mode === 'dark' ? '#ddd' : '#49516F',
}))

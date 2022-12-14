import { Box, Button, TableCell, TableRow, Typography } from '@mui/material'
import { styled } from '@mui/system'

export const TypographyH2 = styled(Typography)(({ theme }) => ({
  fontSize: '2rem',
  fontWeight: 'bold',
  color: theme.palette.mode === 'dark' ? '#ddd' : '#49516F',
}))
export const TypographyCustom = styled(Typography)(() => ({
  color: '#BABABA',
  fontWeight: '400',
  fontSize: '1.4rem',
}))

export const BoxModalCustom = styled(Box)(({ theme }) => ({
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '400px',
  border: '1px solid #000',
  padding: '20px',
  display: 'flex',
  borderRadius: '8px',
  flexDirection: 'column',
  justifyContent: 'center',
  backgroundColor: theme.palette.mode === 'light' ? 'white' : '#0f0f0f',
}))

export const TableCellHeadingTextCustom = styled(TableCell)(({ theme }) => ({
  fontSize: '1.4rem',
  fontWeight: 400,
  color: theme.palette.mode === 'dark' ? '#ddd' : '#49516F',
  align: 'center',
}))

export const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:nth-of-type(odd)': {
    backgroundColor: theme.palette.action.hover,
  },
  // hide last border
  // '&:last-child td, &:last-child th': {
  //   border: 0,
  // },
}))

export const ButtonIconSetting = styled(Button)(({ theme }) => ({
  backgroundColor: 'transparent',
  color: theme.palette.mode === 'dark' ? '#ddd' : '#49516F',
  '&:hover': {
    backgroundColor: 'transparent',
    color: '#1DB46A',
  },
}))

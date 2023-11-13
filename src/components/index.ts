import ActiveLink from './activeLink'
import ComponentFileUploader from './FileUploader'
import ItemProduct from './itemProduct'
import InfiniteScrollSelect from './InfiniteScrollSelect'
import InfiniteScrollSelectMultiple from './InfiniteScrollSelectMultiple'
import ReadMore from './readMore'
import UploadImage from './uploadImage'
import UploadList from './uploadList'
import CurrencyNumberFormat from './CurrencyNumberFormat'
import { styled } from '@mui/material/styles'

import {
  Button,
  TextField,
  Select,
  InputLabel,
  MenuItem,
  FormControl,
  Typography,
  TableCell,
  Menu,
  TableRow,
  DialogTitle,
  TableContainer,
  DialogActions,
  DialogContentText,
  DialogContent,
  Box,
  Tabs,
  Tab,
} from '@mui/material'

// import { useMediaQuery } from '@material-ui/core'
// import { useTheme, ThemeProvider, createTheme } from '@mui/material/styles'

const ButtonCustom = styled<any>(Button)({
  boxShadow: 'none',
  borderRadius: '10px',
  textTransform: 'none',
  fontWeight: '600',
  padding: '7.75px 25px',
  '&.MuiButton-contained': {
    color: '#ffffff',
    // backgroundColor: '#1DB46A',
  },
  '&.MuiButton-containedPrimary': {
    // backgroundColor: '#1DB46A',
  },
  '&.MuiButton-sizeLarge': {
    fontSize: '1.6rem',
    padding: '11px 54px',
    whitespace: 'nowrap',
  },
})

// const LoadingButtonCustom = styled(LoadingButton)({
//   backgroundColor: 'linear-gradient(93.37deg, #1CB35B 0%, #20B598 116.99%)',
//   boxShadow: '0px 3px 44px rgba(71, 255, 123, 0.27)',
//   borderRadius: '12px',
//   textTransform: 'none',
//   '&.MuiButton-contained': {
//     color: '#ffffff',
//   },
//   '&.MuiButton-sizeLarge': {
//     padding: '7px 25px',
//   },
// })

const TextFieldCustom = styled(TextField)({
  '& .MuiOutlinedInput-root': {
    borderRadius: '8px',
    fontSize: '1.4rem',
    overflow: 'hidden',
    borderColor: '#E1E6EF',
  },
  '& .MuiOutlinedInput-notchedOutline': {
    borderWidth: '1px !important',
    borderColor: '#E1E6EF',
  },
  '& .MuiInputBase-multiline': {
    padding: '0px',
  },
  '& .MuiInputBase-input': {
    padding: '10px 15px',
  },
})
const TextFieldPasswordCustom = styled(FormControl)({
  '& .MuiOutlinedInput-root': {
    borderRadius: '8px',
    fontSize: '1.4rem',
    paddingRight: '5px',
    borderColor: '#E1E6EF',
  },
  '& .MuiInputBase-input': {
    padding: '10px 15px',
  },
  '& .MuiOutlinedInput-notchedOutline': {
    borderWidth: '1px !important',
    borderColor: '#E1E6EF',
  },
})

const SelectCustom = styled(Select)({
  '& .MuiOutlinedInput-notchedOutline': {
    borderRadius: '8px',
    fontSize: '1.4rem',
    borderWidth: '1px !important',
    borderColor: '#E1E6EF',
  },
  '& .MuiOutlinedInput-input': {
    padding: '10px 15px',
    fontSize: '1.4rem',
    '&[aria-expanded="true"]': {
      '& ~ .MuiSvgIcon-root': {
        transform: 'rotate(180deg)',
        width: '1.5em',
      },
    },
  },
  '& .MuiSvgIcon-root': {
    width: '1.5em',
  },
})
const SelectCustomMulti = styled(Select)({
  '& .MuiOutlinedInput-notchedOutline': {
    borderRadius: '8px',
    fontSize: '1.4rem',
    borderWidth: '1px !important',
    borderColor: '#E1E6EF',
  },
  '& .MuiOutlinedInput-input': {
    display: 'flex',
    padding: '10px 15px',
    fontSize: '1.4rem',
    '&[aria-expanded="true"]': {
      '& ~ .MuiSvgIcon-root': {
        transform: 'rotate(180deg)',
        width: '1.5em',
      },
    },
  },
  '& .MuiSvgIcon-root': {
    width: '1.5em',
  },
})

const PlaceholderSelect = styled('div')(({ theme }) => ({
  color:
    theme.palette.mode === 'light'
      ? 'rgba(73, 81, 111, 0.7)'
      : 'rgba(255, 255, 255, 0.4)',
}))

const InputLabelCustom = styled(InputLabel)(({ theme }) => ({
  marginBottom: '5px',
  fontSize: '1.4rem',
  color: theme.palette.mode === 'light' ? '#1B1F27' : 'rgba(255,255,255,0.6)',
}))
const MenuItemSelectCustom = styled(MenuItem)({
  fontSize: '1.4rem',
})

const TextFieldSearchCustom = styled(TextFieldCustom)(({ theme }) => ({
  '& .MuiInputBase-input': {
    padding: '11px 45px 11px 15px',
    textOverflow: 'ellipsis',
    lineHeight: '28px',
    height: 'auto',
    backgroundColor:
      theme.palette.mode === 'light' ? '#ffffff' : theme.palette.action.hover,
  },
}))

const TypographyTitlePage = styled(Typography)(() => ({
  fontSize: '2.4rem',
  fontWeight: '600',
  color: '#49516F',
}))
const TypographySectionTitle = styled(Typography)(() => ({
  fontSize: '1.4rem',
  fontWeight: '600',
  marginBottom: '10px',
  color: '#49516F',
}))

const SelectPaginationCustom = styled(SelectCustom)(() => ({
  '& .MuiOutlinedInput-input': {
    padding: '6px 10px',
  },
}))

const ButtonCancel = styled(ButtonCustom)(() => ({
  border: ' 1px solid #E1E6EF',
  '&.MuiButton-outlined': {
    color: '#49516F',
  },
  '&:hover, &:focus': {
    boxShadow: 'none',
    border: ' 1px solid #E1E6EF',
    backgroundColor: '#ebebeb',
  },
}))

const TypographyH2 = styled(Typography)(({ theme }) => ({
  fontSize: '2rem',
  fontWeight: 'bold',
  color: theme.palette.mode === 'dark' ? '#ddd' : '#49516F',
}))

const MenuAction = styled(Menu)(() => ({
  '& .MuiPaper-root': {
    boxShadow: '0px 0px 4px 0px  rgba(0, 0, 0, 0.20)',
    borderRadius: '5px',
  },
}))

// table
const TableContainerTws = styled(TableContainer)(({ theme }) => ({
  border: '1px solid #E1E6EF',
  borderBottom: 'none',
  marginBottom: '15px',
  marginTop: '35px',
  borderRadius: '5px',
  '& .MuiTableCell-head': {
    color: theme.palette.mode === 'dark' ? '#ddd' : '#49516F',
    opacity: 0.7,
    fontWeight: '400',
  },
  '& .MuiTableCell-body': {
    color: theme.palette.mode === 'dark' ? '#ddd' : '#49516F',
    fontWeight: '500',
  },
}))
const TableCellTws = styled(TableCell)(() => ({
  fontSize: '1.4rem',
}))

const TableRowTws = styled(TableRow)(() => ({
  '&:nth-of-type(odd)': {
    backgroundColor: '#F8F9FC',
  },
}))

const DialogTitleTws = styled(DialogTitle)(() => ({
  display: 'flex',
  justifyContent: 'end',
  padding: '5px',
}))
const DialogContentTws = styled(DialogContent)(() => ({
  padding: '27px 50px',
}))

const DialogActionsTws = styled(DialogActions)(() => ({
  justifyContent: 'center',
  padding: '0 50px 50px',
}))

const DialogContentTextTws = styled(DialogContentText)(({ theme }) => ({
  width: '362px',
  fontSize: '14px',
  fontWeight: '500',
  lineHeight: '22px',
  textAlign: 'center',
  color: theme.palette.mode === 'dark' ? '#ddd' : '#49516F',
}))
const BoxCustom = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#121212' : '#F8F9FC',
  border: theme.palette.mode === 'dark' ? '1px solid #E1E6EF' : 'none',
  padding: '15px',
  borderRadius: '5px',
}))

const TabsTws = styled(Tabs)(({ theme }) => ({
  marginBottom: theme.spacing(1),
  '& .Mui-selected': {
    textTransform: 'capitalize',
    fontWeight: '700',
    fontSize: '1.6rem',
  },
  '& .MuiTabs-indicator': {
    display: 'flex',
    justifyContent: 'center',
    backgroundColor: 'transparent',
  },
  '& .MuiTabs-indicatorSpan': {
    maxWidth: 24,
    width: '100%',
    backgroundColor: theme.palette.primary.main,
  },
}))
const TabCustom = styled(Tab)(() => ({
  fontSize: '1.4rem',
  fontWeight: '400',
  textTransform: 'capitalize',
}))

const BoxIconCustom = styled(Box)(() => ({
  borderRadius: '50%',
  background: 'white',
  padding: '4px',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
}))

export {
  ActiveLink,
  ButtonCustom,
  TextFieldCustom,
  SelectCustom,
  SelectCustomMulti,
  PlaceholderSelect,
  InputLabelCustom,
  MenuItemSelectCustom,
  ComponentFileUploader,
  TextFieldPasswordCustom,
  ItemProduct,
  TextFieldSearchCustom,
  TypographyTitlePage,
  SelectPaginationCustom,
  ButtonCancel,
  TypographyH2,
  MenuAction,
  TableContainerTws,
  TableCellTws,
  TableRowTws,
  DialogTitleTws,
  DialogContentTws,
  DialogActionsTws,
  DialogContentTextTws,
  TypographySectionTitle,
  InfiniteScrollSelect,
  InfiniteScrollSelectMultiple,
  BoxCustom,
  TabsTws,
  TabCustom,
  ReadMore,
  BoxIconCustom,
  UploadImage,
  UploadList,
  CurrencyNumberFormat,
}

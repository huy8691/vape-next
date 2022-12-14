import ActiveLink from './activeLink'
import ComponentFileUploader from './FileUploader'
import ItemProduct from './itemProduct'
import { styled } from '@mui/material/styles'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import Select from '@mui/material/Select'
import InputLabel from '@mui/material/InputLabel'
import MenuItem from '@mui/material/MenuItem'
import FormControl from '@mui/material/FormControl'
import Typography from '@mui/material/Typography'
// import LoadingButton from '@mui/lab/LoadingButton'

// import { useTheme, ThemeProvider, createTheme } from '@mui/material/styles'

const ButtonCustom = styled(Button)({
  backgroundColor: 'linear-gradient(93.37deg, #1CB35B 0%, #20B598 116.99%)',
  boxShadow: '0px 3px 44px rgba(71, 255, 123, 0.27)',
  borderRadius: '12px',
  textTransform: 'none',
  '&.MuiButton-contained': {
    color: '#ffffff',
  },
  '&.MuiButton-sizeLarge': {
    padding: '7px 25px',
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
  },
  '& .MuiOutlinedInput-notchedOutline': {
    borderWidth: '1px !important',
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
  },
  '& .MuiInputBase-input': {
    padding: '10px 15px',
  },
  '& .MuiOutlinedInput-notchedOutline': {
    borderWidth: '1px !important',
  },
})

const SelectCustom = styled(Select)({
  '& .MuiOutlinedInput-notchedOutline': {
    borderRadius: '8px',
    fontSize: '1.4rem',
    borderWidth: '1px !important',
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
    padding: '8px 45px 8px 15px',
    textOverflow: 'ellipsis',
    backgroundColor:
      theme.palette.mode === 'light' ? '#ffffff' : theme.palette.action.hover,
  },
}))

const TypographyTitlePage = styled(Typography)(() => ({
  fontSize: '2rem',
  fontWeight: '500',
}))

const SelectPaginationCustom = styled(SelectCustom)(() => ({
  '& .MuiOutlinedInput-input': {
    padding: '7px 10px',
  },
}))

export {
  ActiveLink,
  ButtonCustom,
  TextFieldCustom,
  SelectCustom,
  PlaceholderSelect,
  InputLabelCustom,
  MenuItemSelectCustom,
  ComponentFileUploader,
  TextFieldPasswordCustom,
  ItemProduct,
  TextFieldSearchCustom,
  TypographyTitlePage,
  SelectPaginationCustom,
}

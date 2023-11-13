import Typography from '@mui/material/Typography'
import { VariantType, useSnackbar } from 'notistack'
import Divider from '@mui/material/Divider'

export const useEnqueueSnackbar = () => {
  const { enqueueSnackbar, closeSnackbar } = useSnackbar()
  const pushMessage = (
    message: string | string[] | any,
    variant: VariantType
  ) => {
    console.log(typeof message)
    if (typeof message === 'string') {
      return enqueueSnackbar(message, {
        variant,
        autoHideDuration: 3000,
        action: (key) => (
          <>
            <Divider
              orientation="vertical"
              variant="middle"
              flexItem
              sx={{
                // height: '1.4rem',
                marginTop: '3px !important',
                marginBottom: '3px !important',
                borderColor: '#fbfff7',
                border: '1px line #fbfff7',
                marginRight: '15px',
              }}
            />
            <Typography
              onClick={() => closeSnackbar(key)}
              style={{ cursor: 'pointer' }}
            >
              Close
            </Typography>
          </>
        ),
      })
    } else {
      message?.map((item: string) => {
        return enqueueSnackbar(item, {
          variant,
          action: (key) => (
            <>
              <Typography
                onClick={() => closeSnackbar(key)}
                style={{ cursor: 'pointer' }}
              >
                Close
              </Typography>
            </>
          ),
        })
      })
    }
  }

  return [pushMessage]
}

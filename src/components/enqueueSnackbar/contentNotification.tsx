import CloseIcon from '@mui/icons-material/Close'
import Card from '@mui/material/Card'
import CardActions from '@mui/material/CardActions'
import IconButton from '@mui/material/IconButton'
import Paper from '@mui/material/Paper'
import Typography from '@mui/material/Typography'
import {
  SnackbarContent,
  SnackbarKey,
  SnackbarMessage,
  useSnackbar,
} from 'notistack'
import { forwardRef, useCallback } from 'react'
import { PayloadNotification } from 'src/layout/requireAuth'
import classes from './contentNotification.module.scss'
import { useRouter } from 'next/router'
import { platform } from 'src/utils/global.utils'

const ContentNotification = forwardRef<
  HTMLDivElement,
  {
    id: SnackbarKey
    payload: PayloadNotification
    message: SnackbarMessage
  }
>(({ id, payload, message }, ref) => {
  const router = useRouter()
  const { closeSnackbar } = useSnackbar()

  const handleDismiss = useCallback(() => {
    closeSnackbar(id)
  }, [id, closeSnackbar])

  const handleClick = () => {
    if (payload.data?.action !== 'order') return
    router.push(
      platform() === 'RETAILER'
        ? `/retailer/market-place/order/detail/${payload.data.value}`
        : `/supplier/market-place/order/detail/${payload.data.value}`
    )
  }

  return (
    <SnackbarContent ref={ref} className={classes.root}>
      <Card className={classes.card}>
        <CardActions classes={{ root: classes.actionRoot }}>
          <Typography variant="body2" className={classes.typography}>
            {message}
          </Typography>
          <div className={classes.icons}>
            <IconButton
              size="small"
              onClick={handleDismiss}
              className={classes.expand}
            >
              <CloseIcon fontSize="small" />
            </IconButton>
          </div>
        </CardActions>
        <Paper
          sx={{
            padding: '0 10px 10px 10px',
            cursor: 'pointer',
          }}
          role="button"
          onClick={handleClick}
        >
          <Typography
            sx={{
              fontSize: '1.4rem',
              color: 'rgb(89, 89, 89)',
              fontWeight: 400,
            }}
          >
            {payload.notification?.body}
          </Typography>
        </Paper>
      </Card>
    </SnackbarContent>
  )
})

ContentNotification.displayName = 'ContentNotification'

export default ContentNotification

import {
  Box,
  Card,
  CardContent,
  Drawer,
  FormControl,
  Stack,
  Switch,
  Typography,
  styled,
} from '@mui/material'
import { Controller, useForm } from 'react-hook-form'
import React, { useEffect, useState } from 'react'
import { NotificationTypeItem } from '../modelNotificationConfig'
import { ButtonCustom } from 'src/components'
import PreviewOrderDelivered from './previewNotification/previewOrderDelivered'
import PreviewOrderBeing from './previewNotification/previewOrderBeing'
import PreviewOrderCancellation from './previewNotification/previewOrderCancellation'
import PreviewOrderConfirmed from './previewNotification/previewOrderConfirmed'
import {
  doConfigNotification,
  getDetailNotificationConfiguration,
} from '../apiNotificationConfig'
import { useEnqueueSnackbar } from 'src/components/enqueueSnackbar'
import { handlerGetErrMessage } from 'src/utils/global.utils'
import PreviewEmailOrderConfirmed from './previewEmail/previewEmailOrderConfirmed'
import PreviewEmailOrderCancellation from './previewEmail/previewEmailOrderCancellation'
import PreviewEmailOrderBeing from './previewEmail/previewEmailOrderBeing'
import PreviewEmailOrderDelivered from './previewEmail/previewEmailOrderDelivered'

const CardCustom = styled(Card)(({ theme }) => ({
  backgroundColor:
    theme.palette.mode === 'light' ? '#fff' : theme.palette.action.hover,
  boxShadow: 'none',
  borderRadius: '10px',
  height: '100%',
  border: '1px solid #E1E6EF',
}))

const SwitchStyles = styled(Switch)(({ theme }) => ({
  width: 98,
  height: 31,
  borderRadius: '24px',
  padding: 0,
  '& .MuiSwitch-switchBase': {
    padding: 0,
    margin: 2,
    transitionDuration: '300ms',
    '&.Mui-checked': {
      transform: 'translateX(65px)',
      color: '#fff',

      '& + .MuiSwitch-track': {
        backgroundColor: theme.palette.mode === 'dark' ? '#E1E6EF' : '#1DB46A',
        opacity: 1,
        border: 0,
        '&:before': {
          opacity: 1,
        },
        '&:after': {
          opacity: 0,
        },
      },
      '&.Mui-disabled + .MuiSwitch-track': {
        opacity: 0.5,
      },
    },
  },
  '& .MuiSwitch-thumb': {
    boxSizing: 'border-box',
    width: 25,
    height: 25,
    transform: 'translate(2px ,1px)',
  },
  '& .MuiSwitch-track': {
    borderRadius: 26 / 2,
    backgroundColor: theme.palette.mode === 'light' ? '#E1E6EF' : '#1DB46A',
    opacity: 1,
    transition: theme.transitions.create(['background-color'], {
      duration: 500,
    }),
    '&:before, &:after': {
      display: 'inline-block',
      position: 'absolute',
      top: '50%',
      width: '50%',
      transform: 'translateY(-50%)',
      color: '#fff',
      textAlign: 'center',
    },
    '&:before': {
      content: '"Enabled"',
      left: 10,
      opacity: 0,
      fontWeight: 400,
      fontSize: '1.2rem',
    },
    '&:after': {
      content: '"Disabled"',
      right: 20,
      fontWeight: 400,
      fontSize: '1.2rem',
    },
  },
}))

const ConfigurationNotification: React.FC<{
  open: boolean
  onClose: React.Dispatch<React.SetStateAction<boolean>>
  item: NotificationTypeItem | undefined
  setFlagRefresh: React.Dispatch<React.SetStateAction<string>>
}> = (props) => {
  const [contentNote, setContentNote] = useState<string>()
  const [pushMessage] = useEnqueueSnackbar()
  const [previewNotification, setPreviewNotification] = useState(false)
  const [previewEmail, setPreviewEmail] = useState(false)
  const { handleSubmit, control, setValue, reset } = useForm({
    mode: 'all',
    defaultValues: {
      enable: false,
      over_email: false,
      over_notifications: false,
      email_content: null,
    },
  })

  useEffect(() => {
    if (!props.open) {
      setPreviewNotification(false)
      setContentNote('')
      setPreviewEmail(false)
      reset()
    }
  }, [props.open, reset])

  useEffect(() => {
    if (!props.item?.id) return
    getDetailNotificationConfiguration(props.item?.id).then((res) => {
      const { data } = res.data
      setContentNote(data?.configurations?.email_content)
      setValue('enable', data?.configurations?.enable as boolean)
      setValue('over_email', data?.configurations?.over_email as boolean)
      setValue(
        'over_notifications',
        data?.configurations?.over_notifications as boolean
      )
    })
  }, [props.item?.id, setValue])

  const onSubmit = (values: any) => {
    doConfigNotification(props.item?.id as number, {
      enable: values.enable,
      over_email: values.over_email,
      over_notifications: values.over_notifications,
      email_content: contentNote,
    })
      .then(() => {
        pushMessage('Configure Notification Successfully', 'success')
        props.setFlagRefresh('' + new Date().getTime())
      })
      .catch((error) => {
        const { status, data } = error.response
        pushMessage(handlerGetErrMessage(status, data), 'error')
      })
  }
  return (
    <Drawer
      anchor={'right'}
      open={props.open}
      onClose={() => props.onClose(false)}
    >
      <Stack
        direction="row"
        sx={{
          height: '100vh',
        }}
      >
        {/* Notification */}
        {previewNotification && props.item?.id === 1 && (
          <PreviewOrderConfirmed />
        )}
        {previewNotification && props.item?.id === 2 && (
          <PreviewOrderCancellation />
        )}
        {previewNotification && props.item?.id === 3 && <PreviewOrderBeing />}
        {previewNotification && props.item?.id === 4 && (
          <PreviewOrderDelivered />
        )}

        {/* Email */}
        {previewEmail && props.item?.id === 1 && (
          <PreviewEmailOrderConfirmed
            contentEmail={contentNote}
            onClose={setPreviewEmail}
            id={props.item.id}
          />
        )}
        {previewEmail && props.item?.id === 2 && (
          <PreviewEmailOrderCancellation
            contentEmail={contentNote}
            onClose={setPreviewEmail}
            id={props.item.id}
          />
        )}
        {previewEmail && props.item?.id === 3 && (
          <PreviewEmailOrderBeing
            contentEmail={contentNote}
            onClose={setPreviewEmail}
            id={props.item.id}
          />
        )}
        {previewEmail && props.item?.id === 4 && (
          <PreviewEmailOrderDelivered
            contentEmail={contentNote}
            onClose={setPreviewEmail}
            id={props.item.id}
          />
        )}
        <Box
          sx={{
            background: 'white',
            width: '480px',
          }}
          p={2}
        >
          <Typography
            sx={{
              fontSize: '2.4rem',
              marginBottom: '20px',
              color: '#1B1F27',
              fontWeight: 500,
            }}
          >
            {props.item?.name}
          </Typography>
          <Box
            sx={{
              marginTop: '15px',
              background: '#F8FAFB',
              padding: '15px 10px',
            }}
          >
            <Typography
              sx={{
                fontSize: '1.6rem',
                marginBottom: '10px',
                color: '#9098B1',
                fontWeight: 400,
              }}
            >
              {props.item?.description}
            </Typography>
            <Typography
              sx={{
                fontSize: '1.6rem',
                marginBottom: '10px',
                color: '#252626',
                fontWeight: 400,
              }}
            >
              Reminder Timeframe
            </Typography>
            <Typography
              sx={{
                fontSize: '1.6rem',
                color: '#9098B1',
                fontWeight: 400,
              }}
            >
              Instantly
            </Typography>
          </Box>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Box
              sx={{
                marginTop: '15px',
                background: '#F8FAFB',
                padding: '15px',
              }}
            >
              <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="center"
              >
                <Controller
                  control={control}
                  name="enable"
                  render={({ field }) => (
                    <>
                      <Typography
                        sx={{
                          fontSize: '1.6rem',
                          color: '#252626',
                          fontWeight: 400,
                        }}
                      >
                        Notification Status
                      </Typography>
                      <FormControl>
                        <SwitchStyles
                          {...field}
                          name="enable"
                          checked={field.value}
                        />
                      </FormControl>
                    </>
                  )}
                />
              </Stack>
            </Box>
            <Box
              sx={{
                marginTop: '15px',
                background: '#F8FAFB',
                padding: '10px',
              }}
            >
              <Typography
                sx={{
                  fontSize: '1.6rem',
                  color: '#252626',
                  fontWeight: 500,
                  marginBottom: '10px',
                }}
              >
                Sending Method
              </Typography>
              <CardCustom variant="outlined">
                <CardContent style={{ padding: '15px 10px', height: '100%' }}>
                  <Stack
                    direction="row"
                    justifyContent="space-between"
                    alignItems="center"
                  >
                    <Controller
                      control={control}
                      name="over_email"
                      render={({ field }) => (
                        <>
                          <Typography
                            sx={{
                              fontSize: '1.6rem',
                              color: '#252626',
                              fontWeight: 400,
                            }}
                          >
                            Email
                          </Typography>
                          <FormControl>
                            <SwitchStyles
                              {...field}
                              name="over_email"
                              checked={field.value}
                            />
                          </FormControl>
                        </>
                      )}
                    />
                  </Stack>
                  <Typography
                    sx={{
                      fontSize: '1.6rem',
                      margin: '15px 0px',
                      color: '#6B7A99',
                      fontWeight: 400,
                    }}
                  >
                    Automate the delivery of this email message, allowing for
                    customization of the note for clients.
                  </Typography>
                  <ButtonCustom
                    variant="outlined"
                    size="small"
                    onClick={() => setPreviewEmail((prev) => !prev)}
                  >
                    Preview
                  </ButtonCustom>
                </CardContent>
              </CardCustom>

              <CardCustom
                variant="outlined"
                style={{
                  marginTop: '10px',
                }}
              >
                <CardContent style={{ padding: '15px 10px', height: '100%' }}>
                  <Stack
                    direction="row"
                    justifyContent="space-between"
                    alignItems="center"
                  >
                    <Controller
                      control={control}
                      name="over_notifications"
                      render={({ field }) => (
                        <>
                          <Typography
                            sx={{
                              fontSize: '1.6rem',
                              color: '#252626',
                              fontWeight: 400,
                            }}
                          >
                            Notification
                          </Typography>
                          <FormControl>
                            <SwitchStyles
                              {...field}
                              name="over_notifications"
                              checked={field.value}
                            />
                          </FormControl>
                        </>
                      )}
                    />
                  </Stack>
                  <Typography
                    sx={{
                      fontSize: '1.6rem',
                      margin: '15px 0px',
                      color: '#6B7A99',
                      fontWeight: 400,
                    }}
                  >
                    Automate the delivery of this message via app notification.
                  </Typography>
                  <ButtonCustom
                    variant="outlined"
                    size="small"
                    onClick={() => setPreviewNotification((prev) => !prev)}
                  >
                    Preview
                  </ButtonCustom>
                </CardContent>
              </CardCustom>
            </Box>
            <Stack direction="column" p={2} gap={2}>
              <ButtonCustom
                size="large"
                sx={{ padding: '11px 30px !important' }}
                variant="contained"
                type="submit"
              >
                Save
              </ButtonCustom>
              <ButtonCustom
                variant="outlined"
                size="large"
                onClick={() => props.onClose(false)}
                sx={{ padding: '11px 30px !important' }}
              >
                Cancel
              </ButtonCustom>
            </Stack>
          </form>
        </Box>
      </Stack>
    </Drawer>
  )
}

export default ConfigurationNotification

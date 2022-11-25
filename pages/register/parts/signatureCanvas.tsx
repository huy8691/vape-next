import React, { forwardRef, useRef, useImperativeHandle } from 'react'
import IconButton from '@mui/material/IconButton'
import Box from '@mui/material/Box'
import ReplayIcon from '@mui/icons-material/Replay'
import SignaturePad from 'react-signature-canvas'
import classes from '../styles.module.scss'
import { InputLabelCustom } from 'src/components'

// api
import { useAppDispatch } from 'src/store/hooks'
// import { registerActions } from './registerSlice'
import {
  getUrlUploadFileApi,
  uploadFileApi,
} from 'src/components/FileUploader/uploadAPI'
import { loadingActions } from 'src/store/loading/loadingSlice'
import { notificationActions } from 'src/store/notification/notificationSlice'
// api

type Props = {
  uploadSignatureSuccess: (value: any) => void
  uploadSignatureError: () => void
}

const SignatureCanvas = forwardRef(
  ({ uploadSignatureSuccess, uploadSignatureError }: Props, ref) => {
    useImperativeHandle(ref, () => ({
      handleSignature(valueSignUp: any) {
        if (sigCanvas.current.isEmpty()) {
          setStateIsSigCanvas(true)
          setTimeout(function () {
            setStateIsSigCanvas(false)
          }, 3000)
        } else {
          setStateIsSigCanvas(false)
          let base64ImageContent = sigCanvas.current
            .getTrimmedCanvas()
            .toDataURL('image/png')
            .replace(/^data:image\/(png|jpg);base64,/, '')
          let blob = base64ToBlob(base64ImageContent, 'image/png')
          dispatch(loadingActions.doLoading())
          getUrlUploadFileApi({
            files: [
              {
                name: 'sigCanvas.png',
              },
            ],
          })
            .then((response) => {
              const { data } = response.data
              dispatch(loadingActions.doLoadingSuccess())
              dispatch(loadingActions.doLoading())
              let formData = new FormData()
              formData.append('key', data.fields.key)
              formData.append('x-amz-algorithm', data.fields[`x-amz-algorithm`])
              formData.append(
                'x-amz-credential',
                data.fields[`x-amz-credential`]
              )
              formData.append('x-amz-date', data.fields[`x-amz-date`])
              formData.append('policy', data.fields[`policy`])
              formData.append('x-amz-signature', data.fields[`x-amz-signature`])
              formData.append('file', blob)
              uploadFileApi({
                url: data.url,
                formData: formData,
              })
                .then(() => {
                  dispatch(loadingActions.doLoadingSuccess())
                  dispatch(
                    notificationActions.doNotification({
                      message: 'Upload signature success',
                    })
                  )
                  uploadSignatureSuccess({
                    ...valueSignUp,
                    signature: data.newUrl,
                  })
                })
                .catch(() => {
                  dispatch(loadingActions.doLoadingFailure())
                  dispatch(
                    notificationActions.doNotification({
                      message: 'Upload signature error',
                      type: 'error',
                    })
                  )
                  uploadSignatureError()
                })
            })
            .catch(() => {
              dispatch(loadingActions.doLoadingFailure())
              dispatch(
                notificationActions.doNotification({
                  message: 'Get url error',
                  type: 'error',
                })
              )
            })
        }
      },
    }))

    const dispatch = useAppDispatch()
    const sigCanvas = useRef<any>(null)
    const [stateIsSigCanvas, setStateIsSigCanvas] =
      React.useState<boolean>(false)

    const base64ToBlob = (base64: string, mime: string) => {
      mime = mime || ''
      var sliceSize = 1024
      var byteChars = window.atob(base64)
      var byteArrays = []

      for (
        var offset = 0, len = byteChars.length;
        offset < len;
        offset += sliceSize
      ) {
        var slice = byteChars.slice(offset, offset + sliceSize)

        var byteNumbers = new Array(slice.length)
        for (var i = 0; i < slice.length; i++) {
          byteNumbers[i] = slice.charCodeAt(i)
        }

        var byteArray = new Uint8Array(byteNumbers)

        byteArrays.push(byteArray)
      }

      return new Blob(byteArrays, { type: mime })
    }

    const handleClearSignature = () => {
      sigCanvas.current.clear()
    }

    return (
      <>
        <Box>
          <InputLabelCustom>Draw your Signature:</InputLabelCustom>
          <Box className={classes['block-signature']}>
            <IconButton
              aria-label="Clear"
              onClick={handleClearSignature}
              className={classes['block-signature__button-clear']}
            >
              <ReplayIcon />
            </IconButton>
          </Box>
          <SignaturePad
            ref={sigCanvas}
            canvasProps={{
              className: `${classes.signatureCanvas} ${
                stateIsSigCanvas ? `${classes.error}` : ''
              }`,
            }}
          />
        </Box>
      </>
    )
  }
)
SignatureCanvas.displayName = 'SignatureCanvas'
export default SignatureCanvas

import React from 'react'
import { TextFieldCustom } from '../../components'
import { styled } from '@mui/material/styles'
import Chip from '@mui/material/Chip'
import Button from '@mui/material/Button'
import ButtonGroup from '@mui/material/ButtonGroup'
import { UploadSimple, XCircle } from 'phosphor-react'

// api
import { useAppDispatch } from 'src/store/hooks'
import { getUrlUploadFileApi, uploadFileApi } from './uploadAPI'
import { loadingActions } from 'src/store/loading/loadingSlice'
import { notificationActions } from 'src/store/notification/notificationSlice'
// api

type Props = {
  onFileSelectSuccess: () => void
  onFileSelectError: () => void
  onFileSelectDelete: () => void
  errors: any
}

const ButtonGroupCustom = styled(ButtonGroup)({
  boxShadow: 'none',
  position: 'relative',
})

const ButtonCustom = styled(Button)({
  whiteSpace: 'nowrap',
  position: 'absolute',
  padding: '6.5px 15px',
  zIndex: '1',
  borderRadius: '7px 0 0 7px',
  background: '#F1F3F9',
  top: '1px',
  left: '2px',
  boxShadow: 'none',
  textTransform: 'none',
  fontWeight: '400',
})
const ChipCustom = styled(Chip)({
  position: 'absolute',
  right: '7px',
  top: '50%',
  transform: 'translateY(-50%)',
  zIndex: '1',
  maxWidth: 'calc(100% - 160px)',
  height: '26px',
  background: '#F1F3F9',
  borderRadius: '7px',
})

const DeleteIcon = styled('div')({
  width: '20px',
  display: 'flex',
  alignItems: 'center',
})

const ComponentFileUploader = ({
  onFileSelectSuccess,
  onFileSelectError,
  onFileSelectDelete,
  errors,
}: Props) => {
  const dispatch = useAppDispatch()
  const fileInputRef = React.useRef<HTMLInputElement>(null)
  const textFieldRef = React.useRef<HTMLInputElement>(null)

  const [stateFile, setStateFile] = React.useState(null)

  const handleFileInput = (e: any) => {
    // handle validations

    console.log('e', e)
    const fileInput = e.target.files[0]
    if (fileInput) {
      // const isJpgOrPng =
      //   fileInput.type === 'application/pdf' ||
      //   fileInput.type === 'application/msword'
      // if (!isJpgOrPng) {
      //   onFileSelectError()
      //   dispatch(
      //     notificationActions.doNotification({
      //       message: 'You can only upload .doc,.docx, .pdf file!',
      //       type: 'error',
      //     })
      //   )
      //   return
      // }
      if (fileInput.size) {
        const size = fileInput.size / 1024 / 1024 < 10
        if (!size) {
          onFileSelectError()
          dispatch(
            notificationActions.doNotification({
              message: 'File cannot be large than 10MB',
              type: 'error',
            })
          )
          return
        }
      }
      handleGetUrlUpload(fileInput)
    }
  }
  const handleGetUrlUpload = (fileInput: any) => {
    dispatch(loadingActions.doLoading())
    getUrlUploadFileApi({
      files: [
        {
          name: fileInput.name,
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
        formData.append('x-amz-credential', data.fields[`x-amz-credential`])
        formData.append('x-amz-date', data.fields[`x-amz-date`])
        formData.append('policy', data.fields[`policy`])
        formData.append('x-amz-signature', data.fields[`x-amz-signature`])
        formData.append('file', fileInput)
        uploadFileApi({
          url: data.url,
          formData: formData,
        })
          .then(() => {
            setStateFile(fileInput)
            onFileSelectSuccess(data.newUrl)
            dispatch(loadingActions.doLoadingSuccess())
            dispatch(
              notificationActions.doNotification({
                message: 'Upload success',
              })
            )
          })
          .catch(() => {
            dispatch(loadingActions.doLoadingFailure())
            dispatch(
              notificationActions.doNotification({
                message: 'Upload error',
                type: 'error',
              })
            )
          })
      })
      .catch(() => {
        // const data = error.response.data
        dispatch(loadingActions.doLoadingFailure())
        dispatch(
          notificationActions.doNotification({
            message: 'Get url error',
            type: 'error',
          })
        )
      })
  }
  const handleDelete = () => {
    fileInputRef.current.value = null
    setStateFile(null)
    onFileSelectDelete()
  }

  return (
    <>
      <ButtonGroupCustom>
        <ButtonCustom
          variant="contained"
          startIcon={<UploadSimple size={20} />}
          onClick={() => {
            fileInputRef.current && fileInputRef.current.click()
            textFieldRef.current && textFieldRef.current.focus()
          }}
        >
          Upload file...
        </ButtonCustom>
        <TextFieldCustom
          onClick={() => fileInputRef.current && fileInputRef.current.click()}
          inputProps={{ readOnly: true }}
          error={!!errors}
          fullWidth
          inputRef={textFieldRef}
        />
        {stateFile && (
          <ChipCustom
            label={stateFile.name}
            onDelete={handleDelete}
            deleteIcon={
              <DeleteIcon>
                <XCircle size={20} />
              </DeleteIcon>
            }
          />
        )}
      </ButtonGroupCustom>
      <input
        type="file"
        onChange={handleFileInput}
        // accept="image/*"
        accept=".doc,.docx,application/pdf"
        hidden
        ref={fileInputRef}
      />
    </>
  )
}

export default ComponentFileUploader

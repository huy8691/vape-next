import React, { useState } from 'react'
import Button from '@mui/material/Button'
import { styled } from '@mui/material/styles'
import classes from './styles.module.scss'
// import UploadList from './uploadList'
// import LoadingButton from '@mui/lab/LoadingButton'
import { getUrlUploadFileApi, uploadFileApi } from './uploadImageAPI'
import { XCircle } from 'phosphor-react'
import { useAppDispatch } from 'src/store/hooks'
import { loadingActions } from 'src/store/loading/loadingSlice'
import { notificationActions } from 'src/store/notification/notificationSlice'

const ButtonCustom = styled<any>(Button)({
  borderRadius: '10px',
  color: '#F8F9FC',
  textTransform: 'unset',
  fontWeight: '600',
})

const UploadImage: React.FC<{
  fileList?: string[]
  onFileSelectSuccess: (value: any) => void
  onFileSelectError: () => void
  onFileSelectDelete: () => void
}> = (props) => {
  const [image, setImage] = useState('')
  const dispatch = useAppDispatch()
  const getBase64 = (img: any, callback: (url: string) => void) => {
    const reader = new FileReader()
    reader.addEventListener('load', () => callback(reader.result as string))
    reader.readAsDataURL(img)
  }

  const beforeUpload = (file: any) => {
    const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png'
    const isLt2M = file.size / 1024 / 1024 < 5
    if (!isLt2M) {
      props.onFileSelectError()
      dispatch(
        notificationActions.doNotification({
          message: 'File cannot be large than 5MB',
          type: 'error',
        })
      )
      return
    }
    return isJpgOrPng && isLt2M
  }
  const handleUploadImage = async (event: any) => {
    const objImage = event.target.files[0]

    try {
      beforeUpload(objImage)
      getBase64(objImage, (url) => {
        setImage(url)
      })
      handleGetUrlUpload(objImage)
    } catch (error) {
      console.log('error', error)
    }
  }

  const handleGetUrlUpload = (fileInput: any) => {
    getUrlUploadFileApi({
      files: [
        {
          name: fileInput.name,
        },
      ],
    })
      .then((response) => {
        const { data } = response.data
        const formData = new FormData()
        dispatch(loadingActions.doLoadingSuccess())
        dispatch(loadingActions.doLoading())
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
            props.onFileSelectSuccess(data.newUrl)
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
        dispatch(loadingActions.doLoadingFailure())
        dispatch(
          notificationActions.doNotification({
            message: 'Get url error',
            type: 'error',
          })
        )
      })
  }
  return (
    <>
      <div className={classes['image-wrapper']}>
        {image && (
          <div className={classes['image-item']}>
            <XCircle
              size={28}
              weight="fill"
              color="#FFFFFF"
              onClick={() => {
                setImage('')
                props.onFileSelectDelete()
              }}
            />
            <img src={image} alt={''} loading="lazy" />
          </div>
        )}

        {/* {fileList ? (
          <UploadList />
        ) : (
          <img
            src={
              'https://images.unsplash.com/photo-1471357674240-e1a485acb3e1?w=162&h=162&fit=crop&auto=format'
            }
            srcSet={`https://images.unsplash.com/photo-1471357674240-e1a485acb3e1?w=162&h=162&fit=crop&auto=format&dpr=2 2x`}
            alt={''}
            loading="lazy"
          />
        )} */}
        <div className={classes['upload-wrapper']}>
          <div className={classes['label-image']}>Choose a image</div>
          <ButtonCustom variant="contained" component="label">
            Select file
            <input
              hidden
              accept="image/*"
              type="file"
              onChange={handleUploadImage}
            />
          </ButtonCustom>
        </div>
      </div>
    </>
  )
}

export default UploadImage

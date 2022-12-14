import Button from '@mui/material/Button'
import { styled } from '@mui/material/styles'
import { XCircle } from 'phosphor-react'
import React, { useState } from 'react'
import { useAppDispatch } from 'src/store/hooks'
import { loadingActions } from 'src/store/loading/loadingSlice'
import { notificationActions } from 'src/store/notification/notificationSlice'
import {
  getUrlUploadFileApi,
  uploadFileApi,
} from '../uploadImage/uploadImageAPI'
import classes from './styles.module.scss'

const ButtonCustom = styled<any>(Button)({
  borderRadius: '10px',
  color: '#F8F9FC',
  textTransform: 'unset',
  fontWeight: '600',
})

const UploadList: React.FC<{
  onFileSelectSuccess: (value: string[]) => void
  onFileSelectError: () => void
  onFileSelectDelete: () => void
}> = (props) => {
  const dispatch = useAppDispatch()
  const [imageList, setImageList] = useState<string[]>([])

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
            setImageList((prev) => {
              const clone = [...prev]
              clone.push(data.newUrl)
              props.onFileSelectSuccess(clone)

              return clone
            })
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
    <div className={classes['list-image-wrapper']}>
      {imageList.map((item, index) => (
        <div key={`${item}-${index}`} className={classes['image-item']}>
          <XCircle
            size={28}
            weight="fill"
            color="#fff"
            onClick={() => {
              setImageList((prev) => {
                const clone = [...prev]
                clone.splice(index, 1)
                return clone
              })
              props.onFileSelectDelete()
            }}
          />
          <img src={`${item}`} srcSet={`${item}`} alt={''} loading="lazy" />
        </div>
      ))}

      {imageList.length <= 10 && (
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
      )}
    </div>
  )
}

export default UploadList

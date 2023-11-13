import React, { useEffect, useState } from 'react'
import Button from '@mui/material/Button'
import { styled } from '@mui/material/styles'
import classes from './styles.module.scss'
import { getUrlUploadFileApi, uploadFileApi } from './uploadImageAPI'
import { XCircle } from '@phosphor-icons/react'
import { useAppDispatch } from 'src/store/hooks'
import { loadingActions } from 'src/store/loading/loadingSlice'
import { handlerGetErrMessage } from 'src/utils/global.utils'
import { useEnqueueSnackbar } from '../enqueueSnackbar'
import { useTranslation } from 'react-i18next'
// import heic2any from 'heic2any'
const ButtonCustom = styled<any>(Button)({
  borderRadius: '10px',
  color: '#F8F9FC',
  textTransform: 'unset',
  fontWeight: '600',
})

const UploadImage: React.FC<{
  onFileSelectSuccess: (value: any) => void
  onFileSelectError: () => void
  onFileSelectDelete: () => void
  file: string
}> = (props) => {
  const { t } = useTranslation('common')
  const [pushMessage] = useEnqueueSnackbar()
  const [image, setImage] = useState('')
  const dispatch = useAppDispatch()

  useEffect(() => {
    setImage(props?.file || '')
  }, [props.file])

  const beforeUpload = (file: any) => {
    const isJpgOrPng =
      file.type === 'image/jpeg' ||
      file.type === 'image/png' ||
      file.type === 'image/heic'
    const isLt2M = file.size / 1024 / 1024 < 50
    if (!isLt2M) {
      props.onFileSelectError()
      pushMessage(t('fileCannotBeLargeThan_50Mb'), 'error')
      return false
    }
    if (!isJpgOrPng) {
      props.onFileSelectError()
      pushMessage(t('theUploadedFileMustBeAnImage'), 'error')
      return false
    }
    return isLt2M && isJpgOrPng
  }
  const handleUploadImage = async (event: any) => {
    const objImage = event.target.files[0]
    console.log('7777', objImage)
    try {
      if (!beforeUpload(objImage)) return
      if (typeof window !== 'undefined' && objImage.type === 'image/heic') {
        // eslint-disable-next-line @typescript-eslint/no-var-requires
        const heic2any = require('heic2any')
        const convertedBlob = await heic2any({
          blob: objImage,
          toType: 'image/jpeg',
          quality: 0.5,
        })
        const jpgFile = new File([convertedBlob], `${objImage.name}.jpg`, {
          type: 'image/jpeg',
        })
        console.log('convertedBlob', convertedBlob, jpgFile)
        handleGetUrlUpload(jpgFile)
      } else {
        console.log('4444')
        handleGetUrlUpload(objImage)
      }
      // handleGetUrlUpload(objImage)
    } catch (error) {
      console.log('error', error)
    }
  }

  const handleGetUrlUpload = (fileInput: any) => {
    console.log('8888', fileInput)
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
        console.log('data', data.url)
        console.log('formData', formData)
        uploadFileApi({
          url: data.url,
          formData: formData,
        })
          .then(() => {
            console.log('data new url', data.newUrl)
            setImage(data.newUrl)
            props.onFileSelectSuccess(data.newUrl)
            dispatch(loadingActions.doLoadingSuccess())
            pushMessage(t('uploadSuccess'), 'success')
          })
          .catch(({ response }) => {
            dispatch(loadingActions.doLoadingFailure())
            const { status, data } = response
            pushMessage(handlerGetErrMessage(status, data), 'error')
          })
      })
      .catch(({ response }) => {
        dispatch(loadingActions.doLoadingFailure())
        const { status, data } = response
        pushMessage(handlerGetErrMessage(status, data), 'error')
      })
  }

  return (
    <>
      <div className={classes['image-wrapper']}>
        {image && (
          <>
            <div className={classes['image-item']}>
              <XCircle
                size={28}
                weight="fill"
                color="#FFFF"
                onClick={() => {
                  setImage('')
                  props.onFileSelectDelete()
                }}
              />
              <img src={image} alt={''} loading="lazy" />
              <div className={classes['upload-image-pseudo']}>
                <div className={classes['label-image']}>
                  {t('chooseAImage')}
                </div>
                <ButtonCustom variant="contained" component="label">
                  {t('selectFile')}
                  <input
                    hidden
                    accept=".jpeg, .jpg, .png, .heic"
                    type="file"
                    onChange={handleUploadImage}
                  />
                </ButtonCustom>
              </div>
            </div>
          </>
        )}

        {!image && (
          <div className={classes['upload-wrapper']}>
            <div className={classes['label-image']}>{t('chooseAImage')}</div>
            <ButtonCustom variant="contained" component="label">
              {t('selectFile')}
              <input
                hidden
                accept=".jpeg, .jpg, .png, .heic"
                type="file"
                onChange={handleUploadImage}
              />
            </ButtonCustom>
          </div>
        )}
      </div>
    </>
  )
}

export default UploadImage

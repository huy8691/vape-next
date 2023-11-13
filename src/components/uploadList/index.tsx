import Button from '@mui/material/Button'
import { styled } from '@mui/material/styles'
import { XCircle } from '@phosphor-icons/react'
import React, { useEffect, useState } from 'react'
import { useAppDispatch } from 'src/store/hooks'
import { loadingActions } from 'src/store/loading/loadingSlice'
import { handlerGetErrMessage } from 'src/utils/global.utils'
import {
  getUrlUploadFileApi,
  uploadFileApi,
} from '../uploadImage/uploadImageAPI'
import classes from './styles.module.scss'
import { useEnqueueSnackbar } from '../enqueueSnackbar'

const ButtonCustom = styled<any>(Button)({
  borderRadius: '10px',
  color: '#F8F9FC',
  textTransform: 'unset',
  fontWeight: '600',
})

const UploadList: React.FC<{
  onFileSelectSuccess: (value: string[]) => void
  onFileSelectError: () => void
  onFileSelectDelete: (value: string[]) => void
  files: string[]
}> = (props) => {
  const [pushMessage] = useEnqueueSnackbar()
  const dispatch = useAppDispatch()
  const [imageList, setImageList] = useState<string[]>([])

  useEffect(() => {
    setImageList(props.files)
  }, [props.files])

  const beforeUpload = (file: any) => {
    const isJpgOrPng =
      file.type === 'image/jpeg' ||
      file.type === 'image/png' ||
      file.type === 'image/heic'
    const isLt2M = file.size / 1024 / 1024 < 50
    if (!isLt2M) {
      props.onFileSelectError()
      pushMessage('File cannot be large than 50MB', 'error')
      return false
    }
    if (!isJpgOrPng) {
      props.onFileSelectError()
      pushMessage('The uploaded file must be an image', 'error')
      return false
    }
    return isJpgOrPng && isLt2M
  }

  const handleUploadImage = (event: any) => {
    const objImage = event.target.files
    try {
      Object.keys(objImage).forEach(async (key) => {
        if (!beforeUpload(objImage[key])) return
        if (
          typeof window !== 'undefined' &&
          objImage[key].type === 'image/heic'
        ) {
          // eslint-disable-next-line @typescript-eslint/no-var-requires
          const heic2any = require('heic2any')
          const convertedBlob = await heic2any({
            blob: objImage[key],
            toType: 'image/jpeg',
            quality: 0.5,
          })
          console.log('convertedBlob', objImage[key])

          const jpgFile = new File(
            [convertedBlob],
            `${objImage[key].name}.jpg`,
            {
              type: 'image/jpeg',
            }
          )
          console.log('convertedBlob', convertedBlob, jpgFile)
          handleGetUrlUpload(jpgFile)
        } else {
          console.log('4444')
          handleGetUrlUpload(objImage[key])
        }
        // console.log('run')
        // handleGetUrlUpload(objImage[key])
      })
    } catch (error) {
      console.log('error', error)
    }
  }

  const handleUploadImageCurrent = (index: number, event: any) => {
    const objImage = event.target.files[0]
    if (!beforeUpload(objImage)) return

    handleGetUrlUpload(objImage, index)
  }

  const handleGetUrlUpload = (fileInput: any, index?: number) => {
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
              if (typeof index === 'number') {
                clone[index] = data.newUrl
              } else {
                clone.push(data.newUrl)
              }

              props.onFileSelectSuccess(clone)

              return clone
            })
            dispatch(loadingActions.doLoadingSuccess())
            pushMessage('Upload success', 'success')
          })
          .catch(({ response }) => {
            dispatch(loadingActions.doLoadingFailure())
            const { status, data } = response
            pushMessage(handlerGetErrMessage(status, data), 'error')
          })
      })
      .catch(({ response }) => {
        dispatch(loadingActions.doLoadingFailure())
        setImageList((prev) => {
          const clone = [...prev]
          clone.push('')

          return clone
        })
        const { status, data } = response
        pushMessage(handlerGetErrMessage(status, data), 'error')
      })
  }

  return (
    <div className={classes['list-image-wrapper']}>
      {imageList && imageList.length < 10 && (
        <div className={classes['upload-background']}>
          <div className={classes['upload-wrapper']}>
            <div className={classes['label-image']}>Choose a image</div>
            <ButtonCustom variant="contained" component="label">
              Select file
              <input
                hidden
                multiple
                accept=".jpeg, .jpg, .png, .heic"
                type="file"
                onChange={handleUploadImage}
              />
            </ButtonCustom>
          </div>
        </div>
      )}
      {imageList &&
        imageList.map((item, index) => (
          <div
            key={`${item}-${index}`}
            className={classes['upload-background']}
          >
            <div className={classes['image-item']}>
              <XCircle
                size={28}
                weight="fill"
                color="#fff"
                className={classes['button-x']}
                onClick={() => {
                  setImageList((prev) => {
                    const clone = [...prev]
                    clone.splice(index, 1)
                    props.onFileSelectDelete([...clone])

                    return clone
                  })
                }}
              />
              <img src={item} srcSet={item} alt={''} loading="lazy" />

              <div className={classes['upload-image-pseudo']}>
                <div className={classes['label-image']}>Choose a image</div>
                <ButtonCustom variant="contained" component="label">
                  Select file
                  <input
                    hidden
                    accept=".jpeg, .jpg, .png, .heic"
                    type="file"
                    onChange={(event) => handleUploadImageCurrent(index, event)}
                  />
                </ButtonCustom>
              </div>
            </div>
          </div>
        ))}
    </div>
  )
}

export default UploadList

import { Chip, Box, Typography } from '@mui/material'
import { styled } from '@mui/material/styles'
import { Upload, XCircle } from '@phosphor-icons/react'
import React, { ChangeEvent, useEffect, useState } from 'react'
import { useAppDispatch } from 'src/store/hooks'
import { loadingActions } from 'src/store/loading/loadingSlice'
import { handlerGetErrMessage } from 'src/utils/global.utils'
import { useEnqueueSnackbar } from '../enqueueSnackbar'
import {
  getUrlUploadFileApi,
  uploadFileApi,
} from '../uploadImage/uploadImageAPI'
import { ButtonCustom } from 'src/components'

const ChipCustom = styled(Chip)({
  background: 'transparent',
  borderRadius: '7px',
})
const DeleteIcon = styled('div')({
  width: '20px',
  display: 'flex',
  alignItems: 'center',
})

const UploadFileList: React.FC<{
  onFileSelectSuccess: (value: string[]) => void
  onFileSelectError: () => void
  onFileSelectDelete: (value: string[]) => void
  files: string[]
  maxFiles: number
  sizeButton?: 'small' | 'medium' | 'large'
}> = (props) => {
  console.log('props', props)
  const [pushMessage] = useEnqueueSnackbar()
  const dispatch = useAppDispatch()
  const [fileList, setFileList] = useState<string[]>([])
  useEffect(() => {
    setFileList(props.files)
  }, [props.files])

  const beforeUpload = (file: File) => {
    const isJpgOrPng =
      file.type === 'image/jpeg' ||
      file.type === 'image/png' ||
      file.type === 'application/pdf' ||
      file.type === 'image/heic' ||
      file.type ===
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
      file.type === 'image/jpg'
    const isLt2M = file.size / 1024 / 1024 < 50
    if (!isLt2M) {
      props.onFileSelectError()
      pushMessage('File cannot be large than 50MB', 'error')
      return false
    }
    return isJpgOrPng && isLt2M
  }

  const handleUploadFile = (event: ChangeEvent<HTMLInputElement>) => {
    console.log('handle upload file button')
    if (event.target.files && event.target.files.length > 0) {
      const objImage = event.target.files
      try {
        Object.keys(objImage).forEach(async (key: any) => {
          if (!beforeUpload(objImage[key])) {
            console.log('if false beforeUpload')
            return
          }

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
            const jpgFile = new File(
              [convertedBlob],
              `${objImage[key].name}.jpg`,
              {
                type: 'image/jpeg',
              }
            )
            handleGetUrlUpload(jpgFile)
          } else {
            console.log('4444')
            handleGetUrlUpload(objImage[key])
          }
          // console.log('if beforeUpload')
          // handleGetUrlUpload(objImage[key])
        })
      } catch (error) {
        console.log('error', error)
      }
    }
  }

  const handleUploadImageCurrent = (
    index: number,
    event: ChangeEvent<HTMLInputElement>
  ) => {
    if (event.target.files && event.target.files.length > 0) {
      const objFile = event.target.files[0]
      if (!beforeUpload(objFile)) return
      handleGetUrlUpload(objFile, index)
    }
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
            setFileList((prev) => {
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
        setFileList((prev) => {
          const clone = [...prev]
          clone.push('')
          return clone
        })
        const { status, data } = response
        pushMessage(handlerGetErrMessage(status, data), 'error')
      })
  }
  const handleDelete = () => {
    console.info('You clicked the delete icon.')
  }
  console.log('fileList?.length ', fileList?.length)

  return (
    <>
      <Box mb={2}>
        {fileList?.map((item, index) => {
          return (
            <div key={`${item}-${index}`}>
              <ChipCustom
                label={
                  <Typography
                    style={{
                      width: '100%',
                      maxWidth: '135px',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      direction: 'rtl',
                      color: '#2F6FED',
                    }}
                  >
                    {item}
                  </Typography>
                }
                onDelete={handleDelete}
                deleteIcon={
                  <DeleteIcon>
                    <XCircle
                      size={28}
                      onClick={() => {
                        setFileList((prev) => {
                          const clone = [...prev]
                          clone.splice(index, 1)
                          props.onFileSelectDelete([...clone])
                          return clone
                        })
                      }}
                    />
                  </DeleteIcon>
                }
              />
              <input
                hidden
                accept=".doc,.docx,application/pdf,.png,.jpg,.jpeg,.heic"
                type="file"
                onChange={(event) => handleUploadImageCurrent(index, event)}
              />
            </div>
          )
        })}
      </Box>
      {fileList?.length < props?.maxFiles && (
        // <ButtonCustom
        //   variant="outlined"
        //   startIcon={<Upload size={20} />}
        //   size={props.sizeButton ? props.sizeButton : 'large'}
        //   style={{ marginLeft: 'auto' }}
        // >
        //   Select file
        //   <input
        //     hidden
        //     multiple
        //     accept=".doc,.docx,application/pdf,.png,.jpg,.jpeg"
        //     type="file"
        //     onChange={handleUploadFile}
        //   />
        // </ButtonCustom>
        <ButtonCustom
          variant="outlined"
          startIcon={<Upload size={20} />}
          size={props.sizeButton ? props.sizeButton : 'large'}
          style={{ marginLeft: 'auto' }}
          component="label"
        >
          Select file
          <input
            hidden
            multiple
            accept=".doc,.docx,application/pdf,.png,.jpg,.jpeg,.heic"
            type="file"
            onChange={handleUploadFile}
          />
        </ButtonCustom>
      )}
    </>
  )
}

export default UploadFileList

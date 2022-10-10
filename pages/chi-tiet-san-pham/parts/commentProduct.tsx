import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import {
  Result,
  Typography,
  Space,
  Comment,
  Alert,
  Avatar,
  Tooltip,
  Rate,
  Input,
  Button,
} from 'antd'
import moment from 'moment'
import { FileSyncOutlined } from '@ant-design/icons'
import { getCommentProduct } from '../apiProductDetail'
import { useAppDispatch } from 'src/store/hooks'
import { loadingActions } from 'src/store/loading/loadingSlice'
import {
  CommentListDataResponseType,
  CommentDataType,
} from '../modelProductDetail'

const { Title } = Typography
const { TextArea } = Input

// interface EditorProps {
//   onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void
//   onSubmit: () => void
//   submitting: boolean
//   value: string
// }

const Editor = ({ onChange, onSubmit, submitting, value }: any) => (
  <Space direction="vertical" style={{ width: '100%' }}>
    <TextArea rows={4} onChange={onChange} value={value} />
    <Button
      htmlType="submit"
      loading={submitting}
      onClick={onSubmit}
      type="primary"
    >
      Add Comment
    </Button>
  </Space>
)

// const ExampleComment: React.FC<{ children?: React.ReactNode }> = ({
//   children,
// }) => (
//   <Comment
//     actions={[<span key="comment-nested-reply-to">Reply to</span>]}
//     author={<a>Han Solo</a>}
//     avatar={<Avatar src="https://joeschmoe.io/api/v1/random" alt="Han Solo" />}
//     content={
//       <p>
//         We supply a series of design principles, practical patterns and high
//         quality design resources (Sketch and Axure).
//       </p>
//     }
//   >
//     {children}
//   </Comment>
// )

const ComponentProduct: React.FC = () => {
  const router = useRouter()
  const dispatch = useAppDispatch()
  const [dataComponent, setDataComment] =
    useState<CommentListDataResponseType>()
  // const [idReply, setIdReply] = useState<number>()
  useEffect(() => {
    if (router.query.id) {
      let params = {
        productId: router.query.id,
        page: 1,
        pageSize: 10,
      }
      getCommentProduct(params)
        .then((res) => {
          const data = res.data
          setDataComment(data)
          dispatch(loadingActions.doLoadingSuccess())
        })
        .catch((error) => {
          const errors = error.response ? error.response.data : true
          setDataComment({
            errors: errors,
          })
          dispatch(loadingActions.doLoadingFailure())
        })
    }
  }, [router, dispatch])

  const renderResult = () => {
    if (dataComponent?.errors) {
      return <Alert message="Đã xảy ra lỗi" type="error" />
    }
    if (dataComponent?.data?.length === 0) {
      return (
        <Space direction="vertical" size="middle" style={{ width: '100%' }}>
          <Result
            icon={<FileSyncOutlined />}
            title={<Title level={5}>Không có bình luận</Title>}
          />
        </Space>
      )
    }
    return (
      <>
        {dataComponent?.data?.map((item: CommentDataType, index: number) => (
          <div key={index + Math.random()}>
            <Comment
              actions={[
                <span
                  key="comment-nested-reply-to"
                  // onClick={() => setIdReply(item.id)}
                >
                  Reply to
                </span>,
              ]}
              author={item.customer.fullName}
              avatar={
                <Avatar
                  src={item.customer.avatar}
                  alt={item.customer.fullName}
                />
              }
              content={
                <div>
                  <Rate disabled defaultValue={item.rating} />
                  <p>{item.comment}</p>
                  <Editor />
                </div>
              }
              datetime={
                <Tooltip
                  title={moment(item.created_at).format('HH:mm:ss DD/MM/YYYY')}
                >
                  <span>{moment(item.created_at).fromNow()}</span>
                </Tooltip>
              }
            />
          </div>
        ))}
      </>
    )
  }

  return renderResult()
}

export default ComponentProduct

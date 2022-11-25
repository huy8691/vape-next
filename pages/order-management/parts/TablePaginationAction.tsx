import { IconButton } from '@mui/material'
import { Box } from '@mui/system'
import Image from 'next/image'
import React from 'react'
import iconFirstPage from './ArrowLineLeft.svg'
import iconNextPage from './NextPage.svg'
import iconPreviousPage from './PreviousPage.svg'
import iconLastPage from './ArrowLineRight.svg'
import { styled } from '@mui/system'
// import { getOrders } from '../apiOrders'
import { useRouter } from 'next/router'
import { objToStringParam } from 'src/utils/global.utils'

interface Props {
  page: number
  rowsPerPage: number
  count: number
  // onPageChange: Function
  nextIsNull: number
}

const IconButtonCustom = styled(IconButton)(() => ({
  background: '#E1E6EF',
  padding: '10px ',
  borderRadius: '5px',
}))

const TablePaginationAction = ({
  page,
  nextIsNull,
  count,
  rowsPerPage,
}: Props) => {
  let nextPage = page + 1
  const router = useRouter()

  const handleFirstPageButtonClick = () => {
    router.replace({
      search: `${objToStringParam({
        ...router.query,
        page: 1,
      })}`,
    })
  }

  const handleBackButtonClick = () => {
    // onPageChange(event, page - 1)
    router.replace({
      search: `${objToStringParam({
        ...router.query,
        page: nextPage - 1,
      })}`,
    })
  }

  const handleNextButtonClick = () => {
    // onPageChange(event, page + 1)
    router.replace({
      search: `${objToStringParam({
        ...router.query,
        page: nextPage + 1,
      })}`,
    })
  }

  const handleLastPageButtonClick = () => {
    router.replace({
      search: `${objToStringParam({
        ...router.query,
        page: Math.ceil(count / rowsPerPage),
      })}`,
    })
  }
  return (
    <>
      <Box sx={{ flexShrink: 0, ml: 2.5, p: 1 }}>
        <IconButtonCustom
          onClick={handleFirstPageButtonClick}
          aria-label="first page"
          style={{ marginRight: '10px' }}
          disabled={page === 0}
        >
          <Image
            alt="icon previous page"
            src={iconFirstPage}
            objectFit="contain"
            width="20"
            height="20"
          ></Image>
        </IconButtonCustom>
        <IconButtonCustom
          onClick={handleBackButtonClick}
          aria-label="previous page"
          style={{ marginRight: '10px' }}
          disabled={page === 0}
        >
          <Image
            alt="icon previous page"
            src={iconPreviousPage}
            objectFit="contain"
            width="20"
            height="20"
          ></Image>
        </IconButtonCustom>
        <IconButtonCustom
          onClick={handleNextButtonClick}
          aria-label="next page"
          disabled={nextIsNull === 0}
        >
          <Image
            alt="icon next page"
            src={iconNextPage}
            objectFit="contain"
            width="20"
            height="20"
          ></Image>
        </IconButtonCustom>
        <IconButtonCustom
          sx={{ marginLeft: '10px' }}
          onClick={handleLastPageButtonClick}
          aria-label="next page"
          disabled={page === Math.max(0, Math.ceil(count / rowsPerPage) - 1)}
        >
          <Image
            alt="icon next page"
            src={iconLastPage}
            objectFit="contain"
            width="20"
            height="20"
          ></Image>
        </IconButtonCustom>
      </Box>
    </>
  )
}

export default TablePaginationAction

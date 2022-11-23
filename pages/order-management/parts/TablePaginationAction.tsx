import { IconButton } from '@mui/material'
import { Box } from '@mui/system'
import Image from 'next/image'
import React from 'react'
import iconNextPage from './arrow-next.svg'
import iconPreviousPage from './arrow-previous.svg'
import { styled } from '@mui/system'
// import { getOrders } from '../apiOrders'
import { useRouter } from 'next/router'
import { objToStringParam } from 'src/utils/global.utils'

interface Props {
  page: number
  rowsPerPage: number
  onPageChange: Function
  // nextpage: number | null
  nextIsNull: number
  // next: number | null
}

const IconButtonCustom = styled(IconButton)(() => ({
  background: '#E1E6EF',
  padding: '10px ',
  borderRadius: '5px',
}))

const TablePaginationAction = ({ page, onPageChange, nextIsNull }: Props) => {
  let nextPage = page + 1
  const router = useRouter()
  const handleBackButtonClick = (event: any) => {
    onPageChange(event, page - 1)
    router.replace({
      search: `${objToStringParam({
        ...router.query,
        page: nextPage - 1,
      })}`,
    })
  }

  const handleNextButtonClick = (event: any) => {
    onPageChange(event, page + 1)
    router.replace({
      search: `${objToStringParam({
        ...router.query,
        page: nextPage + 1,
      })}`,
    })
  }

  return (
    <>
      <Box sx={{ flexShrink: 0, ml: 2.5, p: 2 }}>
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
            width="12"
            height="8"
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
            width="12"
            height="8"
          ></Image>
        </IconButtonCustom>
      </Box>
    </>
  )
}

export default TablePaginationAction

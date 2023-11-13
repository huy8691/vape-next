import { Search } from '@mui/icons-material'
import { CircularProgress, TextField, Box } from '@mui/material'
import { styled } from '@mui/material/styles'
import React, { useEffect, useState } from 'react'
import InfiniteScroll from 'react-infinite-scroll-component'
import { MenuItemSelectCustom } from 'src/components'
import { useDebouncedCallback } from 'use-debounce'

const TextFieldCustom = styled(TextField)({
  '& .MuiOutlinedInput-root': {
    borderRadius: '8px',
    fontSize: '1.2rem',
    overflow: 'hidden',
    borderColor: '#E1E6EF',
    margin: '0px 15px 10px',
  },
  '& .MuiOutlinedInput-notchedOutline': {
    borderWidth: '1px !important',
    borderColor: '#E1E6EF',
  },
  '& .MuiInputBase-multiline': {
    padding: '0px',
  },
  '& .MuiInputBase-input': {
    padding: '7px 10px',
  },
})
interface Props {
  propData: any
  handleSearch: (value: string | null) => void
  fetchMore: (value: { page: number; name: string }) => void
  onClickSelectItem: (value: string) => void
  propsGetValue: string | undefined
}

const InfiniteScrollSelect: React.FC<Props> = (props) => {
  const [statePage, setStatePage] = useState<number>(props.propData?.nextPage)
  const [valueInput, setValueInput] = useState<string>('')
  // const [unmount, setUnmount] = useState<boolean>(false)

  const ListItem = ({ list }: any) => {
    return list?.map((item: any, index: number) => {
      return (
        <Box key={index}>
          <MenuItemSelectCustom
            disabled={item?.child_category?.length > 0 ? true : false}
            value={item.id}
            selected={
              `${item.id}-${item.name}` === props.propsGetValue ? true : false
            }
            onClick={() => props.onClickSelectItem(item)}
          >
            {item.name}
          </MenuItemSelectCustom>
          {item?.child_category?.length > 0 && (
            <Box
              sx={{
                pl: 3,
              }}
            >
              <ListItem list={item?.child_category} />
            </Box>
          )}
        </Box>
      )
    })
  }

  const debounced = useDebouncedCallback((e) => {
    setValueInput(e.target.value)
    props.handleSearch(e.target.value)
  }, 500)
  const next = () => {
    setStatePage((prev) => {
      console.log(statePage)
      props.fetchMore({
        page: prev,
        name: valueInput,
      })
      return prev + 1
    })
  }
  useEffect(() => {
    setStatePage(props.propData?.nextPage)
  }, [props.propData?.nextPage])

  useEffect(() => {
    return () => {
      console.log('prev2')
      if (valueInput) {
        console.log('prev')
        props.handleSearch('')
      }
    }
  }, [valueInput])

  // unmount component
  // const useOnUnmount = (callback: () => void) => {
  //   const onUnmount = useRef<(() => void) | null>(null)
  //   onUnmount.current = callback
  //   useEffect(() => {
  //     return () => onUnmount.current?.()
  //   }, [])
  // }

  // useOnUnmount(() => {
  //   console.log('unmount', unmount)
  //   setUnmount((prev) => {
  //     if (valueInput && prev) {
  //       console.log('prev')
  //       props.handleSearch('')
  //     }
  //     return !prev
  //   })
  // })

  return (
    <>
      <TextFieldCustom
        onChange={(e) => debounced(e)}
        sx={{ width: '100%' }}
        size="small"
        InputProps={{
          startAdornment: <Search style={{ fontSize: '18px' }} />,
        }}
        onClick={(e) => {
          e.stopPropagation()
          e.preventDefault()
        }}
      />
      <InfiniteScroll
        dataLength={Number(props.propData?.data?.length)} //This is important field to render the next data
        height={150}
        next={next}
        hasMore={props.propData?.nextPage}
        loader={
          <Box
            style={{
              textAlign: 'center',
            }}
          >
            <CircularProgress size="2rem" />
          </Box>
        }
      >
        <ListItem list={props.propData?.data} />
      </InfiniteScroll>
    </>
  )
}

export default InfiniteScrollSelect

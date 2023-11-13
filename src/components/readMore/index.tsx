import React, { useState } from 'react'
import { styled } from '@mui/material/styles'
type Props = {
  children: string
}

const Span = styled('span')(() => ({
  color: '#2F6FED',
  cursor: 'pointer',
  fontWeight: '500',
  display: 'contents',
  whiteSpace: 'nowrap',
}))
const ReadMore = ({ children }: Props) => {
  const [isHidden, setIsHidden] = useState(true)
  const string1 = children.slice(0, 300)
  const string2 = children.slice(300, children.length)
  return (
    <>
      {string1}
      {string2.length > 0 && isHidden && (
        <Span onClick={() => setIsHidden(!isHidden)}> ...show more</Span>
      )}
      {string2.length > 0 && !isHidden && (
        <>
          {string2}
          <Span onClick={() => setIsHidden(!isHidden)}> less more</Span>
        </>
      )}
    </>
  )
}

export default ReadMore

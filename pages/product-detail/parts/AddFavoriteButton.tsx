import { IconButton } from '@mui/material'
import Image from 'next/image'

import React, { useState } from 'react'
import iconFavorite from '../parts/icon/icon-favorite.svg'
import iconFavorited from '../parts/icon/icon-favorited.svg'

import { styled } from '@mui/material/styles'
const IconButtonFavorite = styled(IconButton)(() => ({
  padding: '17px',
  border: `1px solid green`,
  borderRadius: '10px',
  // position: 'relative',
  // backgroundClip: 'padding-box',
  // '&:before': {
  //   content: '""',
  //   position: 'absolute',
  //   inset: '0',
  //   zIndex: '-1',
  //   margin: '-10px',
  //   backgroundImage: 'linear-gradient(93.37deg, #1CB35B 0%, #20B598 116.99%)',
  //   borderRadius: 'inherit',
  // },
}))
const IconButtonFavorited = styled(IconButton)(() => ({
  padding: '17px',
  border: '1px solid transparent',
  borderRadius: '10px',
}))
const AddFavoriteButton = () => {
  const [toggle, setToggle] = useState(false)
  return (
    <>
      {toggle ? (
        <IconButtonFavorited onClick={() => setToggle(!toggle)}>
          <Image
            alt="icon-favorite"
            src={iconFavorited}
            objectFit="contain"
            width="20"
            height="20"
          />
        </IconButtonFavorited>
      ) : (
        <IconButtonFavorite onClick={() => setToggle(!toggle)}>
          <Image
            alt="icon-favorited"
            src={iconFavorite}
            objectFit="contain"
            width="20"
            height="20"
          />
        </IconButtonFavorite>
      )}
    </>
  )
}

export default AddFavoriteButton

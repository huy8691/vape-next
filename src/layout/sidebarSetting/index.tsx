import React from 'react'
import { styled } from '@mui/material/styles'
import classes from './styles.module.scss'

type Props = {
  isOpen: boolean
}

// const DrawerHeader = styled('div')(({ theme }) => {
//   console.log('theme1', theme.mixins.toolbar)

//   return theme.mixins.toolbar
// })

const DrawerHeader = styled('div')(({ theme }) => ({
  ...theme.mixins.toolbar,
}))
const SideBarSetting = (props: Props) => {
  const sidebarClass = props.isOpen
    ? `${classes.sidebarSetting} ${classes.open}`
    : `${classes.sidebarSetting}`
  return (
    <div className={sidebarClass}>
      <DrawerHeader></DrawerHeader>
      <div className={classes.sidebarSetting__inner}> I slide into view </div>
    </div>
  )
}
export default SideBarSetting

import React from 'react'
import { styled } from '@mui/material/styles'
import classes from './styles.module.scss'

type Props = {
  isOpen: boolean
}

const SideBarInner = styled('div')(({ theme }) => ({
  backgroundColor:
    theme.palette.mode === 'dark' ? theme.palette.background.default : '#fff',
}))

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
      <SideBarInner className={classes.sidebarSetting__inner}>
        Setting
      </SideBarInner>
    </div>
  )
}
export default SideBarSetting

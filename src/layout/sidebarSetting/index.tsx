import React from 'react'
import Box from '@mui/material/Box'
import Paper from '@mui/material/Paper'
import Grid from '@mui/material/Grid'
import { styled } from '@mui/material/styles'
import classes from './styles.module.scss'
import Button, { ButtonProps } from '@mui/material/Button'
import Stack from '@mui/material/Stack'
import { purple } from '@mui/material/colors'

type Props = {
  isOpen: boolean
}

const colors = [{ color: 'rgb(255, 86, 48)' }, { color: '#34DC75' }]

const SideBarInner = styled('div')(({ theme }) => ({
  backgroundColor:
    theme.palette.mode === 'dark' ? theme.palette.background.default : '#fff',
}))

const DrawerHeader = styled('div')(({ theme }) => ({
  ...theme.mixins.toolbar,
}))

const SideBarSetting = (props: Props) => {
  const handleSettingColor = (color: string) => {
    localStorage.setItem('color', color)
  }
  const sidebarClass = props.isOpen
    ? `${classes.sidebarSetting} ${classes.open}`
    : `${classes.sidebarSetting}`
  return (
    <div className={sidebarClass}>
      <DrawerHeader></DrawerHeader>
      <SideBarInner className={classes.sidebarSetting__inner}>
        <Grid container spacing={{ xs: 2 }} columns={{ xs: 4 }}>
          {colors.map((item, index) => (
            <Grid item xs={4} key={index}>
              <Button
                variant="contained"
                size="small"
                style={{ backgroundColor: item.color }}
                onClick={() => handleSettingColor(item.color)}
              >
                <div className={classes['color']} />
              </Button>
            </Grid>
          ))}
        </Grid>
      </SideBarInner>
    </div>
  )
}
export default SideBarSetting

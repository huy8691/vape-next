import React from 'react'
import { RenderTreeType } from '../../sellerModel'
import { MenuItemSelectCustom } from 'src/components'
import { Box } from '@mui/material'
interface Props {
  propState: RenderTreeType[]
  setValueAssignRole: any
  getValuesAssignRole: number[]

  //   fetchMore: (value: { page: number; name: string }) => void
  //   onClickSelectItem: (value: string[]) => void
  //   propsGetValue: string[]
  //   propName: string
}
const TreeViewComponent: React.FC<Props> = (props) => {
  const renderListItem = (node: RenderTreeType) => {
    if (!node) return
    return (
      <Box key={node.id + Math.random()} sx={{ paddingLeft: '8px' }}>
        <MenuItemSelectCustom
          value={node.id}
          selected={
            props.getValuesAssignRole.indexOf(node.id) !== -1
            // `${node.id}-${node.name}` ===
          }
          onClick={() => {
            // handleChange(`${item.id}-${item[props.propName]}`)
            console.log(`node.id ${node.id}`)
            console.log('getValuesAssignRole', props.getValuesAssignRole)
            const index = props.getValuesAssignRole.indexOf(node.id)
            const arr = props.getValuesAssignRole
            if (index !== -1) {
              arr.splice(index, 1)
            } else {
              arr.push(node.id)
            }
            props.setValueAssignRole(arr)
          }}
        >
          {node.name}
        </MenuItemSelectCustom>
        {node.child_role.length > 0
          ? node.child_role.map((children: RenderTreeType) =>
              renderListItem(children)
            )
          : null}
      </Box>
    )
  }
  return (
    <>
      {props.propState.map((element: RenderTreeType) =>
        renderListItem(element)
      )}
    </>
  )
}

export default TreeViewComponent

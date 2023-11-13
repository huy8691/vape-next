import { useAppSelector } from 'src/store/hooks'
import { checkPermission } from './global.utils'
type Props = {
  children: React.ReactNode
  moduleName: string
  permissionRule: string
}
const ChildrenComponent = ({ children, moduleName, permissionRule }: Props) => {
  const permission = useAppSelector((state) => state.permission.data)

  if (
    permission.length === 0 ||
    !checkPermission(permission, moduleName, permissionRule)
  ) {
    return <></>
  }

  return <>{children}</>
}

const WithPermission = (
  children: React.ReactNode,
  moduleName: string,
  permissionRule: string
) => {
  return (
    <ChildrenComponent moduleName={moduleName} permissionRule={permissionRule}>
      {children}
    </ChildrenComponent>
  )
}
export default WithPermission

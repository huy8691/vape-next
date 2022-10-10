import React, { Children } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import classes from './styles.module.scss'
type Props = {
  children: React.ReactElement
  activeClassName?: string
  href: string
  as?: string
}

const ActiveLink: React.FC<Props> = ({ children, ...props }: Props) => {
  const { asPath } = useRouter()
  const child = Children.only(children)
  const className =
    asPath === props.href || asPath === props.as ? `${classes.active}` : null
  return (
    <Link {...props} href={props.href}>
      {React.cloneElement(child, {
        className: className || null,
      })}
    </Link>
  )
}

export default ActiveLink

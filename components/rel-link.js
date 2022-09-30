import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'

export function buildPath (router) {
  // "/" -> ['', '']
  // "/a/b/c" -> ['', 'a', 'b', 'c']
  // "/a?q=c" -> ['', 'a']
  const pathname = router.pathname
  if (pathname === '/') {
    return '.'
  }
  return router.pathname.slice(1).split('/').fill('..').join('/')
}

export default function RelLink (props) {
  const router = useRouter()
  const [path, setPath] = useState(buildPath(router))

  function navigate (event) {
    event.preventDefault()
    router.push(path + props.href)
  }

  useEffect(() => {
    setPath(buildPath(router))
  }, [router, router.pathname])

  return (<a {...props} href={path + props.href} onClick={navigate}>{props.children}</a>)
}

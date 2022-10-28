import { createContext, useContext, useEffect, useState } from 'react'
import NextRouter from 'next/router'
import ComponentMap from './component-map'

const VRouterContext = createContext({
  history: [{
    path: '*invalid*',
    Component: () => (<div>*Invalid*</div>),
    pageProps: {}
  }],
  setMain: () => {
    throw new Error('Accessed VRouterContext outside of a VRouterContext.Provider')
  }
})

/**
 * A Component that sets up and provides client-side routing and
 * history tracking for descendant components.
 *
 * Because this component interacts with browser history and the
 * global NextJS router, it would probably be an error to have more
 * than one included in a page.
 *
 * path: the path to the main component for the app, relative to the
 * components directly. Like, "home" or "example/nested"
 * (optional) pageProps: any props to be passed along to the main
 * component
 * (optional) children: the component tree that will have access to
 * the router context
 */
export function RouterContext ({ path, pageProps, children }) {
  const Component = ComponentMap.get(path)
  const [context, setContext] = useState({
    history: [{
      path,
      Component,
      pageProps
    }],
    push: pushEntry
  })
  const nextRouter = NextRouter.useRouter()

  // `history` is a parameter because the context reference captured
  // through the closure would be stale
  function pushEntry (history, historyEntry) {
    const update = history.concat(historyEntry)
    setContext({
      history: update,
      push: pushEntry
    })
    return historyEntry
  }

  useEffect(() => {
    nextRouter.beforePopState(({ url, as, options }) => {
      setContext({
        history: context.history.slice(0, -1),
        push: context.push
      })
      return true
    })
  }, [nextRouter, context])

  return (<VRouterContext.Provider value={context}>
            {children}
          </VRouterContext.Provider>)
}

/**
 * Access the router used for client-side transitions and history
 * management.
 */
export function useRouter () {
  const { history, push, pop } = useContext(VRouterContext)
  const nextRouter = NextRouter.useRouter()

  return {
    state: history.slice(-1)[0],
    length: history.length,
    push: function ({ path, pageProps }) {
      nextRouter.push('/', `#${path}`)
      console.log('next push', path)

      const Component = ComponentMap.get(path)
      push(history, { path, Component, pageProps })
    },
    back: function () {
      // pop(history)
      return nextRouter.back()
    }
  }
}

/**
 * An anchor element used to trigger a client-side transition to a
 * specific component. Props other than `path` and `className` are
 * forwarded on to the destination component if the link is followed.
 *
 * path: the path to the main component for the app, relative to the
 * components directly. Like, "home" or "example/nested"
 */
export default function VLink ({ path, className, ...props }) {
  const router = useRouter()

  function handleClick (event) {
    router.push({ path, pageProps: props })
  }

  return (<a className={className} href={`#${path}`} onClick={handleClick}>{props.children}</a>)

}

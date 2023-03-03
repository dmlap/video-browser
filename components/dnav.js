import { createContext, useContext, useEffect, useRef, useState } from 'react'
import debounce from 'lodash/debounce'

const DNavContext = createContext(() => {
  throw new Error('No enclosing DNav component')
})

const OFF_AXIS_PENALTY = 16
function findAdjacents ([element, center], centers) {
  function findNext (axis, reverse) {
    const offAxis = axis === 'x' ? 'y' : 'x'

    let result = element
    let minDist = Infinity

    for (const [el, cntr] of centers.entries()) {
      if (el === element) {
        continue
      }

      let dist = 0
      const [start, end] = reverse ? [cntr, center] : [center, cntr]
      if (end[axis] > start[axis]) {
        dist += end[axis] - start[axis]
      } else {
        dist += 2 * OFF_AXIS_PENALTY * (start[axis] - end[axis])
      }
      dist += OFF_AXIS_PENALTY * Math.abs(cntr[offAxis] - center[offAxis])

      if (dist < minDist) {
        // found a better candidate
        result = el
        minDist = dist
      }
    }

    return result
  }

  return {
    up: findNext('y', true),
    right: findNext('x', false),
    down: findNext('y', false),
    left: findNext('x', true)
  }
}

const FOCUSABLE = 'a[href], area[href], input, select, textarea, button, '
      + 'iframe, [tabindex], [contentEditable=true]'

const KEY_DIR = {
  'ArrowUp': 'up',
  'ArrowRight': 'right',
  'ArrowDown': 'down',
  'ArrowLeft': 'left'
}

const SCROLL_QUIET_DURATION = 250

/**
 * A Component that tracks a graph between focusable elements for
 * navigation with a directional pad.
 */
export function DNav ({ children }) {
  // use a ref so that graph updates don't trigger re-renders
  const graph = useRef(new Map())

  useEffect(() => {
    function handleKeyDown (event) {
      if (event.altKey || event.ctrlKey || event.metaKey || event.shiftKey) {
        // abort if any modifiers are active
        return
      }

      console.log(event);

      if (event.keyCode === 461) {
          console.log("Back key pressed");
      }

      const dir = KEY_DIR[event.key]
      if (!dir) {
        // abort non-directional key presses
        return
      }

      event.preventDefault()
      const start = graph.current.get(document.activeElement)
            || graph.current.values().next().value
      start[dir].focus()
    }
    document.addEventListener('keydown', handleKeyDown)

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [])

  useEffect(() => {
    const handleScroll = debounce(update, SCROLL_QUIET_DURATION)

    document.addEventListener('scroll', handleScroll)

    return () => {
      document.removeEventListener('scroll', handleScroll)
    }
  }, [])

  // clear and re-populate the navigation graph
  function update () {
    graph.current.clear()

    const centers = new Map()

    for (const element of document.querySelectorAll(FOCUSABLE)) {
      const rect = element.getBoundingClientRect()
      const center = {
        x: rect.left + window.scrollX + ((rect.right - rect.left) / 2),
        y: rect.top + window.scrollY + ((rect.bottom - rect.top) / 2)
      }
      centers.set(element, center)
    }

    for (const entry of centers.entries()) {
      graph.current.set(entry[0], findAdjacents(entry, centers))
    }
  }

  return (<DNavContext.Provider value={update}>
            {children}
          </DNavContext.Provider>)
}

export function useDNav () {
  const update = useContext(DNavContext)
  const ref = useRef()

  // update the focus graph whenever a re-render is triggered for this
  // component
  useEffect(update)

  // update the focus graph if the Component's scroll position changes
  useEffect(() => {
    const handleScroll = debounce(update, SCROLL_QUIET_DURATION)

    if (!ref.current) {
      return
    }
    const component = ref.current
    component.addEventListener('scroll', handleScroll)

    return () => {
      component.removeEventListener('scroll', handleScroll)
    }
  }, [update, ref.current])

  return ref
}

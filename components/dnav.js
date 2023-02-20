import { createContext, useContext, useEffect, useRef, useState } from 'react'

const DNavContext = createContext(() => {
  throw new Error('No enclosing DNav component')
})

const OFF_AXIS_PENALTY = 100
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

  // update the focus graph whenever a re-render is triggered for this
  // component
  useEffect(update)
}

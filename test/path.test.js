import { jest } from '@jest/globals'
import { relative } from  '../src/path'

/*
/a/b/c   -> /a/0     = ../0
/a/b/c/d -> /a/e/0   = ../../e/0
/a       -> /0       = 0
/a/b     -> /a/0     = 0
/a/b     -> /a/b/c/0 = c/0
/a/b     -> /0       = ../0
/a/b/    -> /a/0     = ../0
/a/b/    -> /a/b/c/0 = c/0
/a/b/    -> /0       = ../../0
/a/b/    -> /a/b/0   = 0
/a/b/    -> /a/c/0   = ../c/0
/a/b/    -> /a/b     = ..
*/

test('handles base cases', () => {
  expect(relative('a', 'a')).toBe('.')
  expect(relative('a', 'b')).toBe('b')
  expect(relative('/', '/')).toBe('.')
  expect(relative('/', '/b')).toBe('b')
  expect(relative('/a/b', '/a/b')).toBe('.')
  expect(relative('//', '/a/b')).toBe('../a/b')

  expect(relative('/a', '/')).toBe('.')
})

test('handles `from`s without trailing slashes', () => {
  expect(relative('/a/b/c', '/a/0')).toBe('../0')
  expect(relative('/a', '/0')).toBe('0')
  expect(relative('/a/b', '/a/0')).toBe('0')
  expect(relative('/a/b', '/a/b/c/0')).toBe('c/0')
  expect(relative('/a/b', '/0')).toBe('../0')
})

test('handles `from`s with trailing slashes', () => {
  expect(relative('/a/b/', '/a/0')).toBe('../0')
  expect(relative('/a/b/', '/a/b/c/0')).toBe('c/0')
  expect(relative('/a/b/', '/0')).toBe('../../0')
  expect(relative('/a/b/', '/a/b/0')).toBe('0')
  expect(relative('/a/b/', '/a/c/0')).toBe('../c/0')
  expect(relative('/a/b/', '/a/b')).toBe('.')
})

test('handles `to`s with trailing slashes', () => {
  expect(relative('/a/b', '/a/c/')).toBe('c/')
  expect(relative('/a/b/', '/a/b/c/d/')).toBe('c/d/')
  expect(relative('/a/b', '/c/')).toBe('../c/')
  expect(relative('/a/b/', '/a/b/c/')).toBe('c/')
  expect(relative('/a/b', '/a/c/d/')).toBe('c/d/')
  expect(relative('/a/b/', '/a/b')).toBe('.')
})

test('handles trailing slashes on both', () => {
  expect(relative('/a/b/', '/a/c/')).toBe('../c/')
  expect(relative('/a/b/', '/a/b/c/d/')).toBe('c/d/')
  expect(relative('/a/b/', '/c/')).toBe('../../c/')
  expect(relative('/a/b/', '/a/b/c/')).toBe('c/')
  expect(relative('/a/b/', '/a/c/d/')).toBe('../c/d/')
  expect(relative('/a/b/', '/a/b/')).toBe('.')
})

test('ignores search and hash params', () => {
  expect(relative('/a/b?q=a/b', '/a/c?q=d/f')).toBe('c?q=d/f')
  expect(relative('/a/b?q=a/b', '/a/c')).toBe('c')
  expect(relative('/a/b', '/a/c?q=d/f')).toBe('c?q=d/f')
  expect(relative('/a/b#q=a/b', '/a/c#q=d/f')).toBe('c#q=d/f')
  expect(relative('/a/b#q=a/b', '/a/c')).toBe('c')
  expect(relative('/a/b', '/a/c#q=d/f')).toBe('c#q=d/f')
  expect(relative('/a/b?q=a/b#r=g/h', '/a/c?q=d/f#s=i/j')).toBe('c?q=d/f#s=i/j')
})

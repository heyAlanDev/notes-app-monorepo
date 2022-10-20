import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { fireEvent, render } from '@testing-library/react'
import Note from './Note'

test('render content', () => {
  const note = {
    content: 'This is a test',
    important: true
  }

  const component = render(<Note note={note} />)

  component.getByText('This is a test')
  component.getByText('make not important')

  // ver dom en consola
  // component.debug()

  // recuperar elementos del dom
  // const li = component.container.querySelector('li')
  // 'mejora' el returno de lo anterior tienes que importarlo del @testing-library/dom
  // console.log(prettyDOM(li))

  // expect(component.content).toHaveTextContent(note.content)
})

test('clicking the button calls event handle once', () => {
  const note = {
    content: 'This is a test',
    important: true
  }

  const mockHandler = jest.fn()

  const component = render(<Note note={note} toggleImportance={mockHandler} />)

  const button = component.getByText('make not important')
  fireEvent.click(button)

  expect(mockHandler).toHaveBeenCalledTimes(1)
})

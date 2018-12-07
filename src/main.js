import createElement from './vdom/createElement';
import render from './vdom/render'

const vApp = createElement('div', {
  attrs: {
    id: 'app'
  },
  children: [
    'Hello world',
    createElement('img', {
      attrs: {
        src: 'https://media.giphy.com/media/cuPm4p4pCIZVC/giphy.gif'
      }
    })
  ]
})

const $app = render(vApp)
console.log($app);

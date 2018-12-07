import createElement from './vdom/createElement';
import render from './vdom/render'
import mount from './vdom/mount'
import diff from './vdom/diff'

const createVApp = count => createElement('div', {
  attrs: {
    id: 'app',
    dataCount: count
  },
  children: [
    'The current count is: ',
    String(count),
    ...Array.from({ length: count}, () => createElement('img', {
      attrs: {
        src: 'https://media.giphy.com/media/cuPm4p4pClZVC/giphy.gif'
      }
    }))
  ]
})

let vApp = createVApp(0)
const $app = render(vApp)
let $rootEl = mount($app, document.getElementById('app'))

setInterval(() => {
  const count = Math.floor(Math.random() * 10)
  const vNewApp = createVApp(count)
  const patch = diff(vApp, vNewApp)
  $rootEl = patch($rootEl)
  vApp = vNewApp
}, 1000);

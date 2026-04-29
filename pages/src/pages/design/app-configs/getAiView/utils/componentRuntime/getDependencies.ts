// ------ taro ------
import * as NutuiIcons from '@nutui/icons-react-taro'
import * as TaroRuntime from './@tarojs/runtime/dist'
import * as TaroComponentsReactOriginal from './taro-components/lib/react/index.js'
// @tarojs/components/lib/react
// /Users/lianglihao/Documents/GitHub/taro/packages/taro-components/lib/react/index.js
import * as TaroComponents from './taro-components/dist/components/index.js'

// import * as T from './dist/components/index.js'
// console.log('[TaroComponents]', Object.keys(TaroComponents))
// console.log('[T]', Object.keys(T))
// @tarojs/components/dist/components/index
import * as TaroFrameworkReact from './@tarojs/plugin-framework-react/dist/runtime'
import * as TaroRouter from './@tarojs/router/dist/index'
import * as ReactDOMClient from 'react-dom/client'
import * as Taro from '@tarojs/plugin-platform-h5/dist/runtime/apis'
import * as TaroShared from '@tarojs/shared'
import TaroStacks from '@tarojs/router/dist/router/stack.js'
import TaroJsTaroLibs from './availableLibraries/taro'
import TaroJsComponentsLibs from './availableLibraries/taroComponents'
import NutuiIconsReactTaroLibs from './availableLibraries/nutuiIcons'

import { Element } from './babelPlugins/runtime'

const TaroComponentsReactDescriptors = Object.getOwnPropertyDescriptors(TaroComponentsReactOriginal)
// 扩展组件
TaroComponentsReactDescriptors.MyBricksElement = {
  configurable: false,
  enumerable: true,
  get() {
    return Element
  }
}
const TaroComponentsReact = Object.defineProperties({}, TaroComponentsReactDescriptors)

const getDependencies = (params) => {
  return {
    '@tarojs/components': {
      version: '4.2.0',
      readme: '',
      module: TaroComponentsReact,
      ...TaroJsComponentsLibs
    },
    '@tarojs/taro': {
      version: '4.2.0',
      module: {
        ...Taro,
        ...TaroFrameworkReact,
        default: {
          ...Taro,
          ...TaroFrameworkReact
        }
      },
      ...TaroJsTaroLibs
    },
    '@nutui/icons-react-taro': {
      version: '3.0.2-cpp.3.beta.9',
      module: NutuiIcons,
      ...NutuiIconsReactTaroLibs
    },
    '@tarojs/runtime': {
      version: '4.2.0',
      readme: '',
      module: TaroRuntime
    },
    '@tarojs/components/dist/components': {
      version: '4.2.0',
      readme: '',
      module: TaroComponents
    },
    '@tarojs/plugin-framework-react/dist/runtime': {
      version: '4.2.0',
      readme: '',
      module: TaroFrameworkReact
    },
    '@tarojs/router': {
      version: '4.2.0',
      readme: '',
      module: TaroRouter
    },
    'react-dom/client': {
      version: '18.3.1',
      readme: '',
      module: ReactDOMClient
    },
    '@tarojs/shared': {
      version: '4.2.0',
      readme: '',
      module: TaroShared
    },
    '@tarojs/router/dist/router/stack.js': {
      version: '4.2.0',
      readme: '',
      module: TaroStacks
    },
  }
}

export default getDependencies

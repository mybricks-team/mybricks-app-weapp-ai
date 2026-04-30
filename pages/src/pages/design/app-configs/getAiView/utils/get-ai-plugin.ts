import AIPlugin, { createRequestAsStream } from '@mybricks/plugin-ai'
import componentRuntime from './componentRuntime'
import promptSections from './promptSections'

export default ({ user, key }: any) => {
  return AIPlugin({
    user,
    key,
    onRequest: (params) => {
      return createRequestAsStream({ useInfra: false })?.(params)
    },
    // ------ taro ------
    componentRuntime,
    promptSections
  })
}

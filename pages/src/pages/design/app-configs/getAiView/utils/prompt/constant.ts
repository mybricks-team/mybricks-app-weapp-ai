export const EXAMPLE_CODE = `
  \`\`\`tsx file="app.config.ts"
  export default defineAppConfig({
    pages: [
      'pages/login/index'
    ],
    window: {
      backgroundTextStyle: 'light',
      navigationBarBackgroundColor: '#fff',
      navigationBarTitleText: 'Login',
      navigationBarTextStyle: 'black'
    }
  })
  \`\`\`

  \`\`\`tsx file="app.tsx"
  import { appRef } from 'mybricks'
  import './app.less'
    
  export default appRef(({ children }) => {
    return children
  })
  \`\`\`

  \`\`\`tsx file="pages/login/index.tsx"
  import { comRef } from 'mybricks'
  import { View, Text, Input } from '@tarojs/components'
  import css from './index.less'

  const Login = comRef(() => {
    return (
      <View className={css.login-container}>
        <Text className={css.title}>Welcome Back</Text>
        <Input
          className={css.input}
          type='text'
          placeholder='Enter your username'
        />
        <Input
          className={css.input}
          type='password'
          placeholder='Enter your password'
        />
      </View>
    )
  })

  export default Login
  \`\`\`

  \`\`\`tsx file="pages/login/index.less"
  .input {
    width: 100%;
    height: 48px;
    line-height: 48px;
    background: #fff;
    border-radius: 12px;
    padding: 0 16px;
    font-size: 16px;
  }
  \`\`\`

  \`\`\`tsx file="pages/login/index.config.ts"
  export default definePageConfig({
    navigationBarTitleText: 'Login'
  })
  \`\`\`
`
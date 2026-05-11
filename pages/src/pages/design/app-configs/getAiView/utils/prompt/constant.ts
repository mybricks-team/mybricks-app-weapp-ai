export const EXAMPLE_CODE = `
  \`\`\`tsx file="app.config.ts"
  export default defineAppConfig({
    pages: [
      'pages/signin/index',
      'pages/signup/index'
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
    
  export default appRef(({ children }) => {
    return children
  })
  \`\`\`

  \`\`\`tsx file="pages/signin/index.tsx"
  import { comRef } from 'mybricks'
  import { View, Text, Button } from '@tarojs/components'
  import css from './index.less'

  const SignIn = comRef(({}) => {
    return (
      <View className={css.container}>
        <Text className={css.title}>登录</Text>
        <View className={css.loginInfo} /** store:loginInfo */>
          {store.welcomeMsg} - {store.userType}
        </View>
        <Button
          className={css.loginBtn}
          /** onClick:signIn */
          /** datasource:clickToSignIn */
          onClick={() => {
            store.signIn();
          }}
        >
          登录
        </Button>
      </View>
    )
  })

  export default SignIn
  \`\`\`

  \`\`\`tsx file="pages/signin/index.config.ts"
  export default definePageConfig({
    navigationBarTitleText: '登录'
  })
  \`\`\`

  \`\`\`tsx file="pages/signup/index.tsx"
  import { comRef } from 'mybricks'
  import { View, Text, Button } from '@tarojs/components'
  import css from './index.less'

  const StepRegisterForm = comRef(({}) => {
    return (
      <View className={css.form}>
        <Button
          className={css.registerBtn}
          /** onClick:signUp */
          /** datasource:clickToSignUp */
          onClick={() => {
            store.signUp();
          }}
        >注册</Button>
      </View>
    )
  })

  const SignUp = comRef(() => {
    return (
      <View className={css.container}>
        <Text className={css.title}>注册</Text>
        <StepRegisterForm />
      </View>
    )
  })

  export default SignUp
  \`\`\`

  \`\`\`tsx file="pages/signup/index.config.ts"
  export default definePageConfig({
    navigationBarTitleText: '注册'
  })
  \`\`\`
`
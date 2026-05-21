const EXAMPLE_CODE = `
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
  import './app.less'

  /**
   * @mybricks
   * name: default
   * title: 登录/注册应用入口
   * summary: 应用根节点，通过路由提供登录页与注册页的切换与展示。
   * type: app
   */
  export default appRef(({ children }) => {
    return children
  })
  \`\`\`

  \`\`\`tsx file="pages/signin/index.tsx"
  import { useState } from 'react'
  import dataSource from '../../dataSource'
  import { comRef } from 'mybricks'
  import { View, Text, Button } from '@tarojs/components'
  import css from './index.module.less'

  /**
   * @mybricks
   * name: SignIn
   * title: 登录页
   * summary: 用户登录入口页，提供登录按钮并触发 signIn 完成登录。
   * type: page
   * datasource:
   *   signInBtn:
   *     signIn:
   *       desc: 点击登录按钮调用登录接口 dataSource.signIn 完成登录
   * state:
   *   loginInfo:
   *     welcomeMsg:
   *       desc: 展示欢迎语
   *     userType:
   *       desc: 展示用户类型
   *   signInBtn:
   *     loading:
   *       desc: 登录接口请求中的加载状态
   * events:
   *   signInBtn:
   *     onClick:
   *       title: 登录
   *       mermaid: 'flowchart LR; A["校验登录参数"] --> B{"参数是否有效"} -->|有效| C["设置loading状态"] --> D["请求登录接口"] --> E{"请求是否成功"} -->|成功| F["更新用户状态"] --> G["取消loading状态"]; E -->|失败| H["提示错误信息"] --> G; B -->|无效| I["提示参数错误"]'
   */
  const SignIn = comRef(({}) => {
    const [welcomeMsg, setWelcomeMsg] = useState('')
    const [userType, setUserType] = useState('')
    const [loading, setLoading] = useState(false)

    const handleSignIn = async () => {
      setLoading(true)
      try {
        const res = await dataSource.signIn({})
        setWelcomeMsg(res.welcomeMsg)
        setUserType(res.userType)
      } finally {
        setLoading(false)
      }
    }

    return (
      <View className={css.container}>
        <Text className={css.title}>登录</Text>
        <View className={css.loginInfo}>
          {welcomeMsg} - {userType}
        </View>
        <Button
          className={\`\${css.signInBtn}\${loading ? \` \${css.loading}\` : ''}\`}
          onClick={handleSignIn}
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
  import { useState } from 'react'
  import dataSource from '../../dataSource'
  import { comRef } from 'mybricks'
  import { View, Text, Button } from '@tarojs/components'
  import css from './index.module.less'

  /**
   * @mybricks
   * name: StepRegisterForm
   * title: 注册表单区块
   * summary: 注册表单容器，包含注册按钮，提交时触发 signUp。
   * type: com
   * datasource:
   *   registerBtn:
   *     signUp:
   *       desc: 点击注册按钮调用注册接口 dataSource.signUp 完成注册
   * state:
   *   registerBtn:
   *     loading:
   *       desc: 注册接口请求中的加载状态
   * events:
   *   registerBtn:
   *     onClick:
   *       title: 注册
   *       mermaid: 'flowchart LR; A["校验表单参数"] --> B{"参数是否有效"} -->|有效| C["设置loading状态"] --> D["请求注册接口"] --> E{"请求是否成功"} -->|成功| F["跳转登录页"] --> G["取消loading状态"]; E -->|失败| H["提示错误信息"] --> G; B -->|无效| I["提示参数错误"]'
   */
  const StepRegisterForm = comRef(({}) => {
    const [loading, setLoading] = useState(false)

    const handleSignUp = async () => {
      setLoading(true)
      try {
        await dataSource.signUp({})
      } finally {
        setLoading(false)
      }
    }

    return (
      <View className={css.form}>
        <Button
          className={\`\${css.registerBtn}\${loading ? \` \${css.loading}\` : ''}\`}
          onClick={handleSignUp}
        >注册</Button>
      </View>
    )
  })

  /**
   * @mybricks
   * name: SignUp
   * title: 注册页
   * summary: 用户注册入口页，内嵌注册表单组件完成填写与提交。
   * type: page
   */
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

const promptSections = {
  developeGuide: {
    /**
     * 画布宽度：默认为414px
     * 拆分逻辑：页面在app.config.ts中的pages进行配置，如果是tab页，需要配置pages以及tabBar.list
     * 没有「开发指南」
     * 拆分加入tab页说明
     */
    firstOfAll: `- 开发宪章
> 严格基于 **Taro 4.x 跨端框架**，适配 **H5 + 全平台小程序** 多端场景，参考「开发指南」+「源代码」进行代码开发任务，必须遵循「最佳实践」和「设计规范」，在编写各类型文件时，按照「文件编写规范」完成代码任务；JSDoc 注释属于代码的一部分，需要在编写节点代码时同步维护；完成代码任务后，遵循「文档规范」同步 requirement.md。

- 总体规则
  - 功能：生产级别的功能性；
  - 细节：在每个细节都精心完善；
  - 响应式：保证合理统一的间距，以及支持宽度变化自适应的代码；
  - 画布宽度：414px；
- 拆分逻辑
  - 精准识别到底是页面还是弹窗，对其进行拆分，如果是页面，需要在\`app.config.ts\`中的pages进行配置，如果是tab页，需要同时在\`app.config.ts\`中的pages以及tabBar.list进行配置， 如果是弹窗，需要使用popupRef；
  - tab页判断原则，tabBar 代表「多入口并列切换」的导航结构，不是多页面应用的标配。判断标准：
    - 需要 tabBar：需求中明确出现多个平级主功能模块可以来回切换（如首页/我的），页面关系是「并列」而非「跳转」；
    - 不需要 tabBar：登录、注册、详情、功能流程等场景，即使包含多个页面，页面间是跳转关系，不是并列切换；
    - 如果用户明确表达了需要使用tab切换页面，即使是登录、注册等上述提到的不需要tabBar判断，也以用户需求为准；
  - 我们特别希望在设计态能够展示所有页面和弹窗，方便用户进行调试；`,
  /**
   * 说明图标库
   */
  assetsUsageSection: `- 对于图标：为了保证视觉的统一与专业性，我们的共识是统一使用图标组件，当图标组件无法表达对应的语义时考虑使用图片替代。目前提供的图标库如下
  - @nutui/icons-react-taro
- 对于图片：图片是传递信息与氛围的关键。我们建议根据其用途选择合适的来源：
  - https://ai.mybricks.world/image-search?term=searchWord&w=20&h=20，可以配置一个高质量的写实图片（比如摄影、人文等）；
  具体来说
  - 对于海报/写实/商品/图片等：我们建议使用高质量的写实图片；
  - 对于Logo：我们建议使用色块+文本占位；
  - 对于插画/装饰性图形：我们优先推荐使用简单的svg来占位，避免使用图片过于跳脱；`,
    /**
     * 文件结构描述
     * 应用入口、页面说明
     * jsx -> tsx
     * 去除less中:frame相关内容
     * js -> ts
     * store constructor说明跳转，禁止初始化前提补充允许makeAutoObservable
     * 去除典型拆分案例，后续可补充
     */
    architectureSection: `\`\`\`
├─ app.config.ts          # 应用入口，app配置，有且仅有一个，必须写在根路径，文件名必须为app.config.ts
├─ app.tsx                # 应用渲染入口，有且仅有一个，必须写在根路径，文件名必须为app.tsx
├─ app.less               # 全局样式（项目唯一文件且必须）
├─ dataSource.ts          # 项目唯一文件，必须
├─ setup.ts               # 项目唯一文件，必须
├─ requirement.md         # 需求文档（又名prd、PRD，在最后写入）
├─ hooks                  # 可选，可复用的全局自定义 hooks 目录
|  ├── useXxx.ts          # 每个 hook 单独一个文件，文件名与 hook 同名
|  └── useYyy.ts
├─ pages
|  └── index
|     ├── index.tsx
|     ├── index.module.less
|     └── hooks           # 可选，该页面/组件的自定义 hooks 目录
|        ├── useXxx.ts    # 每个 hook 单独一个文件，文件名与 hook 同名
|        └── useYyy.ts
|  └── detail
|     ├── index.tsx
|     ├── index.module.less
└─ components             # 可复用公共组件目录，所有跨页面复用的组件统一存放
   └── card
      ├── index.tsx
      ├── index.module.less
      └── hooks
         └── useXxx.ts
\`\`\`

> 项目支持渐进式渲染，初始化项目时，建议将入口和公共文件先初始化好，再按照页面进行初始化。

#### 页面与组件的文件拆分
- app.config.ts：应用入口，有且仅有一个，且必须写在根路径的 \`app.config.ts\` 中；
- app.tsx：应用渲染入口，有且仅有一个，且必须写在根路径的 \`app.tsx\` 中；
- pages/xxx：页面，每个页面必须单独拆到**文件夹**中，例如 \`pages/index/index.tsx\`、\`pages/detail/index.tsx\`；
- 组件：公共可复用组件，所有能在多个页面中重复使用的功能组件，必须统一放在 components/ 目录下，每个组件独立创建文件夹存放；

> 拆分仅作为结构处理，建议的开发顺序是完成基础架构的代码、然后按页面维度一个一个完成需求。

#### tsx 文件编写规范
1. 必须使用 TypeScript，所有组件 props、state、函数参数和返回值都需要有明确的类型定义；
2. 组件状态和业务逻辑封装在组件内部，使用 useState、useReducer 等 React hooks 管理状态；
3. 当逻辑相对独立或较为复杂时，抽取到同级 \`hooks/\` 文件夹中，每个自定义 hook 单独一个文件（如 \`hooks/useXxx.ts\`）；
4. 禁止编写未实现的事件函数；
5. 对于浮层类组件，如弹窗、抽屉等，控制浮层的显示/打开/弹出/隐藏状态的变量使用 useState 维护，禁止设置为固定值；
6. 所有来自三方库的组件都必须带有 className 属性，值需语义化明确且唯一，无论是否需要样式，以便通过 CSS 选择器选中；
  - \`<View className={css.xxx}/>\`
7. 所有html元素都必须具有语义化的 className，无论是否需要样式，以便通过 CSS 选择器选中；
  - \`<View className={css.xxx}/>\`
8. 所有与样式相关的内容都要写在 less 文件中，避免在 tsx 中通过 style 编写；
9. 各类动效、动画等，尽量使用 css3 的方式在 less 中实现，不要为此引入任何的额外类库；
10. 禁止出现直接引用标签的写法，例如 \`<Tags[XX] property={'aa'}/>\`，正确的写法是先定义 \`const XX = Tag[XX]; <XX property={'aa'}/>\`；
11. 所有列表中的组件，必须通过 key 属性做唯一标识，不要使用 index 作为 key；

comRef 说明：
- comRef 是 MyBricks 提供的高阶函数，用于创建一个组件；

popupRef 说明：
- popupRef 是 MyBricks 提供的高阶函数，用于创建浮层类组件（弹窗、抽屉等）；

#### less 文件编写规范
1. 样式文件命名规则：格式为 \`*.module.less\` 的文件，编译时自动启用**CSS Module**模块化处理；格式为 \`*.less\` 的文件编译时不开启CSS Module；
2. 开发优先统一使用 \`*.module.less\` 格式编写样式，从根源避免全局样式污染、样式重叠冲突问题；
3. :frame 配置规则（仅页面和浮层类组件需要，普通组件不需要）：
   - 每个页面（page），必须配置 :frame { width }，宽度参考设计稿或 1440px（若无设计稿）；
   - 每个浮层类组件（由 popupRef 创建的组件），必须配置 :frame { width; height }，宽度与页面保持一致（同为 1440px 或设计稿宽度），高度在弹窗内容实际高度基础上额外增加 200～300px，以留出遮罩层空间（如内容约 400px 则配置 height: 650px）；
   - :frame 只控制画布尺寸，不影响运行时布局，必须放在所有 CSS 类之前；
   - :frame 只在首次创建页面或浮层类组件或者有重大 UI 重构时才需要重新估算；
   - 页面根组件用宽度100%适配:frame 宽度；
3. 在选择器中，多个单词之间使用驼峰方式，不能使用 - 连接；
4. 所有容器类的样式必须包含 \`position: relative\`；
5. 尽量不要用 calc 等复杂的计算；
6. 动效、动画等效果，尽量使用 css3 的方式实现，例如 transition、animation 等；
7. 不使用 :before、:after 等伪类选择器来实现 dom；

#### hooks/ 文件夹编写规范
当组件内存在相对独立、可复用或逻辑复杂的逻辑时，将其抽取为自定义 hook，放在同级 \`hooks/\` 文件夹中，每个 hook 对应一个独立文件。

使用原则：
- hooks 以文件夹形式存放，目录名必须是 \`hooks\`，位于组件或页面同级；
- 每个 hook 单独一个文件，文件名与 hook 名相同（如 \`useXxx.ts\`），存放在 \`hooks/\` 目录下；
- 每个自定义 hook 以 \`use\` 开头命名；
- hook 应内部管理自己的副作用，不对外暴露命令式方法；把需要响应的数据作为参数传入 hook，hook 内部用 \`useEffect\` 监听并处理；
- 禁止把「何时初始化/何时更新」的控制权暴露给外部：
  - 错误：hook 暴露 \`setXxx\` / \`initXxx\` 方法，由外部在 \`useEffect\` 里手动调用；
  - 正确：把需要响应的数据作为参数传入 hook，hook 内部决定如何响应；
- 当多个组件需要共享逻辑时，提取到上层公共 \`hooks/\` 目录中；

#### 日志规范
项目中必须使用 mybricks 提供的 \`logger\` 工具打印日志，禁止使用 console.log / console.warn / console.error 等原生方法。

必须在以下所有场景中打印足量日志，确保运行时行为可追踪、可排查：
1. 用户交互事件：所有 onClick、onChange、onBlur 等事件触发时，打印 logger.info 记录操作行为及关键参数；
2. 数据请求：接口调用前打印 logger.info 记录请求参数，请求成功后打印 logger.info 记录返回数据摘要，请求失败时打印 logger.error 记录错误信息；
3. 状态变更：组件或 hook 中任何状态更新时，打印 logger.info 记录更新内容及关键参数；
4. 条件分支与异常：进入关键条件分支时打印 logger.info 说明走了哪个分支；try-catch 中 catch 块必须打印 logger.error 记录异常；
5. 路由跳转：导航跳转时打印 logger.info 记录目标路径；
6. 任何可能失败的操作（如数据解析、类型转换等）都需要用 try-catch 包裹，并在 catch 中使用 logger.error 打印错误详情；

日志格式要求：
- 日志消息应包含上下文前缀，便于定位来源，格式推荐：\`[组件名/方法名] 具体描述\`；
- 示例：\`logger.info('[UserList/fetchUsers] 开始请求用户列表', { page: 1 })\`；
- 错误日志必须携带 error 对象：\`logger.error('[loadData] 数据加载失败', error)\`；

重复结构处理：当一个区块内存在多个「结构相同、仅数据不同」的重复单元时，必须拆成「容器 + 单项」两层：
- 容器（comRef）：负责布局与数据遍历，用 map 渲染单项；
- 单项（comRef）：描述单条数据的 UI，通过 props 接收单条数据；
- 禁止在容器中直接内联重复的 JSX 块；

命名与实现：
- 命名：使用语义化 PascalCase，名称应直接反映其在页面中的位置与职责；
- 实现：每个独立区块写成 \`const 区块名 = comRef(...)\`；
- 区块独立性：父组件只负责布局与子区块挂载，状态和业务逻辑各自在组件内部或对应 hook 中管理；
`,
  /**
   * 案例
   */
  examplesSection: `
<example>
  <user_query>开发一个登录页面</user_query>
  <assistant_response>
  好的，这是一个空项目，我将为您从0开始开发登录页。
  
  首先使用init-project来快速生成代码文件，然后确认渲染情况，最后同步文档。
  ${EXAMPLE_CODE}
  </assistant_response>
</example>
`
  },
  /**
   * 布局上
   *  - 底部导航栏通过配置实现，后续添加自定义tabbar能力
   *  - [TODO] 顶部状态栏，小程序自带的按钮 - APP顶部状态栏和小程序右上角系统胶囊按钮区域（… / ○，返回/更多），它不是页面设计的一部分，不需要设计
   */
  designGuide: {
    firstOfAll: `美学指南：
- 在浅色和深色主题、不同字体、美学之间变化；
注意：永远不要使用通用的AI生成美学、陈词滥调的配色方案（特别是白色背景上的紫色渐变）、可预测的布局，以及缺乏特征的千篇一律的设计。

总体布局：
- 底部导航栏：必须通过 \`app.config.ts\` 配置 tabBar 实现，禁止编码实现；`,
  },
  /**
   * 模块 -> 应用
   * jsx -> tsx
   * Route 相关描述去除、调整
   * 去除废弃的 service.js 内容
   */
  documentGuide: {
    firstOfAll: `
### JSDoc 注释
编写或修改 appRef / comRef / popupRef 节点代码时，必须为每一个节点同步编写或更新对应的 JSDoc 注释说明。JSDoc 注释属于代码的一部分，承载原 README.md 中的代码可视化说明信息，必须与节点代码一起生成、一起维护。禁止只给页面节点、根节点或少数组件写注释。
维护时机：
- 必须维护（强约束）：节点缺少 JSDoc 注释；或现有注释内容与「注释编写规范」不符；或需求明确要求更新注释（此时必须重新逐行审查源码与注释的差异，确保注释完全对齐当前源码，包括 events/datasource/state 的 className 标识、字段、流程图等）；或需求明确要求更新文档，注意用户要求的更新文档也包括了JSDoc注释；
- 建议更新（结构或内容变化）：在 tsx 中新增、删除或重命名了 appRef/comRef 节点，或通过 \`app.config.ts\` 的 pages 注册的页面组件发生变化；export default 的根节点类型或子节点类型组合发生变化导致标题层级需调整；JSX 中新增、删除或修改了带事件 props（onClick 等）的元素，或其 className 发生变化；JSX 中新增、删除或修改了渲染组件内状态（useState/useReducer 等 hooks 管理的状态）的元素，或其 className 发生变化；JSX 中新增、删除或修改了触发 datasource 调用的元素，或其 className 发生变化；某节点的 UI 结构、交互或业务含义发生明显变化；
- 无需更新：tsx 未被修改，且现有 JSDoc 注释已正确反映当前源码的节点结构、事件与说明；仅修改了 style.less 等与节点行为无关的文件；
<JSDoc 注释编写规范>
  <节点>
  按「在 JSX 中依赖顺序」为每个节点分别写出 JSDoc 注释。
  - appRef 应用节点
  - 页面节点：通过 \`app.config.ts\` 的 pages 注册的页面视为页面节点
  - comRef 组件节点（未通过 \`app.config.ts\` 的 pages 注册的）
  - popupRef 浮层节点
  - 【强制】所有 appRef / comRef / popupRef 声明都必须有 JSDoc 注释，包括页面内拆分的辅助 comRef、列表单项 comRef、弹窗 popupRef、export default comRef/appRef；不得只给通过 \`app.config.ts\` 的 pages 注册的页面组件或根节点写注释。
  </节点>

  <注释位置>
  - export default appRef/comRef/popupRef：JSDoc 写在 export default 语句正上方；
  - const Xxx = appRef/comRef/popupRef(...)：JSDoc 写在 const 声明正上方；
  - 子节点注释紧跟其节点声明，不集中写在文件顶部或底部；
  - 已存在 JSDoc 时直接更新原注释，禁止新增重复注释。
  </注释位置>

  <节点说明>
  每个节点 JSDoc 统一使用 @mybricks 自定义 tag 承载结构化信息，@mybricks 下方直接书写缩进结构；字段名保持稳定，字段内容按原 README.md 的语义填写。不要使用多层 Markdown 列表或代码围栏表达结构化数据。
  - name：节点名称，对应代码中节点变量声明的变量名，如果是export default 导出，则对应文件名；
  - title：根据节点内容与名称写出简洁的语义化标题，体现节点职责，避免与组件名简单重复（如组件叫 SignIn 时 title 可用「登录页」而非「登录」）；
  - summary：对节点的用途、场景或关键行为做简短说明，补充 title 未涵盖的信息，避免与 title 重复或仅罗列 UI 元素；
  - type：app | page | com | popup，其中 app 对应 appRef，page 对应通过 \`app.config.ts\` 的 pages 注册的 comRef（页面组件），com 对应 comRef（非路由页面），popup 对应 popupRef。
  - datasource：该组件内触发的 dataSource.ts 接口调用列表（找最近的组件，而不是页面）
    > 触发机制：JSX 中的事件处理器或 React hooks（如 useEffect、useCallback 等）直接调用 dataSource.ts 中的函数发起 HTTP 请求。JSDoc 的 datasource 字段记录的是实际调用到 dataSource.ts 中哪个函数。
    > 判断标准：组件代码（事件处理函数、hooks 回调等）中有 \`await dataSource.xxx()\` 或 \`dataSource.xxx()\` 调用，则该调用必须记录在 datasource 字段中，api 名称对应 dataSource.ts 中的函数名。
    1. datasource 不一定能稳定归属到某个 JSX 标签，因此写在最近的 appRef/comRef/popupRef 节点 JSDoc 中
    2. 每条接口调用用缩进对象结构描述，包含以下字段：
      className（对应触发接口调用的元素 className）:
        api（dataSource.ts 中导出的真实函数名，如 signIn、fetchUserList 等）:
          desc: 用途说明
    3. 特殊情况：当接口调用由 React hooks（如 useEffect）在组件初始化时发起、不属于任何具体交互元素时，使用「root」作为标识，表示「该组件挂载时的初始化请求」；如果接口调用是由某个具体的交互元素（如按钮、表单）触发的，必须使用该元素的 className 作为标识，禁止错误地归到「root」下
    4. 【严禁重复】datasource 注释必须以 com 节点为最小单位归属：接口调用发生在哪个 comRef/popupRef 的 JSX 作用域内，就只写在该节点注释中，其父节点禁止重复声明。
    5. 无接口调用直接省略 datasource 字段，禁止出现「(无接口调用)」或空对象，不写即代表无调用
    6. 【强制扫描】编写 datasource 注释前，必须仔细阅读组件代码，检查每个事件处理函数与 React hooks 回调体内是否有 dataSource.xxx() 的调用；凡是有调用的，无论由按钮触发还是由 useEffect 触发，都必须记录到 datasource 字段中。
  - state：该组件内渲染到 JSX 的 React 状态列表（useState/useReducer 等 hooks 管理的状态，找最近的组件，而不是页面）
    1. state 不一定能稳定归属到某个 JSX 标签，因此写在最近的 appRef/comRef/popupRef 节点 JSDoc 中；如果状态值直接渲染在 JSX 标签上，用该标签的 className 作为标识；【强制前提】渲染状态的元素必须有 className，如果源码中缺少，必须先在代码中补上 className，再写注释
      - 在子节点中直接渲染：\`<View className={css.xxx}>{someState}</View>\`
      - 通过 prop 传入：\`<Image className={css.xxx} src={imageUrl} />\`（imageUrl 为 state 变量）
    2. 每个 className 下描述该元素渲染的状态变量及用途：
      className（对应渲染状态的元素 className）:
        状态变量名（组件内 useState/useReducer 声明的变量名）:
          desc: 用途说明
        状态变量名:
          desc: ...
    3. 「root」使用条件（极端严格限制）：**只有当该组件的 JSX 根元素自身没有 className，且直接在根元素上渲染了状态数据**时，才允许使用「root」作为标识。绝对禁止将子孙元素渲染的状态写在「root」下——子孙元素必须用其自身的 className 作为标识，哪怕需要先在代码中补上 className 再写注释。
    4. 每一个组件，如果在代码层面没有将 React 状态用于 JSX 的 UI 渲染（即状态只用于逻辑控制、不直接影响视觉输出），禁止编写 state 信息；即使子组件使用了，也不应该使用 root，以实际代码情况为准；
    5. 【严禁重复】state 注释必须以 com 节点为最小单位归属：如果状态是在某个子 com 节点内消费的，则 state 条目只能写在该 com 节点注释中，其父节点（page 或上层 com）禁止重复声明相同的 state 条目。判断标准：状态的实际渲染发生在哪个 comRef/popupRef 的 JSX 作用域内，就归属于哪个节点，不随层级向上传递。
    6. 无状态渲染直接省略 state 字段，禁止出现「(无状态渲染)」或空对象，不写即代表无状态渲染
    7. 【精确粒度】className 标识必须是实际渲染状态的那个元素的 className，而不是其父容器的 className。例如：\`<View className={css.card}><Text className={css.userName}>{userName}</Text></View>\`，state 标识应该是 \`userName\`，而不是 \`card\`。
    8. 【严禁】禁止将外部来源的值计入 state 字段，state 字段仅用于记录组件自身通过 React hooks 管理的状态
  - events：该组件内所有带事件 props 的交互元素列表，写在最近的 appRef/comRef/popupRef 节点 JSDoc 中
    1. 【强制前提】带事件的元素必须有 className，如果源码中缺少，必须先在代码中补上 className，再写事件注释；
    2. 每个事件用 className 作为标识，每个 className 下描述该元素上的事件及其流程图：
      className（对应带事件的元素 className）:
        事件名（如 onClick、onChange、onBlur 等）:
          title: 简短中文说明（如 登录）
          mermaid: 根据事件内容生成对应的 Mermaid 语法流程图（以 flowchart LR; 开头，单行书写）
          relations:（可选）事件如果涉及打开弹窗、跳转页面，则需要声明关联节点及关系类型
            关联的弹窗或页面的名称，即对应的节点名称
              type: 关系类型（page，popup），打开弹窗使用popup，跳转页面使用page
    3. 【严禁重复】events 注释必须以 com 节点为最小单位归属：事件发生在哪个 comRef/popupRef 的 JSX 作用域内，就只写在该节点注释中，其父节点禁止重复声明。
    4. 无交互事件直接省略 events 字段，禁止出现空对象，不写即代表无事件
    5. 【严禁使用 root 作为 key】events 字段下的每个 key 必须是带事件的元素的 className，绝对禁止使用「root」作为 events 的 key。events 只描述具体元素或组件的 onXXX 实现，不存在「整个根节点」的事件。如果某元素没有 className，必须先在代码中补上 className，再以该 className 作为 key。
  关于 Mermaid 语法流程图需关注以下规则和要求：
  - 流程图方向统一用 LR（从左到右），节点文本全部用双引号包裹；
  - 条件判断节点用 {} 包裹，分支标注用 |标注内容| 写在箭头上；
  - 【重要】判断节点的分支必须分开写：从判断节点出发，每个分支单独写一条「箭头」，用分号分隔多条语句。正确示例：B{"是否展开"} -->|是| C["移除"]; B -->|否| D["添加"]。错误示例：B{"是否展开"} -->|是| C["移除"] -->|否| D["添加"]；
  - 每条语句末尾加分号分隔，最后一条语句后不加分号；
  - 生成后先自检：检查是否有多余分号、引号是否统一、节点连接是否完整（无断链、无悬空节点）、每个判断分支是否都从判断节点单独引出；
  - 流程图逻辑要贴合需求，节点命名简洁易懂，避免冗余步骤；
  - 流程图需覆盖全链路：事件处理函数与 hooks 回调的完整逻辑均需展开，从触发到结束完整呈现；
  - 禁止出现「调用 XX API」「调用 XX 函数」等无意义节点，所有 API 及函数调用均须展开其内部逻辑，写出完整流程；
  - 流程图节点用动作描述，不写具体取值：例如用「设置loading状态」「取消loading状态」，禁止「设置loading为true」「设置loading为false」等；
  - 禁止出现用户动作类流程节点（如「点击按钮」）、空洞节点（如「开始」「结束」「执行业务操作」）；
  - 流程图须真实完整：严格依据事件处理函数与 hooks 回调内的实际代码逻辑来绘制，不省略、不捏造。
  - 分支流程必须完整表达：代码中的 if/else、三元判断、early return、请求成功/失败等所有分支，都必须在流程图中用条件节点 {} 和 |分支标注| 画出；每个分支（如「通过」「不通过」「成功」「失败」）及其后续步骤都须独立延伸，不得只写主流程而省略条件分支。
  </节点说明>
</JSDoc 注释编写规范>

<基于 tsx 的 JSDoc 注释示例>
如果某一个组件源代码如下（包含 dataSource.ts 接口文件、各页面的 tsx 文件），可以看到有三个comRef（其中两个为页面节点）、一个appRef，所以需要为一个app节点、两个页面节点、一个组件节点分别补充 JSDoc 注释。每个 appRef / comRef / popupRef 声明都必须有自己的 JSDoc 注释。

注意：datasource 字段记录的 api 名称，必须是 dataSource.ts 文件中真实导出的函数名。判断是否需要写 datasource，关键是看组件代码（事件处理函数、hooks 回调等）中是否有 dataSource.xxx() 的直接调用。

\`\`\`ts
// dataSource.ts —— 项目唯一的接口文件，所有 HTTP 请求都定义在这里
import { DataSource } from "mybricks";

interface LoginParams {
  username: string;
  password: string;
}

interface LoginResult {
  status: number;
  data?: {
    token: string;
    user: {
      id: number;
      name: string;
    };
  };
}

class MyDatasource extends DataSource {
  async signIn(params: LoginParams): Promise<LoginResult> {
    return this.axios.post("/api/sign-in", params);
  }

  async signUp(params: LoginParams): Promise<LoginResult> {
    return this.axios.post("/api/sign-up", params);
  }
}

export default new MyDatasource();
\`\`\`

\`\`\`tsx
// pages/signin/index.tsx 和 pages/signup/index.tsx 合并展示
import { useState } from 'react';
import dataSource from '../../dataSource';
import { comRef, appRef } from 'mybricks'
import { View, Text, Button, Form } from '@tarojs/components'

/**
 * @mybricks
 * name: StepRegisterForm
 * title: 注册表单区块
 * summary: 注册表单容器，包含表单与注册按钮，提交时触发 signUp。
 * type: com
 * datasource:
 *   signUpBtn:
 *     signUp:
 *       desc: 点击注册按钮调用注册接口 dataSource.signUp 完成注册
 * state:
 *   signUpBtn:
 *     loading:
 *       desc: 注册接口请求中的加载状态
 * events:
 *   signUpBtn:
 *     onClick:
 *       title: 注册
 *       mermaid: 'flowchart LR; A["校验表单参数"] --> B{"参数是否有效"} -->|有效| C["设置loading状态"] --> D["请求注册接口"] --> E{"请求是否成功"} -->|成功| F["跳转登录页"] --> G["取消loading状态"]; E -->|失败| H["提示错误信息"] --> G; B -->|无效| I["提示参数错误"]'
 */
const StepRegisterForm = comRef(({}) => {
  const [loading, setLoading] = useState(false);

  const handleSignUp = async () => {
    setLoading(true);
    try {
      await dataSource.signUp(); // 直接调用 dataSource.signUp
    } finally {
      setLoading(false);
    }
  };

  return (
    <View>
      <Form />
      <Button
        className={\`\${css.signUpBtn}\${loading ? \` \${css.loading}\` : ''}\`}
        onClick={handleSignUp}
      >注册</Button>
    </View>
  )
})

/**
 * @mybricks
 * name: SignUp
 * title: 注册页
 * summary: 用户注册入口页，内嵌注册表单组件完成填写与提交。
 * type: page
 */
const SignUp = comRef(() => {
  return (
    <View>
      <Text>注册</Text>
      <StepRegisterForm />
    </View>
  )
})

/**
 * @mybricks
 * name: SignIn
 * title: 登录页
 * summary: 用户登录入口页，提供登录按钮并触发 signIn 完成登录。
 * type: page
 * datasource:
 *   signInBtn:
 *     signIn:
 *       desc: 点击登录按钮调用登录接口 dataSource.signIn 完成登录
 * state:
 *   loginInfo:
 *     welcomeMsg:
 *       desc: 展示欢迎语
 *     userType:
 *       desc: 展示用户类型
 *   signInBtn:
 *     loading:
 *       desc: 登录接口请求中的加载状态
 * events:
 *   signInBtn:
 *     onClick:
 *       title: 登录
 *       mermaid: 'flowchart LR; A["校验登录参数"] --> B{"参数是否有效"} -->|有效| C["设置loading状态"] --> D["请求登录接口"] --> E{"请求是否成功"} -->|成功| F["更新用户状态"] --> G["取消loading状态"]; E -->|失败| H["提示错误信息"] --> G; B -->|无效| I["提示参数错误"]'
 */
const SignIn = comRef(({}) => {
  const [welcomeMsg, setWelcomeMsg] = useState('');
  const [userType, setUserType] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSignIn = async () => {
    setLoading(true);
    try {
      const res = await dataSource.signIn({}); // 直接调用 dataSource.signIn
      setWelcomeMsg(res.welcomeMsg);
      setUserType(res.userType);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View>
      <Text>登录</Text>
      <View className={css.loginInfo}>
        {welcomeMsg} - {userType}
      </View>
      <Button
        className={\`\${css.signInBtn}\${loading ? \` \${css.loading}\` : ''}\`}
        onClick={handleSignIn}
      >
        登录
      </Button>
    </View>
  )
})

/**
 * @mybricks
 * name: default
 * title: 登录/注册应用入口
 * summary: 应用根节点，通过路由提供登录页与注册页的切换与展示。
 * type: app
 */
export default appRef(({ children }) => {
  return children
})
\`\`\`
</基于 tsx 的 JSDoc 注释示例>
`,
  }
}

export default promptSections

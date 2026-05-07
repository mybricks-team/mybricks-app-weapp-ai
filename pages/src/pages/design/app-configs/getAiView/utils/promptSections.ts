const EXAMPLE_CODE = `
  \`\`\`tsx file="app.config.ts"
  export default defineAppConfig({
    pages: [
      'pages/signIn/index',
      'pages/signUp/index'
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

  \`\`\`tsx file="pages/signIn/index.tsx"
  import { comRef } from 'mybricks'
  import { View, Text, Button } from '@tarojs/components'
  import store from './store'

  const NewsList = comRef(() => {
    return (
      <View /** datasource:newsListApi */>
        {store.newsList?.map(news => (
          <View key={news.id}>
            <Text>{news.title}</Text>
            <Text>{news.summary}</Text>
          </View>
        ))}
      </View>
    )
  })

  const SignIn = comRef(() => {
    useEffect(() => {
      store.fetchNewsList();
    }, []);

    return (
      <View>
        <Text>登录</Text>
        <NewsList />
        <Button
          /** onClick:signIn */
          /** datasource:signInApi */
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

  \`\`\`tsx file="pages/signIn/index.config.ts"
  export default definePageConfig({
    navigationBarTitleText: 'SignIn'
  })
  \`\`\`

  \`\`\`tsx file="pages/signUp/index.tsx"
  import { comRef } from 'mybricks'
  import { View, Text, Button, Form } from '@tarojs/components'
  import store from './store'

  const StepRegisterForm = comRef(({}) => {
    return (
      <View>
        <Form />
        <Button
          /** onClick:signUp */
          /** datasource:signUpApi */
          onClick={() => {
            store.signUp();
          }}
        >注册</Button>
      </View>
    )
  })

  const SignUp = comRef(() => {
    return (
      <View>
        <Text>注册</Text>
        <StepRegisterForm />
      </View>
    )
  })

  export default SignUp
  \`\`\`

  \`\`\`tsx file="pages/signUp/index.config.ts"
  export default definePageConfig({
    navigationBarTitleText: 'SignUp'
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
> 严格基于 **Taro 4.x 跨端框架**，适配 **H5 + 全平台小程序** 多端场景，参考「总体规则」+「源代码」进行代码开发任务，必须遵循「最佳实践」和「设计规范」，在编写各类型文件时，按照「文件编写规范」完成代码任务后，遵循「文档规范」进行文档（README 和 requirement两个文件）的同步。

- 技术栈
  - 核心框架：Taro 4.x（H5 + 多端小程序跨端开发）
  - 开发语言：React + TypeScript
  - 样式语言：Less
- 总体规则
  - 功能：生产级别的功能性；
  - 细节：在每个细节都精心完善；
  - 响应式：保证合理统一的间距，以及支持宽度变化自适应的代码；
  - 画布宽度：414px；
  - 组件的事件注释：任何事件都必须包含注释「/** 事件名:事件key */」注释；
  - 组件的接口使用注释：JSX 标签内调用或使用接口数据必须包含注释「/** datasource:唯一key */」，这个 key 必须保证全局唯一，即使同一个接口会被不同组件调用或使用；函数体内和 hooks 内的接口调用和读取不需要写注释，直接在 README.md 里使用 root 作为唯一 key 描述即可；
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
  - 占位图片：例如配置一个橙色背景带白色hello文字的色块占位图片，\`https://placehold.co/600x400/orange/ffffff?text=hello\`，注意 text 只能使用英文字符；
  - 写实图片：例如配置一个高质量的写实图片比如摄影、人文等，\`https://ai.mybricks.world/image-search?term=searchWord&w=20&h=20\`；
  具体来说
  - 对于各类图片，例如背景图、轮播图等：我们建议使用高质量的写实图片；
  - 对于Logo：我们建议使用色块占位图片；
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
├─ store.ts               # 全局 store（可选）
├─ dataSource.ts          # 真实接口（项目唯一文件且必须）
├─ setup.ts               # mock接口（项目唯一文件且必须）
├─ pages                  # 页面
|  └── index
|  |  ├── index.tsx
|  |  ├── index.less      # 可选，按需
|  |  ├── index.config.ts # 页面配置，必须
|  |  ├── store.ts        # 页面级 store（可选）
|  └── detail
|  |  ├── index.tsx
|  |  ├── index.less
|  |  ├── index.config.ts
├─ components
|  └── CustomButton
|  |  ├── index.tsx
|  |  ├── index.less
\`\`\`

> 项目支持渐进式渲染，初始化项目时，建议将入口和公共文件先初始化好，再按照页面进行初始化。

#### 页面与组件的文件拆分
- app.config.ts：应用入口，有且仅有一个，且必须写在根路径的 \`app.config.ts\` 中；
- app.tsx：应用渲染入口，有且仅有一个，且必须写在根路径的 \`app.tsx\` 中；
- pages/xxx：页面，每个页面必须单独拆到**文件夹**中，例如 \`pages/index/index.tsx\`、\`pages/detail/index.tsx\`；
- 组件：可以被复用的组件可以放到公共\`components/\` 目录下；

> 拆分仅作为结构处理，建议的开发顺序是完成基础架构的代码、然后按页面维度一个一个完成需求。

#### tsx 文件编写规范
1. 组件 props 禁止传递保留字段（\`_env\`、\`popupNode\`）以及 store 数据：
   - 错误：\`<UserInfo _env={_env} popupNode={popupNode} store={store} user={store.user} />\`
   - 正确：\`<UserInfo />\`
2. 组件必须自行从 store 读取所需数据、自行调用 store 方法更新，禁止由父组件通过 props 传入 value/onChange 等受控属性或事件回调；组合区块（如 SearchBar）只负责布局与子区块的挂载，不向子区块传递 value、onChange、onClick 等；仅当区块是可复用单元（如列表单项的单条数据）时才通过 props 传数据，且单项内部如需读写状态应自行接收 store，不通过父组件传事件回调；
3. 禁止编写、使用未实现的事件函数；
4. 业务逻辑封装在 store 中（例如：登录态校验、数据查询等）；
5. 组件各类状态控制维护在 store 中（例如：loading、选中态、状态切换等）；
6. 包含事件props（例如 onClick、onChange、onBlur 等）的标签内必须包含注释「/** 事件名:事件key */」，注释与事件props同级，而不是在事件函数内；
7. 对于浮层类组件，如弹窗、抽屉等，控制浮层的显示/打开/弹出/隐藏状态的变量必须维护在 store 中，这类状态禁止设置一个固定的值；
8. 严格遵守 tsx 语法规范；
9. 所有来自三方库的组件必须带有 className 属性，值需语义化明确且唯一，无论是否需要样式，以便通过 CSS 选择器选中；
10. 所有与样式相关的内容都要写在 less 文件中，避免在 tsx 中通过 style 编写；
11. 各类动效、动画等，尽量使用 css3 的方式在 less 中实现，不要为此引入任何的额外类库；
12. 禁止出现直接引用标签的写法，例如 \`<Tags[XX] property={'aa'}/>\`，正确的写法是先定义 \`const XX = Tag[XX]; <XX property={'aa'}/>\`；
13. 所有列表中的组件，必须通过 key 属性做唯一标识，不要使用 index 作为 key；
14. 如果 JSX 标签的事件内调用了接口，那么标签内必须包含注释「/** datasource:唯一key */」，这个 key 必须保证全局唯一
15. 如果 JSX 标签内使用了接口数据，那么标签内必须包含注释「/** datasource:唯一key */」，这个 key 必须保证全局唯一
16. 函数体内（如 useEffect、普通函数）的接口调用和读取不需要写注释，在 README.md 里对应组件的datasource那使用 root 作为唯一 key 描述即可

保留字段（禁止通过 props 传递）：
- \`_env\`：环境变量，\`_env.mode\` 表示运行环境（design | runtime）；
- \`popupNode\`：浮层挂载目标 DOM 节点，浮层类组件必须挂载到此节点上；

comRef 说明：
- comRef 是 MyBricks 提供的高阶函数，用于创建一个组件；
- 该组件默认接收保留字段；
- 该组件是响应式组件，组件内使用 store 中的数据时，数据变更会自动刷新组件；

popupRef 说明：
- popupRef 是 MyBricks 提供的高阶函数，用于创建浮层类组件（弹窗、抽屉等）；
- 该组件默认接收保留字段；
- 该浮层类组件是响应式的，数据变更会自动刷新；

PopupVisible 装饰器说明：
- PopupVisible 是一个属性装饰器，用于将浮层类组件在**设计态**下将变量默认设置为**打开状态**，这样设计者才能选中浮层内部的元素进行编辑；
- 对于浮层类组件的打开与否，不需要在 runtime 层控制，统一由装饰器进行管理；

#### less 文件编写规范
1. 严格参考设计风格与主题变量使用说明来编写样式；若项目提供了主题变量，编写前必须先列举全部可用变量，再对照每条样式属性逐一检查是否有对应变量，有则必须使用，禁止硬编码已有主题变量所覆盖的色值或数值；
2. 在选择器中，多个单词之间使用驼峰方式，不能使用 - 连接；
3. 所有容器类的样式必须包含 \`position: relative\`；
4. 尽量不要用 calc 等复杂的计算；
5. 动效、动画等效果，尽量使用 css3 的方式实现，例如 transition、animation 等；
6. 不使用 :before、:after 等伪类选择器来实现 dom；

#### store.ts 文件编写规范
只有入口、页面可以编写 store.ts 文件，即可以封装全局 store 和页面级 store；store.ts 文件用于管理全局、页面的状态，封装实现各类业务逻辑，响应式 Store，组件侧监听变量能实现自动刷新。

使用原则：
- 文件名必须是 \`store.ts\`；
- 业务逻辑应尽量维护在 store 中，以便跨组件共享、持久化；
- 当多个区块需要读写或联动的派生数据时，放在 store 中；
- 应用内可复用的业务逻辑与数据放在 store 中；
- 禁止与 React hooks 混用；
- 禁止通过 props 传递 store 字段，禁止对 store 进行解构后通过 props 传递；
- 当需要更新嵌套对象内容时，必须使用扩展运算符更新整个对象：
  - 正确：\`this.user = {...this.user, name: "名称"};\`
  - 错误：\`this.user.name = "名称";\`

编写规范：
1. 当字段用于控制浮层类组件的显示/隐藏状态时，需要对该字段使用装饰器 @PopupVisible；
2. 默认导出实例化后的 store；
3. 必须使用 makeAutoObservable；

注意：
- store 内部变量之间不会监听，只有组件内使用 store 中的数据时，数据变更才会自动刷新组件；当需要监听组件 A 变化刷新 UI 时，必须在组件内读取 A 的值，当需要更新字段 A 时，必须修改 A 的值；
- store 是纯 class 实例，不提供也不支持任何 hooks API（例如 store.useState、store.useXxx 等均不存在），禁止调用；
- 禁止使用 getter 方法（例如：get count() {...}）；
- 除 makeAutoObservable 调用外，任何数据初始化动作都不允许写在 constructor 内；
- 禁止在 React 函数组件内直接调用 store 的数据初始化方法（如 store.init()、store.fetchData() 等），这会在每次渲染时重复执行，极易导致死循环；如需初始化，必须放在 useEffect 内执行；
- store.ts 是纯 TypeScript 文件，禁止出现任何 JSX 语法（例如 <Icon />、<View> 等标签），也禁止从任何 UI 组件库引入 JSX 组件并作为字段值存储；

#### 日志规范
项目中必须使用 mybricks 提供的 \`logger\` 工具打印日志，禁止使用 console.log / console.warn / console.error 等原生方法。

必须在以下所有场景中打印足量日志，确保运行时行为可追踪、可排查：
1. 用户交互事件：所有 onClick、onChange、onBlur 等事件触发时，打印 logger.info 记录操作行为及关键参数；
2. 数据请求：接口调用前打印 logger.info 记录请求参数，请求成功后打印 logger.info 记录返回数据摘要，请求失败时打印 logger.error 记录错误信息；
3. 状态变更：store 中任何方法被调用时，打印 logger.info 记录方法名及关键入参；
4. 条件分支与异常：进入关键条件分支时打印 logger.info 说明走了哪个分支；try-catch 中 catch 块必须打印 logger.error 记录异常；
5. 路由跳转：导航跳转时打印 logger.info 记录目标路径；
6. 任何可能失败的操作（如数据解析、类型转换等）都需要用 try-catch 包裹，并在 catch 中使用 logger.error 打印错误详情；

日志格式要求：
- 日志消息应包含上下文前缀，便于定位来源，格式推荐：\`[组件名/方法名] 具体描述\`；
- 示例：\`logger.info('[UserList/fetchUsers] 开始请求用户列表', { page: 1 })\`；
- 错误日志必须携带 error 对象：\`logger.error('[Store/loadData] 数据加载失败', error)\`；

重复结构处理：当一个区块内存在多个「结构相同、仅数据不同」的重复单元时，必须拆成「容器 + 单项」两层：
- 容器（comRef）：负责布局与数据遍历，用 map 渲染单项；
- 单项（comRef）：描述单条数据的 UI，通过 props 接收单条数据；
- 禁止在容器中直接内联重复的 JSX 块；

命名与实现：
- 命名：使用语义化 PascalCase，名称应直接反映其在页面中的位置与职责；
- 实现：每个独立区块写成 \`const 区块名 = comRef(...)\`；
- 区块独立性：父组件只负责布局与子区块挂载，不向子区块传递 value、onChange、onClick 等受控属性；子区块自行从 store 读数据并调用 store 方法；
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
### README.md
根据当前应用的 tsx 源码，生成或更新对应的 README.md 说明文档
更新时机：
- 必须更新（强约束）：目录下不存在 README.md；或现有文档内容与上述规范不符；或需求明确要求更新文档；
- 建议更新（结构或内容变化）：在 tsx 中新增、删除或重命名了 appRef/comRef 节点，或通过 \`app.config.ts\` 中 pages 注册的页面发生变化；export default 的根节点类型或子节点类型组合发生变化导致标题层级需调整；JSX 中新增、删除或修改了带 /** onXXX:事件名 */ 注释的事件；JSX 中新增、删除或修改了 /** datasource:唯一key */ 注释；某节点的 UI 结构、交互或业务含义发生明显变化；
- 无需更新：tsx、store.ts 未被修改，且现有 README.md 已正确反映当前源码的节点结构、事件、接口使用情况与说明；仅修改了 less 等与节点行为无关的文件；
<README.md 文档编写规范>
  <节点>
  按「在 JSX 中依赖顺序」依次写出，层级用标题级别表示。
  - appRef 应用节点
  - 页面节点：通过 \`app.config.ts\` 的 pages 注册的页面视为页面节点
  - comRef 组件节点（未通过 \`app.config.ts\` 的 pages 注册的）
  </节点>

  <根节点>
  对应 export default ...，根节点可以是任意类型；文档中根节点标题固定为「# default」。
  </根节点>

  <标题层级>
  全文标题最多三级（一级 #、二级 ##、三级 ###）。根节点固定为「# default」；其余节点的标题级别由「当前应用实际出现的类型」决定：
  - 若同时存在 app、page、com：app 对应一级（根即 # default）、page 对应二级（##）、com 对应三级（###）；
  - 若仅有 page 与 com：page 对应一级（根即 # default）、com 对应二级（##）；
  - 若仅有 app 与 page 或单层类型，则按实际层级依次使用 ##、###，层级连续且不超过三级。
  - 标题内容对应代码中各节点变量声明的变量名；
  - 必须按层级关系书写，子节点紧跟在父节点之后，不能将同级标题集中写在前面。例如有 page1（含 com1、com2）和 page2（含 com1、com2）时，正确顺序为：## page1 → ### com1 → ### com2 → ## page2 → ### com1 → ### com2；不能先写所有 ## page，再写所有 ### com。
  </标题层级>

  <节点说明>
  - title：根据节点内容与名称写出简洁的语义化标题，体现节点职责，避免与组件名简单重复（如组件叫 SignIn 时 title 可用「登录页」而非「登录」）；
  - summary：对节点的用途、场景或关键行为做简短说明，补充 title 未涵盖的信息，避免与 title 重复或仅罗列 UI 元素；
  - type：app | page | com，其中 app 对应 appRef，page 对应通过 \`app.config.ts\` 中 pages 注册的页面，com 对应 comRef（非页面）。
  - events：该组件内声明的事件列表（找最近的组件，而不是页面）
    1. 从源码识别：JSX 块注释如 /** onClick:事件名 */（或其它 onXXX:事件名）
    2. 每条事件用结构化格式描述，包含以下字段：
        - 事件名
          - title: 简短中文说明（如 登录）
          - mermaid: 根据事件内容生成对应的 Mermaid 语法流程图（以 flowchart LR; 开头，单行书写）
          - relation:
            - type: 关系类型（page，popup），打开弹窗使用popup，跳转页面使用page
            - name: 关联的弹窗或页面的名称，即对应的节点名称
      注意格式要严格保持一致；
      关于relation，只有一条对应关系，事件如果涉及到打开弹窗、跳转页面，则需要relation说明；
      关于 Mermaid 语法流程图需关注以下规则和要求：
        - 流程图方向统一用 LR（从左到右），节点文本全部用双引号包裹；
        - 条件判断节点用 {} 包裹，分支标注用 |标注内容| 写在箭头上；
        - 【重要】判断节点的分支必须分开写：从判断节点出发，每个分支单独写一条「箭头」，用分号分隔多条语句。正确示例：B{"是否展开"} -->|是| C["移除"]; B -->|否| D["添加"]。错误示例：B{"是否展开"} -->|是| C["移除"] -->|否| D["添加"]（这样会把「否」错误地连成 C→D，而不是 B→D）；
        - 每条语句末尾加分号分隔，最后一条语句后不加分号；
        - 生成后先自检：检查是否有多余分号、引号是否统一、节点连接是否完整（无断链、无悬空节点）、每个判断分支是否都从判断节点单独引出；
        - 流程图逻辑要贴合需求，节点命名简洁易懂，避免冗余步骤；
        - 流程图需覆盖全链路：事件处理与 store 方法内部均需展开，从触发到结束完整呈现；
        - 禁止出现「调用 XX API」「调用 XX 函数」等无意义节点，所有 API 及函数调用均须展开其内部逻辑，写出完整流程；
        - 流程图节点用动作描述，不写具体取值：例如用「设置loading状态」「取消loading状态」，禁止「设置loading为true」「设置loading为false」等；
        - 禁止出现用户动作类流程节点（如「点击按钮」）、空洞节点（如「开始」「结束」「执行业务操作」）；
        - 流程图须真实完整：严格依据事件处理函数内的代码逻辑，以及所调用的 store 方法内部实现来绘制，不省略、不捏造。
        - 分支流程必须完整表达：代码中的 if/else、三元判断、early return、请求成功/失败等所有分支，都必须在流程图中用条件节点 {} 和 |分支标注| 画出；每个分支（如「通过」「不通过」「成功」「失败」）及其后续步骤都须独立延伸，不得只写主流程而省略条件分支。
    3. 无事件可省略 events
  - datasource：该组件内所使用到的接口列表
    1. 从源码识别：JSX 块注释如 /** datasource:唯一key */（仅针对 JSX 标签内的接口调用或数据使用）
    2. 对于函数体内（如 useEffect、普通函数内）的接口调用或读取，统一使用 root 作为唯一 key，在对应节点下汇总描述
    3. 每条接口用结构化格式描述，包含以下字段：
      - 唯一key
        - api - 对应datasource内的真实方法名定义
          - type: call(调用接口) | use(使用接口数据)
          - desc: 该元素使用此接口的具体意图，每处使用独立描述
    4. 没有使用接口可省略 datasource
  </节点说明>
</README.md 文档编写规范>

<基于 tsx 的README.md示例>
如果应用源代码如下
${EXAMPLE_CODE}

可以看到有一个appRef、四个comRef（其中两个为页面节点），所以文档包含一个app节点、两个页面节点、两个组件节点。

\`\`\`md file="README.md"
# default

- title: 登录/注册应用入口
- summary: 应用根节点，通过路由提供登录页与注册页的切换与展示。
- type: app

---

## SignIn

- title: 登录页
- summary: 用户登录入口页，提供登录按钮并触发 signIn 完成登录。
- type: page
- events:
  - signIn
    - title: 登录
    - mermaid: flowchart LR; A["校验登录参数"] --> B{"参数是否有效"} -->|有效| C["设置loading状态"] --> D["请求登录接口"] --> E{"请求是否成功"} -->|成功| F["更新用户状态"] --> G["取消loading状态"]; E -->|失败| H["提示错误信息"] --> G; B -->|无效| I["提示参数错误"]
- datasource:
  - signInApi
    - signUp
      - type: call
      - desc: 点击登录按钮调用登录接口

（SignIn 是通过 \`app.config.ts\` 中 pages 注册的页面，因此 type 为 page）

---

### NewsList

- title: 新闻列表区块
- summary: 展示官网最新新闻列表，使用 getNewsList 接口返回的数据。
- type: com
- datasource:
  - newsListApi
    - getNewsList
      - type: use
      - desc: 展示新闻标题和摘要列表
  - root
    - getNewsList
      - type: call
      - desc: 组件初始化时调用接口获取新闻列表数据

---

## SignUp

- title: 注册页
- summary: 用户注册入口页，内嵌注册表单组件完成填写与提交。
- type: page

（SignUp 是通过 \`app.config.ts\` 中 pages 注册的页面，因此 type 为 page）

---

### StepRegisterForm

- title: 注册表单区块
- summary: 注册表单容器，包含表单与注册按钮，提交时触发 signUp。
- type: com
- events:
  - signUp
    - title: 注册
    - mermaid: flowchart LR; A["校验表单参数"] --> B{"参数是否有效"} -->|有效| C["设置loading状态"] --> D["请求注册接口"] --> E{"请求是否成功"} -->|成功| F["跳转登录页"] --> G["取消loading状态"]; E -->|失败| H["提示错误信息"] --> G; B -->|无效| I["提示参数错误"]
- datasource:
  - signUpApi
    - signUp
      - type: call
      - desc: 点击注册按钮调用注册接口

\`\`\`
</基于 tsx 的README.md示例>
`,
    requirementGuide: `<requirement.md 文档编写规范>
更新时机：
- 必须更新（强约束）：目录下不存在 requirement.md；或需求明确要求更新文档；
- 建议更新：用户的需求目的有更新；源代码关联组件名发生了变化；

书写规范：
- 总体原则：从产品视角梳理，关注整体业务流程、业务规则、效果、业务逻辑和目标；永远不要将源代码中冗余详细的前端信息写进 requirement.md，这是需求文档，不是代码文档；
- 文件顶部必须有 YAML front matter（用 --- 包裹），包含：
  - title：项目标题
  - desc：项目的一句话描述
- 一级标题「# 一、需求背景」：包含背景、目标、流程图、文字描述等，不要过于详细，但需要能够展示清楚内容；
- 一级标题「# 二、需求概述」：按照模块对需求进行拆分，展示一个表格，表头为需求、说明、优先级三列；
- 一级标题「# 三、需求详情」：按照功能点列表详细描述，每一个功能用二级标题，同时需要声明 type（new / edit）、涉及到的组件 related、优先级 rank（P0–P5），内容可以包含文本、列表、流程图、表格等；
- 一级标题「# 四、数据需求」（可选）：提供对数据指标的定义、埋点和监控需求，一般用表格展示；
</requirement.md 文档编写规范>

<requirement.md示例>
\`\`\`md
---
title: 开播理由BD工具
desc: 提供新增商品链路，覆盖*40%*中小商家的快速新增商品需求
---

# 一、需求背景

## 1.1 业务背景

核心问题的表格...

## 1.2 策略和解法
> 整体思路：选对象 -> 做诊断（找论据）-> 做表达

对目标商家下发「开播理由BD工具」，撬动其表达意愿、进而牵引其开播

通过下发开播理由BD工具，实现商品快速创建能力，提升商家商品发布效率

\`\`\`mermaid
flowchart LR; A["用户填写商品信息"] --> B{"校验商品参数"} -->|有效| C["提交创建商品接口"] --> D{"请求是否成功"} -->|成功| E["刷新商品列表"] --> F["关闭弹窗"]; D -->|失败| G["提示错误信息"]; B -->|无效| H["提示参数错误"]
\`\`\`

## 1.3 项目目标和收益
目标和收益的表格...

# 二、需求概述
功能点表格...

# 三、需求详情
## 新增一个商品发布弹窗
type: new
related: NewModalButton,ItemNewModal
...
\`\`\`
</requirement.md示例>`
  }
}

export default promptSections

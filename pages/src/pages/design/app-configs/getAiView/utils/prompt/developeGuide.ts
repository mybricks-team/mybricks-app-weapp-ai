
/**
 * 开发指南
 */
const firstOfAll = `- 开发宪章
  > 技术栈：React 18 + Taro 4.x + Less，面向移动端软件开发
  > 参考「开发指南」+「源代码」进行代码开发任务，必须遵循「最佳实践」和「设计规范」，在编写各类型文件时，按照「文件编写规范，完成代码任务后，遵循「文档规范」进行文档（README 和 requirement两个文件）的同步。
  > @tarojs/components 组件使用必须遵循「Taro Components说明文档」
  > API调用：无论目标运行环境是什么，所有API调用都使用Taro提供的API（如路由、存储、网络请求等），以确保跨平台兼容性

- 作用范围
  - 【必须】只开发 src 文件夹下的代码；所有文件路径以 src 为根路径书写，路径中不包含 src 前缀
    - 正确：pages/index/index.config.ts
    - 错误：src/pages/index/index.config.ts
  - 忽略编译、脚手架、构建配置等一切非源码内容，不输出也不讨论

- 总体规则
  - 功能：生产级别的功能性；
  - 细节：在每个细节都精心完善；
  - 响应式：保证合理统一的间距，以及支持宽度变化自适应的代码；
  - 当前每一个设计态画布默认宽度为414px，可以通过样式文件中使用 :frame { width: 414px } 统一配置画布宽度；
- 拆分逻辑
  - 精准识别到底是页面还是弹窗，对其进行拆分，如果是页面，需要使用Route渲染，如果是弹窗，需要使用popupRef；
  - 我们特别希望在设计态能够展示所有页面和弹窗，方便用户进行调试；`

/**
* 资源使用说明
*/
const assetsUsageSection = `- 对于图标：为了保证视觉的统一与专业性，我们的共识是统一使用图标组件库(@nutui/icons-react-taro)
  - 组件库没有合适的图标，才使用 https://api.iconify.design/material-symbols/home.svg?color=%23ff0000&height=32，可配置图标库、图标、颜色、高度等参数，不要全局都使用
  - 禁止使用emoji
- 对于图片：图片是传递信息与氛围的关键。我们建议根据其用途选择合适的来源：
  - https://placehold.co/600x400/orange/ffffff?text=hello，可以配置一个橙色背景带白色hello文字的色块占位图片，请注意text需要使用英文字符；
  - https://ai.mybricks.world/image-search?term=searchWord&w=20&h=20，可以配置一个高质量的写实图片（比如摄影、人文等）；
  - 对于海报/写实/商品/图片：我们建议使用高质量的写实图片；
  - 对于Logo：我们建议使用色块占位图片；
  - 对于插画/装饰性图形：我们优先推荐使用简单的svg来占位，避免使用图片过于跳脱；`

/**
 * 架构说明
 */
const architectureSection = `\`\`\`
├─ app.config.ts          # 模块入口，app配置，有且仅有一个，必须写在根路径，文件名必须为app.config.ts
├─ app.tsx                # 根组件渲染入口，有且仅有一个，必须写在根路径，文件名必须为app.tsx
├─ app.less               # 全局样式（项目唯一文件且必须）
├─ store.ts               # 全局 store（可选）
├─ scheme.js    # 接口 scheme （项目唯一文件且必须，而且在dataSource.js和 setup.js之前写入）
├─ dataSource.js          # 真实接口（项目唯一文件且必须）
├─ setup.js               # mock接口（项目唯一文件且必须）
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

#### 页面与组件的文件拆分
- pages/xxx：页面，每个页面必须单独拆到**文件夹**中，例如 \`pages/index/index.tsx\`、\`pages/detail/index.tsx\`；
- 组件：每个组件可以是单独的一个文件或目录，文件位置按是否有复用价值决定：
  - 有复用价值（可以被多个页面或组件复用）：放在 \`components/组件名/\` 下（如 \`components/Header/index.tsx\`）；
  - 无复用价值（仅当前页面使用）：可放在**当前页面目录下**（如 \`pages/index/Title.tsx\`、\`pages/detail/FilterBar/index.tsx\`），不必强行放在 components 下；

> 拆分仅作为结构处理，建议的开发顺序是完成基础架构的代码、然后按页面维度一个一个完成需求。

#### tsx 文件编写规范
1. 组件 props 禁止传递保留字段（\`_env\`、\`popupNode\`）以及 store 数据：
   - 错误：\`<UserInfo _env={_env} popupNode={popupNode} store={store} user={store.user} />\`
   - 正确：\`<UserInfo />\`
2. 拆分的各区块应是独立的：每个区块（非「单项」复用单元）必须自行从 store 读取所需数据、自行调用 store 方法更新，禁止由父组件通过 props 传入 value/onChange 等受控属性或事件回调；组合区块（如 SearchBar）只负责布局与子区块的挂载，不向子区块传递 value、onChange、onClick 等；仅当区块是可复用单元（如列表单项的单条数据）时才通过 props 传数据，且单项内部如需读写状态应自行接收 store，不通过父组件传事件回调；
3. 禁止编写未实现的事件函数；
4. 业务逻辑封装在 store 中（例如：登录态校验、数据查询等）；
5. 组件各类状态控制维护在 store 中（例如：loading、选中态、状态切换等）；
6. 包含事件（例如 onClick、onChange、onBlur 等）的标签内必须包含注释「/** 事件名:事件key */」；
7. 对于浮层类组件，如弹窗、抽屉等，控制浮层的显示/打开/弹出/隐藏状态的变量必须维护在 store 中，这类状态禁止设置一个固定的值；
8. 严格遵守 tsx 语法规范，不允许使用 typescript 语法；
9. 非JSX 标签内部不要使用 \`{/* */}\` 这种注释方式，只能使用 \`//\` 注释方式；
10. 所有来自三方库的组件必须带有 className 属性，值需语义化明确且唯一，无论是否需要样式，以便通过 CSS 选择器选中；
11. 所有与样式相关的内容都要写在 less 文件中，避免在 tsx 中通过 style 编写；
12. 各类动效、动画等，尽量使用 css3 的方式在 less 中实现，不要为此引入任何的额外类库；
13. 禁止出现直接引用标签的写法，例如 \`<Tags[XX] property={'aa'}/>\`，正确的写法是先定义 \`const XX = Tag[XX]; <XX property={'aa'}/>\`；
14. 所有列表中的组件，必须通过 key 属性做唯一标识，不要使用 index 作为 key；

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
1. 严格参考设计风格来编写样式；若项目提供了主题变量，编写前必须先列举全部可用变量，再对照每条样式属性逐一检查是否有对应变量，有则必须使用，禁止硬编码已有主题变量所覆盖的色值或数值；
2. :frame 配置规则（仅页面和浮层类组件需要，普通组件不需要）：
   - 每个页面（page），必须配置 :frame { width; height; }，宽度参考设计稿或 414px（若无设计稿），高度参考设计稿或 896px（若无设计稿），高度可根据实际所需进行调整；
   - 每个浮层类组件（由 popupRef 创建的组件），必须配置 :frame { width; height }，宽度与页面保持一致（同 414px 或设计稿宽度），高度与页面保持一致（同为 896px 或设计稿宽度），高度可根据实际所需进行调整；
   - :frame 只控制画布尺寸，不影响运行时布局，必须放在所有 CSS 类之前；
   - :frame 只在首次创建页面或浮层类组件或者有重大 UI 重构时才需要重新估算；
   - 页面根组件用宽度100%适配:frame 宽度；
3. 在选择器中，多个单词之间使用驼峰方式，不能使用 - 连接；
4. 所有容器类的样式必须包含 \`position: relative\`；
5. 尽量不要用 calc 等复杂的计算；
6. 动效、动画等效果，尽量使用 css3 的方式实现，例如 transition、animation 等；
7. 不使用 :before、:after 等伪类选择器来实现 dom；
8. 不要使用 \`page\`、\`*\` 选择器，避免兼容性问题；

#### store.ts 文件编写规范
只有入口、页面可以编写 store.ts 文件，即可以封装全局 store 和页面级 store；store.ts 文件用于管理全局、页面的状态，封装实现各类业务逻辑，响应式 Store，组件侧监听变量能实现自动刷新。

使用原则：
- 业务逻辑应尽量维护在 store 中，以便跨组件共享、持久化；
- 当多个区块需要读写或联动的派生数据时，放在 store 中；
- 模块内可复用的业务逻辑与数据放在 store 中；
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
- 任何数据初始化动作都不允许写在 constructor 内；
- 禁止在 React 函数组件内直接调用 store 的数据初始化方法（如 store.init()、store.fetchData() 等），这会在每次渲染时重复执行，极易导致死循环；如需初始化，必须放在 useEffect 内执行；
- store.ts 是纯 JavaScript 文件，禁止出现任何 JSX 语法（例如 <Icon />、<div> 等标签），也禁止从任何 UI 组件库引入 JSX 组件并作为字段值存储；

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

#### 区块拆分原则与规范
区块拆分的核心目标是：代码清晰可维护、逻辑内聚、减少不必要的文件碎片。必须同时兼顾「编程视角」（复用性、状态独立性、逻辑复杂度）和「视觉模块」（视觉上可独立识别的功能区域），二者缺一不可。

何时必须拆分为独立 comRef（满足以下任一条件时必须拆出）：
1. 【复用性】该区块会被多个父组件引用，或预期将被复用；
2. 【状态独立性】该区块有自己独立的状态逻辑，与父组件状态解耦，或需要独立订阅 store；
3. 【逻辑复杂度】该区块包含较多交互逻辑、副作用或条件分支，放在父组件内会使父组件臃肿难以维护；
4. 【视觉模块边界】该区块是视觉上清晰可识别的独立功能模块（如筛选栏、数据表格、详情面板、图表区、分页器等），且其内部有一定的 JSX 结构（子节点 ≥ 3 个或存在可命名子结构）；
5. 【列表单项】列表/网格中结构复杂的单项（多于 2 个字段或有交互）；

何时不应拆分（满足以下情况时，无需强行拆分，可在父组件中内联）：
1. 结构极简：仅包含标题文字、单行描述、单个图标等少量元素（子节点 ≤ 2 个），且无独立状态或交互；
2. 无复用价值：仅在当前组件使用一次，且内容简单（如 header 中只有一个标题 \`<h2>标题</h2>\`）；
3. 强依赖上下文：该部分与父组件逻辑深度耦合，拆出后必须靠大量 props 传递才能工作，反而增加复杂度；
- 反例（不应拆分）：页面顶部仅有标题的 header，如 \`<div className={css.header}><h2>用户管理</h2></div>\`，无需拆为独立 Header 组件；

文件位置决策：
- 跨页面复用 → 放入 \`components/组件名/\`；
- 仅当前页面使用 → 放入当前页面目录下（如 \`pages/index/FilterBar/\` 或 \`pages/index/FilterBar.tsx\`）；
- 禁止将只在单一页面使用的简单组件提升到顶层 \`components/\` 目录；

重复结构处理：当一个区块内存在多个「结构相同、仅数据不同」的重复单元时，必须拆成「容器 + 单项」两层：
- 容器（comRef）：负责布局与数据遍历，用 map 渲染单项；
- 单项（comRef）：描述单条数据的 UI，通过 props 接收单条数据；
- 禁止在容器中直接内联重复的 JSX 块；

命名与实现：
- 命名：使用语义化 PascalCase，名称应直接反映其在页面中的位置与职责；
- 实现：每个独立区块写成 \`const 区块名 = comRef(...)\`；
- 区块独立性：父组件只负责布局与子区块挂载，不向子区块传递 value、onChange、onClick 等受控属性；子区块自行从 store 读数据并调用 store 方法；


### 接口操作规范
- \`scheme.js\` 是 \`dataSource.js\` 和 \`setup.js\` 的接口约束基准，三者必须保持一致。

更新时机：
- 用户新增、删除或修改了接口相关功能时，必须同步更新；
- 后端返回了新的真实接口定义、字段结构、业务约束或接口映射关系时，必须立即同步更新；
- \`scheme.js\`、\`dataSource.js\`、\`setup.js\` 任一文件发生接口相关变更时，必须检查其余两个文件是否需要同步更新；
- 页面功能与接口绑定关系发生变化时，必须同步更新接口使用说明和对应实现；

`

/**
 * 开发示例
 */
const examplesSection = `#### 开发示例

<examples>

注意: 
  - 以下例子中在不同的类库要求下使用的具体类库名称、方法、属性等可能会有所不同，具体以实际情况为准
  - 例子中代码只是写法说明，具体以实际情况生成
  - 例子中设计理念只是参考，具体以实际情况为准
<example>
  <user_query>开发一个登录页面</user_query>
  <assistant_response>
  我已经为你设计并实现了一个极具设计感、现代且高级的移动端登录页面

  ## 设计理念

  这里我采用的是极光毛玻璃风格。这种风格打破了传统的纯色背景或简单的渐变，通过深色背景（Midnight Blue）与底层动态流转的极光光晕（紫色、蓝色、粉色）交织，再在上层覆盖一个半透明的毛玻璃表单卡片，创造出极具空间感、呼吸感和科技感的高级视觉体验。

  - 排版: 摒弃了平庸的常规字体排版，使用了大字号的无衬线标题配合负字距（letter-spacing: -0.5px），打造杂志封面的克制与优雅。
  - 交互: 背景光晕加入了缓慢的浮动和呼吸动画；输入框在聚焦时会产生细腻的发光反馈和边框变色；主按钮加入了带有呼吸感的渐变色和阴影。

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

  注意，app.tsx 只能这么写，禁止多余的内容
  \`\`\`tsx file="app.tsx"
  import { appRef } from 'mybricks'
  import './app.less'
    
  export default appRef(({ children }) => {
    return children
  })
  \`\`\`

  \`\`\`tsx file="pages/login/index.tsx"
  import { View, Text, Input } from '@tarojs/components'
  import css from './index.less'

  export default function Login () {
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
  }
  \`\`\`

  \`\`\`tsx file="pages/login/index.less"
  :frame: {
    width: 414;
    height: 896;
  }

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
    navigationBarTitleText: 'Login',
    navigationStyle: 'custom'
  })
  \`\`\`
  </assistant_response>
</example>

</examples>

#### 文档同步规范

**README.md — 模块说明文档**

节点顺序与类型：
- 按「在 JSX 中依赖顺序」依次写出所有节点，层级用标题级别表示；
- appRef 应用节点、通过 defineAppConfig 注册的 pages 视为页面节点（page）、其余的均视为组件节点（com）；
- 根节点对应 export default ...，文档中根节点标题固定为「# default」；

标题层级规则（全文最多三级）：
- 若同时存在 app、page、com：app 对应一级（# default）、page 对应二级（##）、com 对应三级（###）；
- 若仅有 page 与 com：page 对应一级（# default）、com 对应二级（##）；
- 若仅有 app 与 page 或单层类型，则按实际层级依次使用 ##、###，层级连续且不超过三级；
- 标题内容对应代码中各节点变量声明的变量名；
- 必须按层级关系书写，子节点紧跟在父节点之后，不能将同级标题集中写在前面。例如有 page1（含 com1、com2）和 page2（含 com1、com2）时，正确顺序为：## page1 → ### com1 → ### com2 → ## page2 → ### com1 → ### com2；

每个节点必须包含的字段：
- title：根据节点内容与名称写出简洁的语义化标题，体现节点职责，避免与组件名简单重复（如组件叫 SignIn 时 title 可用「登录页」而非「登录」）；
- summary：对节点的用途、场景或关键行为做简短说明，补充 title 未涵盖的信息，避免与 title 重复或仅罗列 UI 元素；
- type：app | page | com；
- events（该节点有事件时必填，无事件可省略）：
  - 从源码 JSX 块注释中识别，如 /** onClick:事件名 */（或其它 onXXX:事件名）；
  - 每条事件的格式：
    - 事件名
      - title: 简短中文说明（如 登录）
      - mermaid: 流程图（以 flowchart LR; 开头，单行书写，覆盖全链路）
      - relation（仅涉及打开弹窗或跳转页面时填写，只有一条）:
        - type: popup（打开弹窗）| page（跳转页面）
        - name: 关联的弹窗或页面的节点名称

Mermaid 流程图规则：
- 流程图方向统一用 LR（从左到右），节点文本全部用双引号包裹；
- 条件判断节点用 {} 包裹，分支标注用 |标注内容| 写在箭头上；
- 【重要】判断节点的分支必须分开写：每个分支单独写一条箭头，用分号分隔。正确示例：B{"是否展开"} -->|是| C["移除"]; B -->|否| D["添加"]。错误示例：B{"是否展开"} -->|是| C["移除"] -->|否| D["添加"]（这样会把「否」错误地连成 C→D，而不是 B→D）；
- 每条语句末尾加分号分隔，最后一条语句后不加分号；
- 生成后先自检：检查是否有多余分号、引号是否统一、节点连接是否完整（无断链、无悬空节点）、每个判断分支是否都从判断节点单独引出；
- 流程图需覆盖全链路：事件处理与 store 方法内部均需展开，从触发到结束完整呈现；
- 禁止出现「调用 XX API」「调用 XX 函数」等无意义节点，所有 API 及函数调用均须展开其内部逻辑；
- 流程图节点用动作描述，不写具体取值：例如用「设置loading状态」「取消loading状态」，禁止「设置loading为true」；
- 禁止出现用户动作类流程节点（如「点击按钮」）、空洞节点（如「开始」「结束」「执行业务操作」）；
- 分支流程必须完整表达：代码中的 if/else、三元判断、early return、请求成功/失败等所有分支，都必须用条件节点 {} 和 |分支标注| 画出，不得只写主流程而省略条件分支；

更新时机：
- 必须更新（强约束）：目录下不存在 README.md；或现有文档内容与上述规范不符；或需求明确要求更新文档；
- 建议更新（结构或内容变化）：在 jsx 中新增、删除或重命名了 appRef/comRef 节点，或 defineAppConfig 注册的 pages 组件发生变化；export default 的根节点类型或子节点类型组合发生变化导致标题层级需调整；JSX 中新增、删除或修改了带 /** onXXX:事件名 */ 注释的事件；某节点的 UI 结构、交互或业务含义发生明显变化；
- 无需更新：jsx、store.ts 未被修改，且现有 README.md 已正确反映当前源码的节点结构、事件与说明；仅修改了 style.less、service.ts 等与节点行为无关的文件；

<README.md示例>
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

（SignIn 是通过 defineAppConfig 注册的页面，因此 type 为 page）

---

## SignUp

- title: 注册页
- summary: 用户注册入口页，内嵌注册表单组件完成填写与提交。
- type: page

（SignUp 是通过 defineAppConfig 注册的页面，因此 type 为 page）

---

### StepRegisterForm

- title: 注册表单区块
- summary: 注册表单容器，包含表单与注册按钮，提交时触发 signUp。
- type: com
- events:
  - signUp
    - title: 注册
    - mermaid: flowchart LR; A["校验表单参数"] --> B{"参数是否有效"} -->|有效| C["设置loading状态"] --> D["请求注册接口"] --> E{"请求是否成功"} -->|成功| F["跳转登录页"] --> G["取消loading状态"]; E -->|失败| H["提示错误信息"] --> G; B -->|无效| I["提示参数错误"]

\`\`\`
</README.md示例>

**requirement.md — 需求文档**

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
- 一级标题「# 四、后端协作信息」：按照模块补充接口相关的业务描述、业务约束、关键接口使用关系、接口与页面/功能的对应关系；
- 一级标题「# 五、数据需求」（可选）：提供对数据指标的定义、埋点和监控需求，一般用表格展示；

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

# 四、后端协作信息

禁止总接请求参数和响应参数等过于详细的前端信息，但需要提供接口相关的业务描述、业务约束、关键接口使用关系、接口与页面/功能的对应关系等，例如同一手机号不可重复注册、某个功能依赖哪些接口、某个接口被哪些业务流程使用；

## 5.1 接口与业务说明
| 接口 | 用途 | 对应页面/功能 |
| --- | --- | --- |
| /api/product/create | 创建商品 | 商品发布弹窗 |
| /api/product/list | 刷新商品列表 | 商品列表页 |

## 5.2 业务约束
- 同一商品编码不可重复创建；
- 商品发布前必须完成必填字段校验；
- 创建成功后需要立即刷新商品列表。

## 5.3 接口依赖关系
- 用户在商品发布弹窗提交表单后，先调用 /api/product/create；
- /api/product/create 成功后，再调用 /api/product/list 获取最新数据；
- /api/product/create 失败时，页面仅提示错误，不刷新列表。
\`\`\`
</requirement.md示例>


### 接口操作规范
\`\`\` scheme.js  说明
interface FieldDescriptor {
  /** 是否必填 */
  required: boolean;
  /** 字段数据类型 */
  type: FieldType;
  /** 字段描述 */
  description: string;
  /** 当 type 为 object 时的子属性定义 */
  properties?: Record<string, FieldDescriptor>;
  /** 当 type 为 array 时的数组元素定义 */
  items?: FieldDescriptor;
}
  /**
 * HTTP 请求方法
 */
type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';

/**
 * API 方案条目
 */
interface SchemeItem {
  /** 方案唯一标识 */
  id: string;
  /** 中文名称 */
  cnName: string;
  /** 英文名称 */
  name: string;
  /** 基础 URL */
  baseUrl: string;
  /** 请求方法 */
  method: HttpMethod;
  /** 请求路径 */
  path: string;
  /** 请求参数定义（可选） */
  request?: Record<string, FieldDescriptor>;
  /** 响应参数定义 */
  response: Record<string, FieldDescriptor>;
}

\`\`\`

\`\`\`js scheme.js 文件示例
const scheme = [
  {
    "id": "user.info.scheme",
    "cnName": "获取用户信息scheme",
    "name": "GetUserInfoScheme",
    "baseUrl": "https://api.example.com",
    "method": "GET",
    "path": "/api/user/info",
    "request": {
      "id": {
        "required": true,
        "type": "string",
        "description": "用户ID"
      },
      "name": {
        "required": true,
        "type": "string",
        "description": "提示信息"
      },
    },
    "response": {
      "code": {
        "required": true,
        "type": "number",
        "description": "状态码"
      },
      "message": {
        "required": true,
        "type": "string",
        "description": "提示信息"
      },
      "data": {
        "type": "object",
        "description": "返回数据主体",
        "properties": {
          "id": {
            "required": true,
            "type": "string",
            "description": "用户ID"
          },
          "comment": {
            "required": false,
            "type": "string",
            "description": "用户评论"
          },
          "direction": {
            "required": false,
            "type": "array",
            "description": "方向列表",
            "items": {
              "type": "string"
            }
          }
        }
      }
    }
  },
  {
    "id": "product.list.scheme",
    "cnName": "获取商品列表scheme",
    "name": "GetProductListScheme",
    "baseUrl": "https://api.example.com",
    "method": "GET",
    "path": "/api/product/list",
    "response": {
      "code": {
        "required": true,
        "type": "number",
        "description": "状态码"
      },
      "message": {
        "required": true,
        "type": "string",
        "description": "提示信息"
      },
      "data": {
        "type": "object",
        "description": "返回数据主体",
        "properties": {
          "id": {
            "required": true,
            "type": "string",
            "description": "用户ID"
          },
          "userInfo": {
            "required": true,
            "type": "object",
            "description": "用户信息",
            "properties": {
              "province": {
                "required": true,
                "type": "string",
                "description": "省"
              },
              "city": {
                "required": true,
                "type": "string",
                "description": "市"
              },
              "district": {
                "required": true,
                "type": "string",
                "description": "区"
              }
            }
          },
          "auditStatus": {
            "required": true,
            "type": "array",
            "description": "审核状态选项列表",
            "items": {
              "type": "object",
              "properties": {
                "key": {
                  "required": true,
                  "type": "string",
                  "description": "状态值"
                },
                "value": {
                  "required": true,
                  "type": "string",
                  "description": "状态名称"
                }
              }
            }
          }
        }
      }
    }
  }
]
\`\`\`

### 数据源使用
所有正式数据（接口请求、静态数据）必须维护在 \`dataSource.js\` 文件中。
必须根据scheme中的生成的数据类型定义接口
通过继承 \`DataSource\` 基类并 \`export default new MyDatasource()\` 来声明数据源；

怎么声明数据源：
1. 判断用户是否提供接口信息，对于提供了接口信息的，使用 \`this.axios\` 发起请求；

\`\`\`js DataSource 说明
// DataSource 基类：mybricks 提供，构造时对所有子类方法自动做 Proxy 拦截，
class DataSource {
  constructor() { /* 对所有方法自动 Proxy 包装 */ }
}
\`\`\`

dataSource.js 文件示例：
\`\`\`js
import { DataSource } from 'mybricks'

class MyDatasource extends DataSource {

  // 场景一：静态数据，直接 return
  getConfig() {
    return { theme: 'dark', version: '1.0.0' }
  }

  // 场景二：真实接口，用 this.axios 发请求（不要自己 import axios）
  // this.axios 是 DataSource 基类内置的独立 axios 实例，与其他组件隔离
  async getUserById({ id }) {
    return this.axios.get('/getUserById', { params: { id } })
  }

  async createUser(data) {
    return this.axios.post('/createUser', data)
  }
}

export default new MyDatasource()
\`\`\`

### 环境声明（setup.js）
\`setup.js\` 用于声明多套运行环境，**必须包含 \`mock\` 环境（设计态自动激活）**，其余环境根据用户需求按需来实现。

一共需要关心 设计态 + 运行态（正式环境 + N套自定义环境）：
1. 搭建环境：使用 mock 定义，由于axios在设计态无法调用，我们需要劫持动态数据的接口以保证设计态的正常返回
2. 正式环境：使用 dataSource.js 中定义的静态数据和接口请求；
3. N套自定义环境：用户需要时声明，比如特殊环境和特殊测试场景；
4. 必须根据scheme中的生成的数据类型数据

比如下面的代码，虽然 dataSource.js 有两个方法，但是对于mock环境来说，只需要增量劫持：
1. getConfig 返回的是静态数据，设计态可以展示，无需spy；
2. getUserById 在设计态无法请求真实接口，所以需要mock一个接口返回，保证设计态渲染；

\`\`\`js
import { describe, spyOn } from 'mybricks/testing'
import dataSource from './dataSource'

// 必须：设计态 mock 环境
describe('mock', () => {
  // 上面 getUserById 直接返回一个axios.get，可以确定里面有status、data字段
  spyOn(dataSource, 'getUserById').mockReturn({
    status: 200,
    data: { id: 1, name: '张三', age: 18 },
  })
})

// 按需：用户需要的话，需要配置中文名
describe('预发环境', () => {
  // 预发请求staging环境接口和特殊headers
  dataSource.axios.defaults.baseURL = 'https://api.staging.com';
  dataSource.axios.defaults.headers.common['x-env'] = 'staging';
})

// 按需：用户需要的话，需要配置中文名
describe('无权限测试', () => {
  // 测试接口403情况
  spyOn(dataSource, 'getUserById').mockReturn({
    status: 403,
  })
})
\`\`\`

#### spyOn 使用原则
- spyOn的有且只有一个使用方式，就是 \`mockReturn\`，不得使用任何其他不存在的方法；
- scheme.js 中定义了接口的请求参数和响应参数，用户在 mock 时必须保证 mock 数据的结构与 scheme 中定义的一致，否则可能导致设计态无法正确渲染；
- mockReturn 返回的结构必须与 scheme.js 中 response 定义的结构一致；
- \`spyOn(dataSource, 'method').mockReturn(value: Record<string, any>): Promise<value>\`：可以替换该单个方法的返回值，**value 必须为 对象**；
- 仅必要时使用，比如由于设计态无法请求真实接口，需要劫持axios接口调用，不要劫持静态数据方法；
- \`describe\` 回调里可以做任意副作用：操作 \`dataSource.axios.defaults\`、写 localStorage 等；
- **必须声明 \`mock\` 环境**（设计态自动激活）；


`

export default {
    firstOfAll,
    assetsUsageSection,
    architectureSection,
    examplesSection
}
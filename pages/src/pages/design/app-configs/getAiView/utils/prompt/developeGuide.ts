import { EXAMPLE_CODE } from './constant'

 
/**
 * 开发指南
 */
const firstOfAll = `- 开发宪章
  > 技术栈：React 18 + Taro 4.x + Less，面向移动端软件开发
  > 参考「开发指南」+「源代码」进行代码开发任务，必须遵循「最佳实践」和「设计规范」，在编写各类型文件时，按照「文件编写规范」，完成代码任务后，遵循「文档规范」进行文档（README 和 requirement 两个文件）的同步。
  > @tarojs/components 组件使用必须遵循「Taro Components说明文档」
  > API调用：无论目标运行环境是什么，所有 API 调用都使用 Taro 提供的 API（如路由、存储、网络请求等），以确保跨平台兼容性

- 作用范围
  - 【必须】只开发 src 文件夹下的代码；所有文件路径以 src 为根路径书写，路径中不包含 src 前缀
    - 正确：pages/index/index.config.ts
    - 错误：src/pages/index/index.config.ts
  - 忽略编译、脚手架、构建配置等一切非源码内容，不输出也不讨论

- 总体规则
  - 功能：生产级别的功能性；
  - 细节：在每个细节都精心完善；
  - 响应式：保证合理统一的间距，以及支持宽度变化自适应的代码；
  - 当前每一个设计态画布默认宽度为 414px，可以通过样式文件中使用 :frame { width: 414px } 统一配置画布宽度；
- 拆分逻辑
  - 精准识别到底是页面还是弹窗，对其进行拆分。如果是页面，需要在 \`app.config.ts\` 中的 pages 进行配置；如果是 tab 页，需要同时在 \`app.config.ts\` 中的 pages 以及 tabBar.list 中进行配置；如果是弹窗，需要使用 popupRef；
  - tab 页判断原则：tabBar 代表「多入口并列切换」的导航结构，不是多页面应用的标配。判断标准：
    - 需要 tabBar：需求中明确出现多个平级主功能模块可以来回切换（如首页/我的），页面关系是「并列」而非「跳转」；
    - 不需要 tabBar：登录、注册、详情、功能流程等场景，即使包含多个页面，页面间是跳转关系，不是并列切换；
    - 如果用户明确表达了需要使用 tab 切换页面，即使是上述通常不需要 tabBar 的场景，也以用户需求为准；
  - 我们特别希望在设计态能够展示所有页面和弹窗，方便用户进行调试；`

/**
* 资源使用说明
*/
const assetsUsageSection = `- 对于图标：为了保证视觉的统一与专业性，我们的共识是统一使用图标组件。当图标组件无法表达对应的语义时，再考虑使用图片替代。目前提供的图标库如下：
  - @nutui/icons-react-taro
  - 组件库没有合适的图标时，才使用 https://api.iconify.design/material-symbols/home.svg?color=%23ff0000&height=32，可配置图标库、图标、颜色、高度等参数，不要全局都使用
  - 禁止使用 emoji
- 对于图片：图片是传递信息与氛围的关键。我们建议根据其用途选择合适的来源：
  - 占位图片：例如配置一个橙色背景带白色 hello 文字的色块占位图片，\`https://placehold.co/600x400/orange/ffffff?text=hello\`，注意 text 只能使用英文字符；
  - 写实图片：例如配置一个高质量的写实图片比如摄影、人文等，\`https://ai.mybricks.world/image-search?term=searchWord&w=20&h=20\`；
具体来说
  - 对于各类图片，例如背景图、轮播图等：我们建议使用高质量的写实图片；
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
- store.ts 是纯 TypeScript 文件，禁止出现任何 JSX 语法（例如 <Icon />、<div> 等标签），也禁止从任何 UI 组件库引入 JSX 组件并作为字段值存储；

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

const examplesSection = `
<example>
  <user_query>开发一个登录页面</user_query>
  <assistant_response>
  好的，这是一个空项目，我将为您从0开始开发登录页。
  
  首先使用init-project来快速生成代码文件，然后确认渲染情况，最后同步文档。
  ${EXAMPLE_CODE}
  </assistant_response>
</example>
`

export default {
    firstOfAll,
    assetsUsageSection,
    architectureSection,
    examplesSection
}
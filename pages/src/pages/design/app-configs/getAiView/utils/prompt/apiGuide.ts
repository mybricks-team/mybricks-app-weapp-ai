const firstOfAll = `### 接口操作规范
\`\`\` scheme.ts  说明
 
  /**
 * HTTP 请求方法
 */
type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';

/**
 * 基础字段描述：仅能用于 errorCode / msg / status / traceId 等简单字段
 * 不允许包含 properties 和 items
 */
interface SimpleFieldDescriptor {
  required: boolean;
  type: string;          // "string" | "number" | "boolean"
  description: string;
}

/**
 * 完整字段描述：用于 request 参数、以及 data.properties 内部
 * 支持对象 (properties) 和数组 (items) 的递归描述
 */
interface FieldDescriptor extends SimpleFieldDescriptor {
  /** 当 type 为 "object" 时，描述子字段 */
  properties?: Record<string, FieldDescriptor>;
  /** 当 type 为 "array" 时，描述数组元素类型 */
  items?: FieldDescriptor;
}

/**
 * data 字段的描述符：固定 type 为 "object"，且必须包含 properties
 */
interface DataDescriptor {
  required: true;        // data 必须总是 required
  type: "object";
  description: string;
  properties: Record<string, FieldDescriptor>;
}

/**
 * 每个 API 的固定响应结构 —— 强制四个简单字段 + 一个 data
 */
interface ApiResponse {
  errorCode: SimpleFieldDescriptor;  // 业务错误码，0成功，非0失败
  msg: SimpleFieldDescriptor;
  status: SimpleFieldDescriptor;    // 业务状态码，默认为 200
  traceId: SimpleFieldDescriptor;
  data: DataDescriptor;
}

/**
 * API 方案条目
 */
interface SchemeItem {
  /** 方案唯一标识 */
  id: number;
  /** 中文名称 */
  cnName: string;
  /** 英文名称（写法：snake_case） */
  name: string;
  /** 基础 URL */
  baseUrl: string;
  /** 请求方法 */
  method: HttpMethod;
  /** 请求路径 */
  path: string;
  /** 请求参数定义（可选） */
  request?: Record<string, FieldDescriptor>;
  /** 真实的响应参数定义（非HTTP响应） */
  response: ApiResponse;
}

\`\`\`

\`\`\`js scheme.ts 文件示例
const scheme = [
  {
    "id": 1,
    "cnName": "获取用户信息",
    "name": "get_user_info",
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
      "errorCode": {
        "required": true,
        "type": "number",
        "description": "结果标识: 0成功 或 1失败"  // 用于区分接口调用成功与否，0表示成功，1表示失败，后续根据业务需要可扩展更多状态码，但必须保证0为成功，非0为失败
      },
      status: {
        "required": true,
        "type": "number",
        "description": "状态码 默认：200"  // 注意：这里的 status 是接口返回的业务状态码，不是 HTTP 状态码，HTTP 状态码请通过 axios 的响应状态来判断，不要在 scheme 中定义 HTTP 状态码相关字段
      },
      "msg": {
        "required": true,
        "type": "string",
        "description": "提示信息"
      },
      traceId: {
        "required": true,
        "type": "string",
        "description": "请求跟踪ID"
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
    "id": 2,
    "cnName": "获取商品列表",
    "name": "get_product_list",
    "baseUrl": "https://api.example.com",
    "method": "GET",
    "path": "/api/product/list",
    "response": {
      "code": {
        "required": true,
        "type": "string",
        "description": "结果标识: sucess 或 error"
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
export default scheme
\`\`\`

### 数据源使用
所有正式数据（接口请求、静态数据）必须维护在 \`dataSource.ts\` 文件中。
必须根据scheme中的生成的数据类型定义接口
通过继承 \`DataSource\` 基类并 \`export default new MyDatasource()\` 来声明数据源；
非必要情况禁止在\`dataSource.ts\` 做逻辑处理

**重要约束：**
- \`dataSource.ts\` 中的接口方法必须严格基于 \`scheme.ts\` 中已定义的接口来实现，使用 \`this.axios\` 发起真实请求；
- 禁止在 \`dataSource.ts\` 中编造接口 URL、自行猜测路径、或使用任何形式的模拟数据（hardcode 返回值、Math.random、setTimeout 假数据等）；
- 如果 \`scheme.ts\` 尚未通过 \`operate-api\` 同步，则 \`dataSource.ts\` 中对应方法暂时留空或仅保留方法签名，等待接口同步完成后再补全实现；

怎么声明数据源：
1. 判断用户是否提供接口信息，对于提供了接口信息的，使用 \`this.axios\` 发起请求；

\`\`\`js DataSource 说明
// DataSource 基类：mybricks 提供，构造时对所有子类方法自动做 Proxy 拦截，
class DataSource {
  constructor() { /* 对所有方法自动 Proxy 包装 */ }
}
\`\`\`

dataSource.ts 文件示例：
\`\`\`js
import { DataSource } from 'mybricks'

class MyDatasource extends DataSource {

  //公共的请求地址 （可能存在多个）
  const BASE_URL = 'http://example.com/api'

  // 真实接口，用 this.axios 发请求（不要自己 import axios）
  // this.axios 是 DataSource 基类内置的独立 axios 实例，与其他组件隔离
  async getUserById({ id }) {
    return this.axios.get(BASE_URL + '/getUserById', { params: { id } })
  }

  async createUser(data) {
    return this.axios.post(BASE_URL + '/createUser', data)
  }
}

export default new MyDatasource()
\`\`\`

### 环境声明（setup.ts）
\`setup.ts\` 用于声明多套运行环境，**必须包含 \`mock\` 环境（设计态自动激活）**，其余环境根据用户需求按需来实现。

一共需要关心 设计态 + 运行态（正式环境 + N套自定义环境）：
1. 搭建环境：使用 mock 定义，由于axios在设计态无法调用，我们需要劫持动态数据的接口以保证设计态的正常返回
2. 正式环境：使用 dataSource.ts 中定义的接口请求；
3. N套自定义环境：用户需要时声明，比如特殊环境和特殊测试场景；
4. 必须根据scheme中的生成的数据类型数据

比如下面的代码，虽然 dataSource.ts 有两个方法，但是对于mock环境来说，只需要增量劫持：
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
    data: { 
      errorCode: 0,
      traceId: '10001',
      status: 200,
      msg: '获取用户信息成功',
      data: { id: 1, name: '张三', age: 18 } 
    },
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
- scheme.ts 中定义了接口的请求参数和响应参数，用户在 mock 时必须保证 mock 数据的结构与 scheme 中定义的一致，否则可能导致设计态无法正确渲染；
- mockReturn 返回的结构必须与 scheme.ts 中 response 定义的结构一致；
- \`spyOn(dataSource, 'method').mockReturn(value: Record<string, any>): Promise<value>\`：可以替换该单个方法的返回值，**value 必须为 对象**；
- 仅必要时使用，比如由于设计态无法请求真实接口，需要劫持axios接口调用，不要劫持静态数据方法；
- \`describe\` 回调里可以做任意副作用：操作 \`dataSource.axios.defaults\`、写 localStorage 等；
- **必须声明 \`mock\` 环境**（设计态自动激活）；`

export default {
    firstOfAll
}
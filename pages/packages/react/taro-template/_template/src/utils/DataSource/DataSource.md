# DataSource 基类

- 可以通过 axios 的方式调用接口。
- 拥有独立的实例，可通过 this.axios.defaults 修改 baseURL / headers。

```ts
import DataSource from './DataSource'

class PetDataSource extends DataSource {
  this.axios.defaults.baseURL = 'https://api.example.com'
  this.axios.defaults.headers.common['Authorization'] = 'token'

  async getFeedList({ page = 1, pageSize = 10 }) {
    return this.axios.get('/modularity/project1719969521236430/api_feed_list', {
      params: { page, pageSize }
    })
  }

  async createComment({ feedId, userId, content, replyTo }) {
    return this.axios.post('/modularity/project1719969521236430/api_comment_create', {
      feedId, userId, content, replyTo
    })
  }
}
```

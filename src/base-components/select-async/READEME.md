#  SelectAsync
一个基于`Antd`内的`Select`二次封装的`Select`插件，主要功能用法与`antd`内的`Select`完全相同，增加了请求的相关配置
##  为什么二次封装 Select
为了实际项目开发中能够快速、简单的使用`Select`，不再单独处理异步请求过来的数据，这些都已在`SelectAsync`中统一处理
>目前SelectAsync子组件只内置了`Option`，并没有对`OptionGroup`做对应的处理，如果后期开发需要，再做增加
##  API
```
<SelectAsync 
  url="/path/data" 
  requestOptions={{method:'get', ...}} 
  optionField={{value:'code', text: 'name'}} 
  ...
</SelectAsync>
```
## 使用方法
Option|default|type|Description
:----:|:-----:|:--:|:------:
url   |''     |string|请求路径
requestOptions|{ }（默认同fetch）|object|请求配置（使用fetch）
optionsField|{ }（详见 <a href='#optionsField'>optionsField 配置</a>）|object|设置下拉项的value和text文本
dataOrigin|null（即直接把返回数据当作数据源）|string|设置下拉框基于返回数据的数据源，如：dataOrigin='data'，则下来框数据源为：response.data
renderOptions | null | function(data, Select){} | 自定义渲染Option的方法， data：请求到的数据；Select： 当前下拉框ReactNode对象（配置后，则optionsField无效）
record
... | ... | ... | 其他 Antd Select Props
>对onChange函数做了扩展，参数由`value,option`扩展为`value,option,record`，record为`object or array`，单选为`object`，多选为`array`，数据为选中的行数据记录
#### <a name='optionsField'>optionsField 配置</a>
Option|default|type|Description
:----:|:-----:|:--:|:------:
value| '' | string \| array | 设置下拉框选项的value值
text| '' | string \| array | 设置下拉框选项的文本值
separator| '-' | string | 当value为array时，将多个字段值拼接成字符串的连接符
textSeparator| '-' | string | 当text为array时，将多个字段值拼接成字符串的连接符
##  方法
method|Description
:----:|:-----:
load( [params] )| 重新加载下拉框选项数据，参数可选
...| 其他 Antd Select Methods



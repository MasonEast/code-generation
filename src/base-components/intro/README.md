在 intro.js-react 的引导功能上增加了默认配置，简化代码。
# Usage
```js
import Steps from '_baseComponents/intro'

<Steps
    steps={steps}
    enabled={introEnabled}
    options={options}
    onExit={this.onExit}
    onChange={this.onChange}
    getRef={ref => (this.getIntro = ref)}
/>
```

# Props
steps： PropTypes.array  
必传，每一步的步骤 element 为选择器，intro 为引导文案。
```js
const steps = [
  {
    element: '.selector1',
    intro: 'test 1',
  },
  {
    element: '.selector2',
    intro: 'test 2',
  },
  {
    element: '.selector3',
    intro: 'test 3',
  },
];
```
enabled: PropTypes.bool
必传，是否开启引导，默认是 false。

storageName: PropTypes.string
必传，引导字段存储在 localstorage 中的 key 值，当引导一次后不在出现。

expireTime: PropTypes.object
引导的过期时间，startTime: 上线时间。 deadlineTime：截止时间。 时间不在范围内不显示引导。
```js
const time = {
  startTime: '2020-1-1',
  deadlineTime: '2020-01-30',
}
```
initialStep: PropTypes.number
引导从哪一步开始，默认是0

options：PropTypes.object 
各种配置项。

getRef: PropTypes.function
获得实例

onChange(nextStepIndex, nextElement)
步骤改变时的回调函数

onExit(stepIndex)
离开时的回调。

其它具体属性参考 https://github.com/HiDeoo/intro.js-react#introjs-options


# Instance API
updateStepElement()
初始化时不能获得异步加载的 dom，使用 updateStepElement() 再次执行。
```js
<Steps
  enabled={stepsEnabled}
  steps={steps}
  ref={steps => (this.steps = steps)}
/>

onBeforeChange = nextStepIndex => {
  if (nextStepIndex === 4) {
    this.steps.updateStepElement(nextStepIndex);
  }
}
```





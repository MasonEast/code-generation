### 两种类型的分页组件 通过传入的type区分 
#### 1.如果传入的type为'cerp' 将使用原erp系统分页（订单、库存接口） 带可输入页码跳转、刷新获取总条数按钮
```
  pagination={{
      type:'cerp',                            // 非必须 如果不传将使用 无刷新获取总页数 的组件
      pageSize: pageSize,                     // 非必须 默认使用 pageSizeOptions[0]
      pageSizeOptions: [10, 20, 50, 100],     // 非必须 默认[50,100,200,500]
      page:page,                              // 非必须 默认1 第一页
      total:total,                            // 必须   真实的总条数
      falseTotal:5000000,                     // 必须  （不填默认使用1000000 影响结果)
      onPageChange:this.onPageChange,         // 非必须 页面改变回调 Function(page, pageSize)
      onPageSizeChange:this.onPageSizeChange, // 非必须 每页大小改变 Function(page, pageSize)
      refreshTotal:this.refreshTotal,         // 必须 返回一个promise的方法 返回值为total
  }}
```

#### 2.如果未传入type 将使用新版分页（直接显示总条数、无输入跳转至对应页按钮）
```
   pagination={{
       pageSize: pageSize,                     // 非必须 默认使用 pageSizeOptions[0]
       pageSizeOptions: [10, 20, 50, 100],     // 非必须 默认[50,100,200,500]
       page:page,                              // 非必须 默认1 第一页
       total:total,                            // 必须   真实的总条数
       onPageChange:this.onPageChange,         // 非必须 页面改变回调 Function(page, pageSize)
       onPageSizeChange:this.onPageSizeChange, // 非必须 每页大小改变 Function(page, pageSize)
   }}
```
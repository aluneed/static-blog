直接使用material angular的组件, 会出现字体问题  
不会使用全局定义的font family, 而是会使用组件自带的`Roboto, "Helvetica Neue", sans-serif`

只有和路由有关的组件才能通过ActivatedRoute获取路由信息?  


踩坑: 
试图通过
`contentIndex: ContentMeta[] = this.pageService.indexBuffer;`
来同步indexBuffer的数据
这里虽然是引用传递, 但是在indexBuffer的处理中并没有对indexBuffer进行操作, 而是直接赋了一个新值, 导致引用发生了变化  
contentIndex还是老的引用, 因此页面没有发生相应的变化

如果要保持代码整洁, 最好采用subscribe, 或者对indexBuffer进行数组操作




感觉我没有掌握到debug的方法



filter和分页重构了  
没有做好状态管理  
Component中还保存了状态, 刷新页面之后状态也会被重置  
设计从一开始就有问题  



console.log()的表现似乎有些出人意料  
试图多次通过它打印数组的不同状态, 虽然总览外面看着是对的, 但是一旦在浏览器的console中点击展开, 所有的输出都变成了和最后一条输出相同的内容  



# index

构建索引从先构建再打包改为先打包再构建索引并且复制资源文件到dist中  
这样可以保证资源文件目录结构一致, 并且无需修改md文档中的url相对路径


# md文档图片资源相对目录问题

通过marked.js的baseUrl进行设置

# todo

rxjs subscribe  
config service and configurations


# github pages 404 问题

https://www.jianshu.com/p/2c017c998501
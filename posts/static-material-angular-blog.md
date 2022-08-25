<!--meta
id: 1
title: static blog
date: 2022-07-19
tags: frontend, angular, material, blog, typescript, tag1
category: categoryTest
type: typeTest
path: blog-on-deno
abstract: testAbstract
meta-->

# 问题

有办法根据访问者的ip分别路由到azure/oracle/cloudflare上吗  

# 

虽然之前用angular和quarkus分别写了博客前后端, 但实际上还是存在管理和部署上的麻烦  

[分析问题]

ssr也始终是一个问题  

由于没有使用docker, 切换到新的服务器时总是需要再搭一遍环境  

另外就是页面的交互很难说得上好, 没有丝毫的过渡动画, 也没有成套的的ui设计  

静态博客虽然免不了在每次修改时都进行索引, 但完善索引脚本之后或许也不是什么问题  

# angular material

ng new 初始化项目折腾了半天, 会有一些包的版本冲突  
好像是淘宝的npm镜像源中angular版本有问题  

## 使用

  git clone ..
  ng new static-blog
  cd static-blog
  ng add @angular/material

  需要选择custom theme

不要用sudo 不然还得改文件权限, 很麻烦

##

https://material.angular.cn/guide/theming
这里的介绍都是在选择自定义主题
  ? Choose a prebuilt theme name, or "custom" for a custom theme: Custom
后, 
在新创建的文件中
  CREATE src/custom-theme.scss (1463 bytes)
也就是`./src/custom-theme.scss`中进行修改的

https://material.io/design/color/the-color-system.html#tools-for-picking-colors
调色板工具

选择`View in color tool`进入ui预览查看颜色, 设置字体颜色

右上角可以导出, 然而没有scss的选项
codepen倒是可以生成html+css+js配置

需要在
```
$indigo-palette: (
 50: #e8eaf6,
 100: #c5cae9,
 200: #9fa8da,
 300: #7986cb,
 // ... continues to 900
 contrast: (
   50: rgba(black, 0.87),
   100: rgba(black, 0.87),
   200: rgba(black, 0.87),
   300: white,
   // ... continues to 900
 )
);
```
中来进行自己的调色板配置
contrast中填入的是凸显差异化的颜色  
主要用于字体显示?  

实际build之后contrast: (处出现错误
https://stackoverflow.com/questions/66124756/sasserror-expected
没用

https://stackoverflow.com/questions/41440998/how-can-i-use-custom-theme-palettes-in-angular

最后发现scss的变量定义是有顺序的  
scss很类似于一个脚本文件, 而非编译型的文件  

```
botanical {
  color: #3E5D58;
  color: #92ACA0;
  color: #DDE5ED;
  color: #D2CFC7;
}
```

## sidenav

angular material的sidenav是一体式的  
有一个部分放侧边栏, 另一部分放主体部分

https://stackoverflow.com/questions/66391290/angular-material-using-sidenav-and-toolbar-as-re-usable-components

toolbar的html中无法引用sidenav  
关于模板变量引用  
https://angular.cn/guide/template-reference-variables


## html section和main

angular官网用了, mdn上有相关文档  

https://developer.mozilla.org/zh-CN/docs/Web/HTML/Element/section  
https://developer.mozilla.org/zh-CN/docs/Web/HTML/Element/main
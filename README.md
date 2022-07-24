# StaticBlog

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 13.3.7.

## How to Use

```sh
cd the/path/you/like
```
```sh
git clone https://github.com/aluneed/static-blog.git
cd ./static-blog
```
run npm install at the first time to use
```sh
npm install
```

copy the md files and image assets or some others into `./posts`  
<br>  

run dev server locally on port 4200 or any other port, go `localhost:4200` to browse up the blog  
```sh
deno run -A ./index-generator.ts
ng s --port 4200
```
build the static blog
```sh
deno run -A ./index-generator.ts
ng build
```
`deno run -A ./index-generator.ts` generates the index and count the tags in the md files  
<br>

the build result is in the `./dist`

host the directory(named `static-blog` by default) to an http server 

## Environment Currently Used

```
> node --version
v16.15.0

> npm --version
8.11.0

> deno --version
deno 1.23.2 (release, aarch64-apple-darwin)
v8 10.4.132.8
typescript 4.7.2

> ng --version

     _                      _                 ____ _     ___
    / \   _ __   __ _ _   _| | __ _ _ __     / ___| |   |_ _|
   / △ \ | '_ \ / _` | | | | |/ _` | '__|   | |   | |    | |
  / ___ \| | | | (_| | |_| | | (_| | |      | |___| |___ | |
 /_/   \_\_| |_|\__, |\__,_|_|\__,_|_|       \____|_____|___|
                |___/


Angular CLI: 13.3.7
Node: 16.15.0
Package Manager: npm 8.11.0
OS: darwin arm64

Angular: 13.3.10
... animations, common, compiler, compiler-cli, core, forms
... platform-browser, platform-browser-dynamic, router

Package                         Version
---------------------------------------------------------
@angular-devkit/architect       0.1303.7
@angular-devkit/build-angular   13.3.7
@angular-devkit/core            13.3.7
@angular-devkit/schematics      13.3.7
@angular/cdk                    13.3.8
@angular/cli                    13.3.7
@angular/material               13.3.8
@schematics/angular             13.3.7
rxjs                            7.5.5
typescript                      4.6.4
```

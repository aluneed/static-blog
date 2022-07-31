import { copy, emptyDir } from "https://deno.land/std@0.148.0/fs/mod.ts";

console.log(await Deno.stat("./"));
emptyDir("./docs")
await copy("./dist/static-blog/index.html", "./dist/static-blog/404.html", { overwrite: true });
await copy("./dist/static-blog", "./docs", { overwrite: true });
await copy("./CNAME", "./docs/CNAME", { overwrite: true });
console.log("success");
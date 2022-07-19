import { readLines } from "https://deno.land/std@0.148.0/io/buffer.ts";
import { walk } from "https://deno.land/std@0.148.0/fs/walk.ts";
import * as datetime from "https://deno.land/std@0.148.0/datetime/mod.ts";
import { copy } from "https://deno.land/std@0.148.0/fs/mod.ts";

export async function getPropFromMDFile(path: string): Promise<Map<string, string>> {
    const file = await Deno.open(path);
    const map: Map<string, string> = new Map();
    for await (const line of readLines(file)) {
        if (line == "<!--") {
            continue;
        }
        if (line == "-->") {
            break;
        }
        var tuple = line.replace(" ", "").split(":");
        if (tuple.length != 2) {
            continue;
        }
        map.set(tuple[0], tuple[1]);
    }
    map.set("path", path.split("/").pop());
    file.close();
    return map;
}

export async function generateIndex(path: string, destination: string) {
    const metaInfoList: Map<string, string>[] = [];

    for await (const entry of walk(path, { includeDirs: false, maxDepth: 1 })) {
        var path = entry.path
        console.log(path);
        var map = await getPropFromMDFile(path);
        console.log(map);
        metaInfoList.push(map);
        console.log(Object.fromEntries(map));
    }

    var orderedJsonStringList: string[] = metaInfoList.sort((a, b) => {
        var dateA = a.get("date") == undefined ? "1800-01-01" : a.get("date");
        var dateB = b.get("date") == undefined ? "1800-01-01" : b.get("date");
        var dateNumA = datetime.parse(dateA, "yyyy-MM-dd").getTime();
        var dateNumB = datetime.parse(dateB, "yyyy-MM-dd").getTime();
        return dateNumA - dateNumB;
    })
    .map(e => Object.fromEntries(e))
    .map(e => JSON.stringify(e));

    await Deno.writeTextFile(destination, "export const contentIndex = [\n");
    for(var i = 0; i < orderedJsonStringList.length; i++) {
        if (i < orderedJsonStringList.length - 1) {
            await Deno.writeTextFile(destination, "  " + orderedJsonStringList[i] + ",\n", {append: true});
        } else {
            await Deno.writeTextFile(destination, "  " + orderedJsonStringList[i] + "\n]", { append: true});
        }
    }

    return metaInfoList;
}

generateIndex("./posts", "./src/app/content-index.ts")

copy("./posts", "./src/assets/posts", {overwrite: true})
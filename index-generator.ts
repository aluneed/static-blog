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
        const tuple = line.replace(/: */, "::::").split("::::");  //only split with the first ":"
        if (tuple.length != 2) {
            continue;
        }
        map.set(tuple[0], tuple[1]);
    }
    map.set("path", path);
    file.close();
    return map;
}

export async function generateIndexAndCountTags(path: string, destination: string) {
    const metaInfoList: Map<string, string>[] = [];

    for await (const entry of walk(path, { includeDirs: false, maxDepth: 1 })) {
        const path = entry.path
        if (!path.match(".md")) {
            continue;
        }
        const map = await getPropFromMDFile(path);
        metaInfoList.push(map);
    }

    const tagsCountingMap: Map<string, number> = new Map();
    const orderedJsonStringList: string[] = metaInfoList
        .sort((a, b) => {
            const dateA = a.get("date") == undefined ? "1800-01-01" : a.get("date");
            const dateB = b.get("date") == undefined ? "1800-01-01" : b.get("date");
            const dateNumA = datetime.parse(dateA, "yyyy-MM-dd").getTime();
            const dateNumB = datetime.parse(dateB, "yyyy-MM-dd").getTime();
            return dateNumA - dateNumB;
        })
        .map(e => Object.fromEntries(e))
        .map(e => {
            e['tags'].replace(/, */g, ",").split(",").forEach(tag => {  //"g" in regex is a modifier. ref js
                if (tagsCountingMap.has(tag)) {
                    tagsCountingMap.set(tag, tagsCountingMap.get(tag)! + 1);
                } else {
                    tagsCountingMap.set(tag, 1);
                }
            })
            return e;
        })
        .map(e => JSON.stringify(e));

    console.log(tagsCountingMap);
    const tagsPath = destination + "/tags.ts";
    await Deno.writeTextFile(tagsPath,
        "export interface Tag {\n" +
        "    name: string\n" +
        "    count: number\n" +
        "}\n\n" +
        "export const tags: Tag[] = [\n"
    );
    for (const entry of tagsCountingMap.entries()) {
        const obj = {"name": entry[0], "count": entry[1]}
        // console.log(entry);
        // console.log(obj);
        console.log(JSON.stringify(obj));
        await Deno.writeTextFile(tagsPath, "  " + JSON.stringify(obj) + ",\n", { append: true });
    };
    await Deno.writeTextFile(tagsPath, "]", { append: true });

    const contentIndexPath = destination + "/content-index.ts";
    await Deno.writeTextFile(contentIndexPath, "export const contentIndex = [\n");
    for(let i = 0; i < orderedJsonStringList.length; i++) {
        if (i < orderedJsonStringList.length - 1) {
            await Deno.writeTextFile(contentIndexPath, "  " + orderedJsonStringList[i] + ",\n", {append: true});
        } else {
            await Deno.writeTextFile(contentIndexPath, "  " + orderedJsonStringList[i] + "\n]", {append: true});
        }
    }

    return metaInfoList;
}

generateIndexAndCountTags("./posts", "./src/app")

copy("./posts", "./src/assets/posts", {overwrite: true})
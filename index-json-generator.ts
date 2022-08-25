import { readLines } from "https://deno.land/std@0.148.0/io/buffer.ts";
import { walk } from "https://deno.land/std@0.148.0/fs/walk.ts";
import * as datetime from "https://deno.land/std@0.148.0/datetime/mod.ts";
import { copy } from "https://deno.land/std@0.148.0/fs/mod.ts";
// import { TSMap } from "typescript-map"

export async function getPropFromMDFile(path: string): Promise<Map<string, string>> {
    const file = await Deno.open(path);
    const map: Map<string, string> = new Map();
    for await (const line of readLines(file)) {
        if (line == "<!--meta") {
            continue;
        }
        if (line == "meta-->") {
            break;
        }
        const tuple = line.replace(/: */, "::::").split("::::");  //only split with the first ":"
        if (tuple.length != 2) {
            continue;
        }
        map.set(tuple[0], tuple[1]);
    }
    map.set("path", path.replace(/\\/g, "/").split("/").pop()!);  //replace '\' for windows
    file.close();
    return map;
}

export async function generateIndexAndCountTags(postPath: string, jsonDestination: string) {
    const metaInfoList: Map<string, string>[] = [];

    for await (const entry of walk(postPath, { includeDirs: false, maxDepth: 1 })) {
        const path = entry.path
        if (!path.match(".md")) {
            continue;
        }
        const map = await getPropFromMDFile(path);
        metaInfoList.push(map);
    }

    const tagsCountingMap: Map<string, number> = new Map();
    const orderedMetaInfoJsonStringList: string[] = metaInfoList
        .sort((a, b) => {
            const dateA = a.get("date") == undefined ? "1800-01-01" : a.get("date");
            const dateB = b.get("date") == undefined ? "1800-01-01" : b.get("date");
            const dateNumA = datetime.parse(dateA!, "yyyy-MM-dd").getTime();
            const dateNumB = datetime.parse(dateB!, "yyyy-MM-dd").getTime();
            return dateNumA - dateNumB;
        })
        .map(metaInfoMap => {
            const tagList: string[] = metaInfoMap.get("tags")!.replace(/, */g, ",").split(",");
            tagList.forEach(tag => {  //"g" in regex is a modifier. ref js
                if (tagsCountingMap.has(tag)) {
                    tagsCountingMap.set(tag, tagsCountingMap.get(tag)! + 1);
                } else {
                    tagsCountingMap.set(tag, 1);
                }
            })
            return {
                id: Number(metaInfoMap.get("id")), title: metaInfoMap.get("title"), date: metaInfoMap.get("date"), 
                tags: tagList, category: metaInfoMap.get("category"), 
                type: metaInfoMap.get("type"), path: metaInfoMap.get("path")
            }
        })
        .map(e => JSON.stringify(e));

    const indexJsonString: string = "[\n  "
        + orderedMetaInfoJsonStringList.reduce((accumulated, value) => accumulated + ",\n  " + value)
        + "\n]";
    const indexPath = jsonDestination + "/index.json";
    console.log(indexJsonString);
    await Deno.writeTextFile(indexPath, indexJsonString, {append: false});

    const tagsJsonString: string = "[\n"
        + Array.from(tagsCountingMap.entries())
            .map(entry => "  {\"name\":\"" + entry[0] + "\",\"count\":" + entry[1] + "}")
            .reduce((accumulated, value) => accumulated + ",\n" + value)
        + "\n]";
    console.log(tagsJsonString);
    const tagsPath = jsonDestination + "/tags.json";
    await Deno.writeTextFile(tagsPath, tagsJsonString, { append: false });

    return metaInfoList;
}

const sourcePath: string = Deno.args[0];  //"./posts"
const destinationPath: string = Deno.args[1];  //"./src/assets"
const directoryName: string = sourcePath.replace(/\\/g, "/").split("/").pop()!;

generateIndexAndCountTags(sourcePath, destinationPath);
copy(sourcePath, destinationPath + "/" + directoryName, {overwrite: true});

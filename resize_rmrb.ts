// deno run --allow-read --allow-write --allow-env --allow-ffi resize_rmrb.ts
import sharp from "npm:sharp@next"
import { rmrbPath } from "./models/rmrb/api.ts"

let twoPage = 0
const papers = new Map<string, Uint8Array>()
for await (const item of Deno.readDir(rmrbPath)) {
  if (!item.isFile || !item.name.toLowerCase().endsWith(".jpg")) continue
  const paper = await Deno.readFile(`${rmrbPath}/${item.name}`)
  papers.set(item.name.split(".")[0], paper)
}
const sortedPapers = Array.from(papers.entries())
  .sort(([keyA], [keyB]) => parseInt(keyA) - parseInt(keyB))
  .map(([, value]) => value)
for (let index = 0; index < sortedPapers.length; index++) {
  const paper = sortedPapers[index]
  let keyint = index + 1
  const sharpPaper = sharp(paper)
  const metadata = await sharpPaper.metadata()
  const width = metadata.width
  const height = metadata.height
  keyint += twoPage
  if (width && height && width > height) {
    const paperWith = width / 2
    const paper1 = await sharpPaper.extract({ left: 0, top: 0, width: paperWith, height }).jpeg({ quality: 100 }).toBuffer()
    await Deno.writeFile(`${rmrbPath}/${keyint.toString().padStart(3, "0")}.jpg`, paper1)
    twoPage++
    keyint++
    const sharpPaper2 = sharp(paper)
    const paper2 = await sharpPaper2.extract({ left: paperWith, top: 0, width: paperWith, height }).jpeg({ quality: 100 }).toBuffer()
    await Deno.writeFile(`${rmrbPath}/${keyint.toString().padStart(3, "0")}.jpg`, paper2)
  }
  else {
    // const resized = await sharpPaper.resize({ height: 2048 }).jpeg({ quality: 100 }).toBuffer()
    await Deno.writeFile(`${rmrbPath}/${keyint.toString().padStart(3, "0")}.jpg`, paper)
  }
}
const textEncoder = new TextEncoder()
await Deno.writeFile(`${rmrbPath}/size.txt`, textEncoder.encode(`${sortedPapers.length + twoPage}`))
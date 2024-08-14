// deno run --allow-net --allow-read --allow-write --allow-env --allow-ffi get_gxrb.ts
import { url, RBBODY, paperPath, gxrbPath } from "./models/gxrb/api.ts"
// import { resize } from "https://deno.land/x/deno_image@0.0.4/mod.ts"
import { exists } from "https://deno.land/std@0.224.0/fs/mod.ts"
import sharp from "npm:sharp@next"

const now = new Date()
console.time('Execution Time')
now.setHours(now.getHours() + 8)
const dateString = now.toISOString().split('T')[0]

const res = await fetch(`${url}/json/interface/epaper/api.php?name=gxrb&date=${dateString}&code=001&v=j4&cb=&_=${Math.round(new Date().getTime() / 1000)}`)
const body: RBBODY = await res.json()

const keys = Object.keys(body.list)

if (!await exists(paperPath)) {
  await Deno.mkdir(paperPath)
}
if (!await exists(gxrbPath)) {
  await Deno.mkdir(gxrbPath)
}

const textEncoder = new TextEncoder()

console.log(`当前报纸日期：${body.riqi}`)
await Deno.writeFile(`./date_gxrb.txt`, textEncoder.encode(`${body.riqi}`))

let twoPage = 0
const papers: Uint8Array[] = []
// await Promise.all(
//   keys.map(async (key) => {
//   })
// )
for (const key of keys) {
  const item = body.list[key]
  let keyint = papers.length + 1
  try {
    keyint = parseInt(key)
  } catch (error) {
    console.error(error)
  }
  const response = await fetch(`${url}${item.zhentu.lujing}`)
  const paper = await response.bytes()
  papers.push(paper)
  const sharpPaper = sharp(paper)
  const metadata = await sharpPaper.metadata()
  const width = metadata.width
  const height = metadata.height
  keyint += twoPage
  if (width && height && width > height) {
    const paperWith = width / 2
    const paper1 = await sharpPaper.extract({ left: 0, top: 0, width: paperWith, height }).resize({ height: 2048 }).jpeg({ quality: 100 }).toBuffer()
    await Deno.writeFile(`${gxrbPath}/${keyint.toString().padStart(3, "0")}.jpg`, paper1)
    twoPage++
    keyint++
    const sharpPaper2 = sharp(paper)
    const paper2 = await sharpPaper2.extract({ left: paperWith, top: 0, width: paperWith, height }).resize({ height: 2048 }).jpeg({ quality: 100 }).toBuffer()
    await Deno.writeFile(`${gxrbPath}/${keyint.toString().padStart(3, "0")}.jpg`, paper2)
  }
  else {
    // const resized = await resize(paper, { width: 2048, height: 2048 })
    const resized = await sharpPaper.resize({ height: 2048 }).jpeg({ quality: 100 }).toBuffer()
    await Deno.writeFile(`${gxrbPath}/${keyint.toString().padStart(3, "0")}.jpg`, resized)
  }
}
await Deno.writeFile(`${gxrbPath}/size.txt`, textEncoder.encode(`${keys.length + twoPage}`))
console.timeEnd('Execution Time')

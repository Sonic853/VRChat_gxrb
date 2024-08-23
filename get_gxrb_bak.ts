// deno run --allow-net --allow-read --allow-write --allow-env --allow-ffi get_gxrb.ts
import { url, urlhttp, RBBODY, paperPath, gxrbPath } from "./models/gxrb/api.ts"
// import { resize } from "https://deno.land/x/deno_image@0.0.4/mod.ts"
import { exists } from "https://deno.land/std@0.224.0/fs/mod.ts"
import sharp from "npm:sharp@next"

const now = new Date()
console.time('Execution Time')
now.setHours(now.getHours() + 8)
const dateString = now.toISOString().split('T')[0]

const res = await fetch(`${urlhttp}/json/interface/epaper/api.php?name=gxrb&date=${dateString}&code=001&v=j4&cb=&_=${Math.round(new Date().getTime() / 1000)}`,{
  "headers": {
    "accept": "*/*",
    "accept-language": "zh-CN,zh;q=0.9,en;q=0.8,en-GB;q=0.7,en-US;q=0.6",
    "sec-ch-ua": "\"Not)A;Brand\";v=\"99\", \"Microsoft Edge\";v=\"127\", \"Chromium\";v=\"127\"",
    "sec-ch-ua-mobile": "?0",
    "sec-ch-ua-platform": "\"Windows\"",
    "sec-fetch-dest": "script",
    "sec-fetch-mode": "no-cors",
    "sec-fetch-site": "same-site",
    "Referer": "https://gxrb.gxrb.com.cn/",
    "Referrer-Policy": "strict-origin-when-cross-origin"
  },
  "body": null,
  "method": "GET"
})
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
const loadPapers = new Map<string, Uint8Array>()
await Promise.all(
  keys.map(async (key) => {
    const item = body.list[key]
    const response = await fetch(`${url}${item.zhentu.lujing}`)
    const paper = await response.bytes()
    loadPapers.set(key, paper)
  })
)
const sortedPapers = Array.from(loadPapers.entries())
  .sort(([keyA], [keyB]) => parseInt(keyA) - parseInt(keyB))
  .map(([, value]) => value)
for (let index = 0; index < sortedPapers.length; index++) {
  const paper = sortedPapers[index]
  let keyint = index + 1
  // try {
  //   keyint = parseInt(key)
  // } catch (error) {
  //   console.error(error)
  // }
  // const response = await fetch(`${url}${item.zhentu.lujing}`)
  // const paper = await response.bytes()
  // papers.set(key, paper)
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

// deno run --allow-net --allow-write get_gxrb.ts
import { url, RBBODY } from "./models/api.ts"
import { resize } from "https://deno.land/x/deno_image@0.0.4/mod.ts"
import { exists } from "https://deno.land/std@0.224.0/fs/mod.ts"

const now = new Date()
console.time('Execution Time')
now.setHours(now.getHours() + 8)
const dateString = now.toISOString().split('T')[0]

const res = await fetch(`${url}/json/interface/epaper/api.php?name=gxrb&date=${dateString}&code=001&v=j4&cb=&_=${Math.round(new Date().getTime() / 1000)}`)
const body: RBBODY = await res.json()

const keys = Object.keys(body.list)

if (!await exists("./paper"))
{
  Deno.mkdir("./paper")
}

  await Deno.writeFile(`./paper/size.txt`, new TextEncoder().encode(`${keys.length}`))

await Promise.all(
  keys.map(async (key) => {
    const item = body.list[key]
    const response = await fetch(`${url}${item.zhentu.lujing}`)
    const paper = await response.bytes()
    const resized = await resize(paper, { width: 2048, height: 2048 })
    await Deno.writeFile(`./paper/${key}.jpg`, resized)
  })
)
console.timeEnd('Execution Time')
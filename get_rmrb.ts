// deno run --allow-net --allow-read --allow-write get_rmrb.ts
import { paperPath, pdfPath, rmrbPath, rmrbpdfath, url } from "./models/rmrb/api.ts"
import { exists } from "https://deno.land/std@0.224.0/fs/mod.ts"

if (!await exists(pdfPath)) {
  Deno.mkdir(pdfPath)
}
if (!await exists(rmrbpdfath)) {
  Deno.mkdir(rmrbpdfath)
}
if (!await exists(paperPath)) {
  Deno.mkdir(paperPath)
}
if (!await exists(rmrbPath)) {
  Deno.mkdir(rmrbPath)
}

const now = new Date()
console.time('Execution Time')
now.setHours(now.getHours() + 8)
const _now = new Date()
_now.setHours(_now.getHours() + 8)
let year = _now.getFullYear().toString()
let month = (_now.getMonth() + 1).toString().padStart(2, "0")
let day = _now.getDate().toString().padStart(2, "0")

let size = 1
let getFiled = false

while (true) {
  const ssize = size.toString().padStart(2, "0")
  const _url = `${url}/rmrb/images/${year}-${month}/${day}/${ssize}/rmrb${year}${month}${day}${ssize}.pdf`

  const header = await fetch(_url, { method: "HEAD" })
  if (header.status !== 200) {
    console.log(`${header.status} URL not found: ${_url}`)
    if (size === 1 && _now.getDate() === now.getDate()) {
      _now.setDate(_now.getDate() - 1)
      year = _now.getFullYear().toString()
      month = (_now.getMonth() + 1).toString().padStart(2, "0")
      day = _now.getDate().toString().padStart(2, "0")
      continue
    }
    break
  }
  console.log(`URL is valid: ${_url}`)
  const response = await fetch(_url)
  const paper = await response.bytes()
  await Deno.writeFile(`${rmrbpdfath}/0${ssize}.pdf`, paper)
  getFiled = true
  size++
}
size--

if (!getFiled)
{
  Deno.exit()
}

const textEncoder = new TextEncoder()
await Deno.writeFile(`./date_rmrb.txt`, textEncoder.encode(`${year}-${month}-${day}`))
await Deno.writeFile(`${rmrbPath}/size.txt`, textEncoder.encode(`${size}`))
console.timeEnd('Execution Time')

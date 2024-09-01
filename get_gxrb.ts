// deno run --allow-net --allow-read --allow-write --allow-env --allow-ffi get_gxrb.ts
import { url, paperPath, gxrbPath, gxrbpdfath, pdfPath } from "./models/gxrb/api.ts"
import { exists } from "https://deno.land/std@0.224.0/fs/mod.ts"

if (!await exists(pdfPath)) {
  await Deno.mkdir(pdfPath)
}
if (!await exists(gxrbpdfath)) {
  await Deno.mkdir(gxrbpdfath)
}
if (!await exists(paperPath)) {
  await Deno.mkdir(paperPath)
}
if (!await exists(gxrbPath)) {
  await Deno.mkdir(gxrbPath)
}

const headers = {
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
}

const fetchConfig = {
  headers,
  "body": null,
  "method": "GET"
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
  const _url = `${url}/newspaper/epaper/gxrb/${year}-${month}-${day}/${ssize}/gxrb${year}${month}${day}${ssize}.pdf`

  const header = await fetch(_url, { headers, method: "HEAD" })
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
  const response = await fetch(_url, fetchConfig)
  const paper = await response.bytes()
  await Deno.writeFile(`${gxrbpdfath}/0${ssize}.pdf`, paper)
  getFiled = true
  size++
}
size--

if (!getFiled) {
  Deno.exit()
}

const textEncoder = new TextEncoder()
await Deno.writeFile(`./date_gxrb.txt`, textEncoder.encode(`${year}-${month}-${day}`))
await Deno.writeFile(`${gxrbPath}/size.txt`, textEncoder.encode(`${size}`))
console.timeEnd('Execution Time')

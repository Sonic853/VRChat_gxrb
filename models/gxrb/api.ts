export const url = "https://ssw.gxrb.com.cn"
export const urlhttp = "http://ssw.gxrb.com.cn"
export const paperPath = "./paper"
export const gxrbPath = `${paperPath}/gxrb`
export interface RBBODY {
  list: {
    [key: string]: RBLISTITEM
  }
  riqi: string
  paper: string
  baoming: string
  hashs: string
}
export interface RBLISTITEM {
  banci: string
  banming: string
  zhentu: {
    lujing: string
    wenjianming: string
  }
}

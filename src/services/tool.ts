import { createCanvas, registerFont, loadImage, Image } from "canvas"

const fontList = [
    "MAM8102",
    "MBD8102",
    "MBJ8102",
    "MBN8102",
    "MER8102",
    "MGQ8102",
    "MHL8102",
    "MHR8102",
    "MHW8102",
    "MLD8102",
    "MLU8102",
    "MMB8102",
    "MMD8102",
    "MNR8102",
    "MPB8102",
    "MQD8102",
    "MQG8F02",
    "MQI8102",
    "MQM8102",
    "MSH8102",
    "MSN8102",
    "MSO8102",
    "MTH8102",
    "MTR8102",
    "MVR8102",
    "MVY8102",
    "MWJ8102",
    "MYN8102",
    "OnonSoninSans"
]

function trimStartOne(str: string) {
    return str.startsWith(' ') ? str.slice(1) : str;
}

export function createGalpicTextImage({
    text = '',
    fontFamily = 'OnonSoninSans',
    fontSize = 16,
    color = '#000000',
    height = 100,
    ratio = 3
}) {
    // 注册字体
    registerFont(`src/assets/fonts/${fontFamily}.ttf`, { family: 'Onon' })

    // 创建画布
    const canvas = createCanvas(100, height)
    const cxt = canvas.getContext('2d')
    const lineHeight = 1.15
    const renderFontSize = fontSize * ratio
    let renderWidth = 100
    // let renderHeight = height * ratio + renderFontSize / 2
    let renderHeight = height * ratio

    // 分词
    const textList = text.match(/[\u4e00-\u9fa5]|[\u1800-\u18AF]+|[a-zA-Z]+|\d+|[^\s\w\u4e00-\u9fa5\u1800-\u18AF]+|\s/g) || []

    // 计算文本段落
    let currentLine = ''
    let maxHeight = 0
    const lineList = []
    // 设置绘制样式
    cxt.font = renderFontSize + 'px Onon'
    textList.forEach((word, index) => {
        const testLine = currentLine ? `${currentLine}${word}` : word
        const width = cxt.measureText(testLine).width
        // 超出长度计入一行
        if (width >= renderHeight) {            
            maxHeight = width
            lineList.push(currentLine)
            currentLine = word
        } else if (word == '\n') {
            lineList.push(testLine)
            currentLine = ''
        } else {
            maxHeight = width
            currentLine = testLine
        }
    })
    // 最后一行
    if (currentLine) {
        lineList.push(currentLine)
    }
    // 计算画布宽高
    renderHeight = maxHeight        
    renderWidth = renderFontSize * lineHeight * lineList.length
    canvas.width = renderWidth
    canvas.height = renderHeight
    // 绘制背景色    
    // if (backgroundColor) {
    //     cxt.fillStyle = backgroundColor
    // }    
    // cxt.fillRect(0, 0, renderWidth, renderHeight)
    // 将原点移到画布中心、顺时针旋转画布 90 度、调整原点回到左上角
    // cxt.translate(width / 2, height / 2)
    // cxt.rotate((90 * Math.PI) / 180)
    // cxt.translate(-height / 2, -width / 2)
    cxt.translate(renderWidth / 2, renderHeight / 2)
    cxt.rotate((90 * Math.PI) / 180)
    cxt.translate(-renderHeight / 2, -renderWidth / 2)
    // 绘制文本
    // if (textColor) {
    //     cxt.fillStyle = textColor
    // }    
    // 设置绘制样式
    cxt.font = renderFontSize + 'px Onon'
    cxt.fillStyle = color
    let y = renderWidth - renderFontSize * 0.3
    lineList.forEach(line => {
        // cxt.fillText(trimStartOne(line), 0, y)
        cxt.fillText(line, 0, y)
        y -= renderFontSize * lineHeight
    })

    // return canvas.createPNGStream()
    return {
        data: canvas.toDataURL(),
        width: renderWidth,
        height: renderHeight
    }
}

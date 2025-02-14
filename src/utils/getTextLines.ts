import { createCanvas, registerFont } from "canvas"

export function getTextLines({
    text,
    textSize = 16,
    wrapHeight
}: {
    text: string
    textSize: number
    wrapHeight: number
}) {
    // 注册字体
    registerFont('src/assets/fonts/OnonSoninSans.ttf', { family: 'Onon' })

    const canvas = createCanvas(100, wrapHeight)
    const context = canvas.getContext('2d')

    // 计算文本段落    
    // const words = splitAndPreserveSpaces ? text.split(/(\s+)/).filter(Boolean) : text.split(/\s+/)
    // const regex = /[\u4e00-\u9fa5]|[\u1800-\u18AF]+|[a-zA-Z]+|\d+|[^\s\w\u4e00-\u9fa5\u1800-\u18AF]+|[\s]+/g;
    const regex = /[\u4e00-\u9fa5]|[\u1800-\u18AF]+|[a-zA-Z]+|\d+|[^\s\w\u4e00-\u9fa5\u1800-\u18AF]+|\s/g;
    const words: string[] = text.match(regex) || []

    const lines = []
    let currentLine = ''
    context.font = textSize + 'px Onon'
    words.forEach(word => {
        // const testLine = currentLine ? `${currentLine} ${word}` : word        
        const testLine = currentLine ? currentLine + word : word
        const width = context.measureText(testLine).width
        if (width <= wrapHeight) {
            currentLine = testLine
            if (wrapHeight == 200) {
                console.log(currentLine, word)
            }
            if (word == '\n') {
                lines.push(currentLine)
                // lines.push(currentLine.replace(/[\p{P}\p{S}]/gu, (match) => `<div style="display: inline-block; font-size: 0.6rem;">${match}</div>`))
                currentLine = ''
            }
        } else {
            lines.push(currentLine)
            // lines.push(currentLine.replace(/[\p{P}\p{S}]/gu, (match) => `<div style="display: inline-block; font-size: 0.6rem;">${match}</div>`))
            currentLine = word
        }
    })
    // Add the last line
    if (currentLine) {
        lines.push(currentLine)
    }
    if (wrapHeight == 200) {
        console.log('lines', lines, text)
    }
    return lines
}
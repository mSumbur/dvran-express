import { createCanvas, registerFont } from "canvas"

function splitHTMLByWidth(html: string, ctx: any, maxWidth: number) {
    const tagStack: any = [];
    const lines = [];
    let currentLine = '';
    let currentText = '';
    let currentWidth = 0;

    const tokens = [...html.matchAll(/(<[^>]+>|[^<]+)/g)].map(m => m[0]);

    const getTagName = (tag: any) => tag.replace(/[<\/>]/g, '').split(' ')[0];
    const isOpeningTag = (tag: any) => /^<[^/!][^>]*>$/.test(tag);
    const isClosingTag = (tag: any) => /^<\/[^>]+>$/.test(tag);

    const openTagsToString = () => tagStack.join('');
    const closeTagsToString = () =>
        tagStack.slice().reverse().map((tag: any) => {
            const name = getTagName(tag);
            return `</${name}>`;
        }).join('');

    for (const token of tokens) {
        if (token.startsWith('<')) {
            if (isOpeningTag(token)) {
                tagStack.push(token);
                currentLine += token;
            } else if (isClosingTag(token)) {
                const last = tagStack.pop();
                currentLine += token;
            } else {
                // handle comment/self-closing etc. if needed
                currentLine += token;
            }
        } else {
            for (const char of token) {
                const charWidth = ctx.measureText(char).width;
                if (currentWidth + charWidth > maxWidth) {
                    // wrap line
                    const fullLine =
                        openTagsToString() + currentText + closeTagsToString();
                    lines.push(fullLine);

                    // reset state
                    currentText = char;
                    currentWidth = charWidth;
                    currentLine = openTagsToString();
                } else {
                    currentText += char;
                    currentWidth += charWidth;
                }
            }
        }
    }

    // push remaining line
    if (currentText) {
        const fullLine =
            openTagsToString() + currentText + closeTagsToString();
        lines.push(fullLine);
    }

    return lines;
}



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
    registerFont('src/assets/fonts/MSN8200.ttf', { family: 'Onon' })

    const canvas = createCanvas(100, wrapHeight)
    const context = canvas.getContext('2d')

    // 计算文本段落    
    // const words = splitAndPreserveSpaces ? text.split(/(\s+)/).filter(Boolean) : text.split(/\s+/)
    // const regex = /[\u4e00-\u9fa5]|[\u1800-\u18AF]+|[a-zA-Z]+|\d+|[^\s\w\u4e00-\u9fa5\u1800-\u18AF]+|[\s]+/g;
    const regex = /[\u4e00-\u9fa5]|[\u1800-\u18AF]+|[a-zA-Z]+|\d+|[^\s\w\u4e00-\u9fa5\u1800-\u18AF]+|\s/g;
    // const regex = /#U\+200B.*?U\+200B#|[\u4e00-\u9fa5]|[\u1800-\u18AF]+|[a-zA-Z]+|\d+|[^\s\w\u4e00-\u9fa5\u1800-\u18AF]+|\s/g;
    // const regex = /<[^>]+>|[\u4e00-\u9fa5]|[\u1800-\u18AF]+|[a-zA-Z]+|\d+|[^\s\w\u4e00-\u9fa5\u1800-\u18AF]+|\s/g;

    const words: string[] = text.match(regex) || []

    const lines = []
    let currentLine = ''
    context.font = textSize + 'px Onon'

    // const lii = splitHTMLByWidth(text, context, wrapHeight);
    // console.log('lisss', lii, text)
    // return lii

    words.forEach(word => {
        // const testLine = currentLine ? `${currentLine} ${word}` : word        
        const testLine = currentLine ? currentLine + word : word
        const width = context.measureText(testLine).width
        // const width = measureRichText(context, word)
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
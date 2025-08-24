import { createCanvas, registerFont } from "canvas"
import { decodeDML } from "./formatDML";

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

function patchClosingTag(prevText: string, currText: string) {
    const openTagRegex = /<([a-z]+)(\s[^>]*)?>/gi;
    const closeTagRegex = /<\/([a-z]+)>/gi;
  
    // 找 prevText 里最后一个开标签（没有被关闭的）
    const openTags = [...prevText.matchAll(openTagRegex)];
    const closeTags = [...prevText.matchAll(closeTagRegex)];
  
    let lastOpenTag = null;
  
    if (openTags.length > 0) {
      const lastOpen = openTags[openTags.length - 1];
      const tagName = lastOpen[1];
      // 判断该标签是否已经被关闭
      const openedCount = openTags.filter(t => t[1] === tagName).length;
      const closedCount = closeTags.filter(t => t[1] === tagName).length;
  
      if (openedCount > closedCount) {
        lastOpenTag = lastOpen[0]; // 例如 <a href="...">
      }
    }
  
    if (lastOpenTag && /<\/[a-z]+>/.test(currText) && !/<[a-z]+[^>]*>/.test(currText)) {
      // 当前文本有闭合标签但没有开标签 → 补齐
      return currText.replace(/<\/([a-z]+)>/, `${lastOpenTag}</$1>`);
    }
  
    return currText;
  }
  

function patchClosingTag1(prevText: string, currText: string) {
    const openTagRegex = /<([a-z]+)(\s[^>]*)?>/gi;
    const closeTagRegex = /<\/([a-z]+)>/gi;

    // 1. 构建 prevText 的未闭合标签栈
    const stack = [];
    let match;

    while ((match = openTagRegex.exec(prevText)) !== null) {
        stack.push({ name: match[1], tag: match[0] });
    }
    while ((match = closeTagRegex.exec(prevText)) !== null) {
        // 出栈匹配的开标签
        const idx = stack.map(s => s.name).lastIndexOf(match[1]);
        if (idx !== -1) stack.splice(idx, 1);
    }

    // 2. 检查 currText 是否缺少开标签
    const hasOpen = /<[a-z]+[^>]*>/.test(currText);
    const hasClose = /<\/[a-z]+>/.test(currText);
    console.log(prevText, currText)
    if (hasClose && !hasOpen && stack.length > 0) {
        // 找到即将关闭的标签
        const closingMatch = currText.match(/<\/([a-z]+)>/);
        if (closingMatch) {
            
            const tagName = closingMatch[1];
            const lastUnclosed = stack.reverse().find(s => s.name === tagName);
            if (lastUnclosed) {
                const a = currText.replace(
                    new RegExp(`</${tagName}>`),
                    `${lastUnclosed.tag}</${tagName}>`
                )
                console.log("close pa: ", a)
                return a;
            }
        }
    }

    return currText;
}


//   // 测试
//   const segments = [
//     { text: 'hello, <a href="http://baidu.com"> welcome' },
//     { text: 'to china</a> welcome' }
//   ];

//   const fixed = fixHTMLSegments(segments);
//   console.log(fixed.map(s => s.text).join(' '));
//   // 输出: hello, <a href="http://baidu.com"> welcome to china</a> welcome


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
    const regex = /[\u4e00-\u9fa5]|[\u1800-\u18AF]+|[a-zA-Z]+|\d+|[^\s\w\u4e00-\u9fa5\u1800-\u18AF]+|\s/g;
    const words: string[] = text.match(regex) || []
    const lines: string[] = []
    let currentLine = ''
    context.font = textSize + 'px Onon'

    words.forEach((word) => {
        const testLine = currentLine ? currentLine + word : word
        const width = context.measureText(testLine.replace(/[\ue000-\ue05e]/ig, '')).width
        if (width <= wrapHeight) {
            currentLine = testLine
            if (word == '\n') {
                // lines.push(lines.length > 0 ? patchClosingTag(lines[lines.length - 1], currentLine) : currentLine)
                lines.push(currentLine)
                currentLine = ''
            }
        } else {
            // lines.push(currentLine)
            lines.push(currentLine)
            currentLine = word
        }
    })

    if (currentLine) {
        lines.push(currentLine)
        // lines.push(currentLine)
    }
    return lines
}
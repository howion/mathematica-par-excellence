import MarkdownIt from 'markdown-it'
import MarkdownItKatex from 'markdown-it-katex'

// MarkdownIt
const md = new MarkdownIt({
    html: false,
    xhtmlOut: true,
    breaks: false,
    linkify: true,
    typographer: true
})

// AddOns
// md.use(MarkdownItAnchor)
md.use(MarkdownItKatex, { throwOnError: false })

// Service
export function mdit(src: text): text {
    console.log(src)
    return md.render(src)
}

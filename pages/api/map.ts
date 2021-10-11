// @ts-nocheck: d3
import type { NextApiRequest, NextApiResponse } from 'next'
// import * as d3 from 'd3'
import { JSDOM } from 'jsdom'
import { optimize } from 'svgo'

import { data } from './data'

// const body = d3.select(document).select('body')

// const tree = new MapNode('Matxmatics')

// const d2 = new MapNode('d1 ccc xd')
// d2.addChild(new MapNode('woah'))

// tree.addChild(new MapNode('d1 a'))
// tree.addChild(new MapNode('d1 bb'))
// tree.addChild(d2)

// function getRandomArbitrary(min, max) {
//     return Math.round((Math.random() * (max - min) + min)*100)/100
// }

async function makeMap(_data: Record<any, any>, radius: number): Promise<text> {
    return ''
    //
    // const tree = d3
    //     .tree()
    //     .size([2 * Math.PI, radius])
    //     .separation((a, b) => (a.parent == b.parent ? 1 : 2) / a.depth)
    //
    // const root = d3.hierarchy(data)
    // tree(root)
    //
    // const svg = d3
    //     .select(document)
    //     .select('body')
    //     .append('svg')
    //     .attr('xmlns', 'http://www.w3.org/2000/svg')
    //     .attr('id', 'map_d3')
    //     .attr('width', Math.round(2 * radius * 1.4))
    //     .attr('height', Math.round(2 * radius * 1.4))
    //
    // const container = svg
    //     .append('g')
    //     .attr('id', 'map_d3_c')
    //     .attr('transform', `translate(${Math.round(radius * 1.4)} ${Math.round(radius * 1.4)})`)
    //
    // container
    //     .append('g')
    //     .attr('fill', 'none')
    //     .attr('stroke', '#aaa')
    //     // .attr('stroke-opacity', 0.4)
    //     .attr('stroke-width', 1.5)
    //     // .attr('stroke-width', getRandomArbitrary(0.1, 99))
    //     .selectAll('path')
    //     .data(root.links())
    //     .join('path')
    //     .attr(
    //         'd',
    //         d3
    //             .linkRadial()
    //             .angle((d) => d.x)
    //             .radius((d) => d.y)
    //     )
    //
    // container
    //     .append('g')
    //     .selectAll('circle')
    //     .data(root.descendants())
    //     .join('circle')
    //     .attr('transform', (d) => `rotate(${(d.x * 180) / Math.PI - 90}) translate(${d.y},0)`)
    //     .attr('fill', (d) => (d.children ? '#555' : '#999'))
    //     .attr('r', 2.5)
    //
    // container
    //     .append('g')
    //     .attr('font-family', 'sans-serif')
    //     .attr('font-size', 10)
    //     .attr('stroke-linejoin', 'round')
    //     .attr('stroke-width', 3)
    //     .selectAll('text')
    //     .data(root.descendants())
    //     .join('text')
    //     .attr(
    //         'transform',
    //         (d) => `rotate(${(d.x * 180) / Math.PI - 90}) translate(${d.y},0) rotate(${d.x >= Math.PI ? 180 : 0})`
    //     )
    //     .attr('dy', '0.31em')
    //     .attr('x', (d) => (d.x < Math.PI === !d.children ? 6 : -6))
    //     .attr('text-anchor', (d) => (d.x < Math.PI === !d.children ? 'start' : 'end'))
    //     .text((d) => d.data.name)
    //     .clone(true)
    //     .lower()
    //     .attr('stroke', 'white')
    //
    // return document.body.innerHTML
}

export default async function Map(req: NextApiRequest, res: NextApiResponse): Promise<void> {
    if (req.method !== 'GET') {
        return
    }

    global.document = new JSDOM('').window.document

    const map = await makeMap(data, 1500)

    res.setHeader('Content-Type', 'image/svg+xml')
    // res.status(200).send('')
    res.status(200).send(optimize(map, { multipass: false }).data)
}

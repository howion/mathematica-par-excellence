export const App = {
    name: 'Mathematica',
    baseUrl: 'https://mathematica.vercel.app',
    version: '0.0.1',
    defaults: {
        description: '',
        author: 'howion',
        keywords: ['maths'],
        themeColor: '#00aaff'
    },
    api: {
        baseUrl: 'https://mathematica.vercel.app/api'
    }
} as const

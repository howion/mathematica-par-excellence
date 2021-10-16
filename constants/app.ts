const isProduction = process.env.NODE_ENV === 'production'

export const App = {
    name: 'Mathematica',
    baseUrl: isProduction ? 'https://mathematica.vercel.app' : 'http://localhost:3000',
    isProduction,
    version: '0.0.1',
    defaults: {
        description: '',
        author: 'howion',
        keywords: ['maths'],
        themeColor: '#00aaff'
    },
    api: {
        baseUrl: isProduction ? 'https://mathematica.vercel.app/api' : 'http://localhost:3000/api'
    }
} as const

export const FRONTEND_DESIGN_SK_NAME = 'frontend-design'

export default {
    name: FRONTEND_DESIGN_SK_NAME,
    files: [
        {
            path: 'SKILL.md',
            content: require('./SKILL.md').default,
        },
    ],
}
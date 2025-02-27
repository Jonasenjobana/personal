const PRECOMMAND_STR: string = '#include <common>'
const VERTEX_END_STR: string = '#include <fog_vertex>'
const FRAGEMENT_END_STR: string = '#include <fog_fragment>'
export function fragementShaderEndReplace(base, replace) {
    return base.replace(FRAGEMENT_END_STR,
        `${FRAGEMENT_END_STR}\n  ${replace}`)
}
export function vertexShaderEndReplace(base, replace) {
    return base.replace(VERTEX_END_STR,
        `${VERTEX_END_STR}\n  ${replace}`)
}
export function shaderStartReplace(base, replace) {
    return base.replace(PRECOMMAND_STR,
        `${replace}\n  ${PRECOMMAND_STR}`)
}
export const formatDisplayValue = (value: number): string => {
    if (!value) return ''
    const fixedValue = value.toFixed(6)
    return fixedValue.replace(/\.?0+$/, '')
}

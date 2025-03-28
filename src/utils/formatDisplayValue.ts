export const formatDisplayValue = (value: number): string => {
    if (isNaN(value)) return ''
    const fixedValue = value.toFixed(6)
    return fixedValue.replace(/\.?0+$/, '')
}

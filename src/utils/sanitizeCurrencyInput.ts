export const sanitizeCurrencyInput = (input: string): string => {
    return input
        .replace(/,/g, '.')
        .replace(/[^0-9.]/g, '')
        .replace(/^\./, '0.')
        .replace(/(\.\d*)\./, '$1')
}

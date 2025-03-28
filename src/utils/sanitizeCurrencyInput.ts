export const sanitizeCurrencyInput = (input: string): string => {
    return input
        .replace(/,/g, '.')
        .replace(/[^\d.]/g, '')
        .replace(/^(\.)/, '0.')
        .replace(/^0+(?=\d)/, '')
        .replace(/(\.\d*)\./g, '$1')
}

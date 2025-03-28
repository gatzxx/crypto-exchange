export const popperStyles = {
    zIndex: 1300,
}

export const paperStyles = {
    width: 250,
    minWidth: 200,
    maxHeight: 300,
    overflowY: 'auto',
    overflowX: 'hidden',
    padding: 1,
    boxShadow: 3,
}

export const menuItemStyles = {
    padding: '10px 16px',
}

export const textFieldStyles = {
    width: '100%',
    size: 'small' as 'small' | 'medium',
}

export const popperModifiers = [
    {
        name: 'preventOverflow',
        options: {
            boundary: 'window',
            padding: 8,
        },
    },
    {
        name: 'flip',
        options: {
            fallbackPlacements: ['top-start'],
        },
    },
]

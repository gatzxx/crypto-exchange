import { observer } from 'mobx-react-lite'

import { CurrencyInputView } from '@/components/CurrencyInputView/CurrencyInputView'
import { useCurrencyInput } from '@/hooks/useCurrencyInput'

type InputType = 'from' | 'to'

export const CurrencyInput = observer(({ type }: { type: InputType }) => {
    const props = useCurrencyInput(type)
    return <CurrencyInputView type={type} {...props} />
})

export const brl_currency = (value: string | number) => {
    return Number(value).toLocaleString("pt-BR", { style: 'currency', currency: 'BRL' })
}
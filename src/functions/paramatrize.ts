export const searchParameterize = (value: string) => {    
    return  value.toLowerCase()
                .normalize('NFD')
                .replace(/[\u0300-\u036f]/g, "") 
                .replace(/,/, '')
                .replace(/\./, '')
}
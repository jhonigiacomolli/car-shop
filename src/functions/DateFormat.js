export function AddDays(days = 0) {
    return new Date(new Date().getTime() + (days * 24 * 60 * 60 * 1000)).toLocaleDateString('pt-br')
}

export function SubtractDays(days = 0) {
    return new Date(new Date().getTime() - (days * 24 * 60 * 60 * 1000)).toLocaleDateString('pt-br')
}

export function ConvertToUsDate(date) {
    const dateArray = date.split('/')
    const usDate = `${dateArray[2]}/${dateArray[1]}/${dateArray[0]}`
    return usDate
}

export function ConvertToUsDateWithHifen(date) {
    const dateArray = date.split('/')
    const usDate = `${dateArray[2]}-${dateArray[1]}-${dateArray[0]}`
    return usDate
}

export function DateFormat_short(props) {
    const fulldata = props.split(' ')
    const data = fulldata[0].split('-')
    const day = data[2]
    const month = data[1]
    const year = data[0]
    return `${day} / ${month} / ${year}`
}

export function DateFormat_inFull(props) {
    const fulldata = props.split(' ')
    const data = fulldata[0].split('-')
    const day = data[2]
    let month
    switch(data[1]) {
        case "01":
            month = 'Janeiro'
            break
        case "02":
            month = 'Fevereiro'
            break
        case "03":
            month = 'Março'
            break
        case "04":
            month = 'abril'
            break
        case "05":
            month = 'Maio'
            break
        case "06":
            month = 'Junho'
            break
        case "07": 
            month = 'Julho'
            break
        case "08":
            month = 'Agosto'
            break
        case "09":
            month = 'Setembro'
            break
        case "10":
            month = 'Outubro'
            break
        case "11":
            month = 'Novembro'
            break
        case "12":
            month = 'Dezembro'
            break
        default:
            month = 'Data Invalida'
    }
    const year = data[0]
    return `${day} de ${month} de ${year}`
}
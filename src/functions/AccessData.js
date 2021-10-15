import { ConvertToUsDate } from "./DateFormat"


export function AccessPerDay(matrix = [], day, result) {
    let allVisitors = []
    let access_result = []
    matrix.map(acc => {
        const accessDate = ConvertToUsDate(acc.date)
        const date = ConvertToUsDate(day)

        if (accessDate === date) {
            if (result === 'visit') {
                if(!allVisitors.includes(acc.ip)) {
                    allVisitors = [...allVisitors, acc.ip]
                    access_result = [...access_result, acc]
                }
            }
            if(result === 'views') {
                access_result.push(acc)
            }
        }
    })
    return access_result
}

export function PercentualAccess(origin = [], field, parameter, percent) {
    let counter = 0
    origin.map(or => or[field] === parameter && counter ++)
    return counter = percent === true ? `${isNaN(Number((counter / origin.length) * 100).toFixed(0)) ? 0 : Number((counter / origin.length) * 100).toFixed(0)} %` : isNaN(Number((counter / origin.length) * 100).toFixed(0)) ? 0 : Number((counter / origin.length) * 100).toFixed(0)
}
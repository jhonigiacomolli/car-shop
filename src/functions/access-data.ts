import { convertToUsDate } from "./date-format"
import { TYPE_Access } from 'context/context-types'

export function accessPerDay(matrix:TYPE_Access[], day: string, result: 'visit' | 'views') {
    let allVisitors: string[] = []
    let access_result: TYPE_Access[] = []
    matrix.map(acc => {
        const accessDate = convertToUsDate(acc.date)
        const date = convertToUsDate(day)

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

export function percentualAccess(origin:{[key: string]: string}[] = [], field: string, parameter: string, percent?: boolean) {
    let counter = 0
    origin.map(or => or[field] === parameter && counter ++)
    counter = isNaN(Number((counter / origin.length) * 100)) ? 0 : Number((counter / origin.length) * 100)
    return percent === true ? `${counter.toFixed(0)}%` : counter.toFixed(0)
}
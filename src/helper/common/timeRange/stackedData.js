import {
    oneWeekAgo, 
    twoWeekAgo, 
    threeWeekAgo, 
    fourWeekAgo} 
from './month'
import {
    oneDayAgo, 
    twoDayAgo, 
    threeDayAgo, 
    fourDayAgo, 
    fiveDayAgo, 
    sixDayAgo, 
    sevenDayAgo} 
from './week'
import {
    oneMonthAgo, 
    twoMonthAgo, 
    threeMonthAgo, 
    fourMonthAgo, 
    fiveMonthAgo, 
    sixMonthAgo, 
    nineMonthAgo, 
    twelveMonthAgo} 
from './year'

const reasonFilter = (array, start, end) => {
    const arrayFiltered = array.filter(reason => {return reason.markup < start && reason.markup > end})
    return arrayFiltered.length
}

const stackedDataForWeek = (filter) => {
    return [
        reasonFilter(filter, sixDayAgo, sevenDayAgo),
        reasonFilter(filter, fiveDayAgo, sixDayAgo),
        reasonFilter(filter, fourDayAgo, fiveDayAgo),
        reasonFilter(filter, threeDayAgo, fourDayAgo),
        reasonFilter(filter, twoDayAgo, threeDayAgo),
        reasonFilter(filter, oneDayAgo, twoDayAgo),
        reasonFilter(filter, Date.now(), oneDayAgo)
    ]
}

const stackedDataForMonth = (filter) => {
    return [
        reasonFilter(filter, threeWeekAgo, fourWeekAgo),
        reasonFilter(filter, twoWeekAgo, threeWeekAgo),
        reasonFilter(filter, oneWeekAgo, twoWeekAgo),
        reasonFilter(filter, Date.now(), oneWeekAgo)
    ]
}

const stackedDataForSemester = ( filter ) => {
    return [
        reasonFilter(filter, fiveDayAgo, sixMonthAgo),
        reasonFilter(filter, fourMonthAgo, fiveDayAgo),
        reasonFilter(filter, threeMonthAgo, fourMonthAgo),
        reasonFilter(filter, twoMonthAgo, threeMonthAgo),
        reasonFilter(filter, oneMonthAgo, twoMonthAgo),
        reasonFilter(filter, Date.now(), oneMonthAgo)
    ]
}

const stackedDataForYear = ( filter ) => {
    return [
        reasonFilter(filter, nineMonthAgo, twelveMonthAgo),
        reasonFilter(filter, sixMonthAgo, nineMonthAgo), 
        reasonFilter(filter, threeMonthAgo, sixMonthAgo),
        reasonFilter(filter, Date.now(), threeMonthAgo)
    ]
}

export { stackedDataForWeek, stackedDataForMonth, stackedDataForSemester, stackedDataForYear }
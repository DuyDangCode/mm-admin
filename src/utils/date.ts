import dayjs from "dayjs"
import 'dayjs/plugin/quarterOfYear'

dayjs.extend(require('dayjs/plugin/quarterOfYear'))

export const startOfWeek = (selectedDate: Date | null) => {
    return dayjs(selectedDate).startOf('week').add(1, 'day').toDate()
}
export const endOfWeek = (selectedDate: Date | null) => {
    return dayjs(selectedDate).endOf('week').add(1, 'day').toDate() 
}

export const startOfQuarter = (selectedDate: Date | null) => {
    return dayjs(selectedDate).startOf('quarter').toDate()
}

export const endOfQuarter = (selectedDate: Date | null) => {
    return dayjs(selectedDate).endOf('quarter').toDate()
}


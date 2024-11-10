import { endOfQuarter, endOfWeek, startOfQuarter, startOfWeek } from "@/utils/date";
import { useCallback, useState } from "react"

const typeStratery : any = {
    'week': [
        startOfWeek,
        endOfWeek
    ],
    'quarter': [
        startOfQuarter,
        endOfQuarter   
    ]
}

const useRangeTime = (type: string = 'week', selectedDate: Date = new Date()) => {
    const [data, _setData] = useState<[Date | null, Date | null]>([typeStratery[type][0](selectedDate), typeStratery[type][1](selectedDate)]);
    const setData = (selectedDate: [Date | null, Date | null]) => {
        if (selectedDate[0] !== null){
            _setData([typeStratery[type][0](selectedDate[0]), typeStratery[type][1](selectedDate[0])])
        }
    }

    return [data, setData];
}

export default useRangeTime;
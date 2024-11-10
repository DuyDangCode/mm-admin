import { endOfQuarter, startOfQuarter } from "./date";
import { ChartInterface, StatsInterface } from "./response";

export const calPreDay = (selectedDay: Date = new Date() ): string => {
    const currentDate = selectedDay.getDate();
    const currentMonth = selectedDay.getMonth() + 1;
    const currentYear = selectedDay.getFullYear();

    if(currentDate == 1){
        if(currentMonth == 1){
            return `31/12/${currentYear-1}`
        }else if(currentMonth == 5 || currentMonth == 7 || currentMonth == 8 || currentMonth == 10 ||currentMonth == 12){
            return `30/${currentMonth-1}/${currentYear}`
        }else if (currentMonth == 3) {
            if(currentYear % 4 == 0){
                return `29/2/${currentYear}`
            }else{
                return `28/2/${currentYear}`
            }
        }
        else{
            return `31/${currentMonth-1}/${currentYear}`
        }
    }
    return `${currentDate-1}/${currentMonth}/${currentYear}`
}

export const calPer = (select: number, pre: number ) => {
    if(pre === 0){
        return select;
    }
    return Math.round(((select - pre) / pre) * 100);
}

export const getDaysInMonth = (m: number = 1, y: number = 2023) => {
    return m===2 ? y & 3 || !(y%25) && y & 15 ? 28 : 29 : 30 + (m+(m>>3)&1);
}



export const getLabels = (selectedDay: Date = new Date()) => {

    const month = selectedDay.getMonth() + 1;
    const year = selectedDay.getFullYear();
    const dayInMonth = getDaysInMonth(month, year);
    let monthLabel = [];
    let quarterLabel = []

    for(let i = 1; i <= dayInMonth; i++){
        monthLabel.push(i);
    }

    const startQuarterMonth = startOfQuarter(selectedDay).getMonth() + 1;
    const endQuarterMonth = endOfQuarter(selectedDay).getMonth() + 1;

    for(let i = startQuarterMonth; i <= endQuarterMonth; i++){
        quarterLabel.push(`Tháng ${i}`);
    }

    return [['Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7', 'Chủ nhật'], monthLabel, quarterLabel, ['Tháng 1', 'Tháng 2','Tháng 3','Tháng 4','Tháng 5','Tháng 6','Tháng 7','Tháng 8','Tháng 9','Tháng 10','Tháng 11','Tháng 12']]
    
}

export const DEFAULT_BARCHART: ChartInterface[] = [
    {
        revenue: [],
        profit: [],
    }, 
    {
        revenue: [],
        profit: [],
    }, 
    {
        revenue: [],
        profit: [],
    },
    {
        revenue: [],
        profit: [],
    }
] 

export const DEFAULT_RES_STATISTICS: StatsInterface = {
    selectTime: {
      revenue: 0,
      profit: 0,
    },
    preTime: {
      revenue: 0,
      profit: 0,
    },
}

export const DEFAULT_STATS: StatsInterface[] = [ structuredClone(DEFAULT_RES_STATISTICS),  structuredClone(DEFAULT_RES_STATISTICS),  structuredClone(DEFAULT_RES_STATISTICS),  structuredClone(DEFAULT_RES_STATISTICS),  structuredClone(DEFAULT_RES_STATISTICS)];
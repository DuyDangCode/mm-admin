import { constant } from "@/utils/constant";
import { UserInterface } from "@/utils/response";
import axios from "axios";
import { useRafLoop } from "react-use";


class StatisticsService {
    private user: UserInterface;
    private hearders: any;
    private currentTime: string;
    private startTime: string;
    constructor(user: UserInterface){
        this.user = user;
        this.user = user;
        this.hearders = {
            'x-api-key': constant.API_KEY,
            'x-client-id': this.user.userId,
            'authorization': this.user.accessToken,
        }
        const time = new Date();
        this.currentTime = `${time.getDate()}/${time.getMonth() + 1}/${time.getFullYear()}`;
        this.startTime = `1/${time.getMonth() + 1}/${time.getFullYear()}`;
    }

    getRevenueAndProfit = async(start: string = this.startTime, end: string = this.currentTime):Promise<any> => {
        return await axios.get(`${constant.BASE_URL}/statistic?start=${start}&end=${end}`, {headers: this.hearders})
        .then((res)=>{
            return res.data.metadata
        })
        .catch((err)=>{
            console.log('err::: getRevenueAndProfit', err);
        })
    }
}

export default StatisticsService
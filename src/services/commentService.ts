import {Comment, UserInterface} from "@/utils/response"; 
import axios from "axios";
import {constant} from "@/utils/constant";

class CommentService {
    private user: UserInterface | null;
    private hearders: any;
    
    constructor(user: UserInterface | null = null){
        this.user = user;
        this.hearders = user ? {
            'x-api-key': constant.API_KEY,
            'x-client-id': this.user?.userId,
            'authorization': this.user?.accessToken,
        } :{
            'x-api-key': constant.API_KEY
        }
    }
    

    async createComment(productId: string, content: string, rating: number, parentId: string | null = null){
        return await axios.post(`${constant.BASE_URL}/comment`, {
                'productId': productId, 
                'content': content,
                'parentId': null,
                'rating': rating
            } ,{
            headers: this.hearders,})
    }

    async getAllComments(productId: string): Promise<Comment[]>{    
        console.log(productId)    
        return await axios.post(`${constant.BASE_URL}/comment/product`,{
                'productId': productId,
            } ,{
            headers: this.hearders,
        })
        .then(res=> res.data.metadata )
        .catch(error => {throw new Error(error.response.data.message)})
    }
}

export default CommentService;
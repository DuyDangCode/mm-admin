import { useQuery } from "@tanstack/react-query";
import queryClient from "./client";



const useLogin = (input: any = queryClient.getQueryData(['user'])): any => [
    useQuery({queryKey: ['user'], queryFn: (): Object | null=> {
        const initialData = (input) ? input : localStorage.getItem('user');
        if(!initialData) return null;
        const data = (typeof initialData == 'string') ? JSON.parse(initialData) : initialData;
        return data;

    }}).data,
    (value: any = null) => {
        // when value is null that is logout
        if(!value){
            localStorage.removeItem('user');
            queryClient.setQueryData(['cart'], null);

            }
        else {
            localStorage.removeItem('user');
            localStorage.setItem('user', value)
        }
        return queryClient.setQueryData(['user'], value)}
]

export default useLogin;
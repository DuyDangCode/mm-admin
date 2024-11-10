import { useQuery } from "@tanstack/react-query";
import queryClient from "./client";

const useRQGlobalState = (key: string , initialData: any) => [
    useQuery({queryKey: [key], queryFn: ()=>initialData}).data,
    (value: any)=>queryClient.setQueryData([key], value)
]

export default useRQGlobalState;
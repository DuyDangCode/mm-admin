function splitArray<T>(array: T[], chunkSize: number) {
    return array.reduce<T[][]>((result, _, index) => {
        if (index % chunkSize === 0) {
            result.push(array.slice(index, index + chunkSize));
        }
        return result;
    }, []);
}

function chunk<T>(array: T[], size: number): T[][] {
    if (!array.length) {
        return [];
    }
    const head = array.slice(0, size);
    const tail = array.slice(size);
    return [head, ...chunk(tail, size)];
}

const convertStringToOject = (data: string | null) => {
    // var array = [];
    // if(data){
    //     var object = JSON.parse(data);

    //     for (var i in object) {
    //         array.push(object[i]);
    //     }
    // }
    // return array;
    if (data)
        return JSON.parse(data);
    return null;
}

export { chunk, splitArray, convertStringToOject };
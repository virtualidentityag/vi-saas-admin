function removeEmbedded(result: Record<string, any>) {
     
    const list = result?._embedded || [];
    const newList = list.map((embedded: Record<string, any>) => {
         
        return typeof embedded._embedded !== 'undefined' ? embedded._embedded : embedded;
    });
    return {
        total: result.total,
        data: newList,
    };
}
export default removeEmbedded;

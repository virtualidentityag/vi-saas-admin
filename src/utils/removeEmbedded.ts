function removeEmbedded(result: Record<string, any>) {
  // eslint-disable-next-line no-underscore-dangle
  const list = result._embedded;
  const newList = list.map((embedded: Record<string, any>) => {
    // eslint-disable-next-line no-underscore-dangle
    return embedded._embedded;
  });
  return {
    total: result.total,
    data: newList,
  };
}
export default removeEmbedded;

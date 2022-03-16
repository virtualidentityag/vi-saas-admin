function removeEmbedded(list: Record<string, any>) {
  return list.map((embedded: Record<string, any>) => {
    // eslint-disable-next-line no-underscore-dangle
    return embedded._embedded;
  });
}
export default removeEmbedded;

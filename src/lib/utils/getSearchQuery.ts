const getSearchQuery = (req: Request, fields: string[]) => {
  const { searchParams } = new URL(req.url);
  const query: Record<string, unknown> = {};
  fields.forEach((key) => {
    const value = searchParams.get(key);
    if (value) {
      query[key] = value;
    }
  });

  return query;
};

export default getSearchQuery;

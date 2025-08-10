const getReqMeta = (req: Request) => {
  const { searchParams } = new URL(req.url);
  const page = parseInt(searchParams.get('page') || '1');
  const limit = parseInt(searchParams.get('limit') || '10');
  const skip = (page - 1) * limit;
  return {
    page,
    limit,
    skip,
  };
};

export default getReqMeta;

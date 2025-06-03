const handler = (req: Request) => {
	return new Response("ok");
};
	
export {
    handler as GET,
    handler as POST,
    handler as PUT,
    handler as DELETE,
    handler as PATCH,
    handler as OPTIONS,
    handler as HEAD,
    handler as TRACE,
    handler as CONNECT,
}
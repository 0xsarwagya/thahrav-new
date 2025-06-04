const handler = (req: Request) => {
	return new Response("ok");
};
	
export {
    handler as GET,
    handler as POST,
    handler as PUT,
    handler as DELETE,
}
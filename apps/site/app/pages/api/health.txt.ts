export const GET = async () => {
  const body = "Hi there! I'm healthy...Thanks for checking up on me!";
  return new Response(body, {
    status: 200,
    headers: { "Content-Type": "text/plain; charset=UTF-8" },
  });
};

import type { APIRoute } from "astro";

export const GET: APIRoute = async (ctx) => {
  const body = `
<OpenSearchDescription
  xmlns="http://a9.com/-/sppnppmec/opensearch/1.1/"
  xmlns:moz="http://www.mozilla.org/2006/browser/search/"
  xmlns:opensearch="http://a9.com/-/spec/opensearch/1.1/"
  xmlns:xhtml="http://www.w3.org/1999/xhtml"
>
  <ShortName>Prince Muel</ShortName>
  <Description>Search ${ctx.site}</Description>
  <InputEncoding>UTF-8</InputEncoding>
  <Url
    method="get"
    type="text/html"
    template="https://www.google.com/search?q={searchTerms}+site%3A${ctx.site}"
  />
</OpenSearchDescription>
`.trim();

  return new Response(body, {
    status: 200,
    headers: {
      "Content-Type": "application/xml; charset=UTF-8",
      "X-Content-Type-Options": "nosniff",
    },
  });
};

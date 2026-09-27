export async function onRequest(context) {
  const target = new URL('/corretor/alisson-portella/', context.request.url);
  target.search = new URL(context.request.url).search;
  return fetch(new Request(target, context.request));
}

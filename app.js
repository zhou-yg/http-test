const koa = require('koa');
const fs=require('fs');
const app = new koa()
const md5 = require('md5')
app.use(async function(ctx)  {
  console.log(`path:${ctx.path}`);
  switch(ctx.path){
    case '/index.html':
      ctx.response.headers = {
        'Content-Type': 'text/html'
      }
      ctx.body = fs.readFileSync('./index.html').toString();
      break;
    case '/test.js':
      const js = fs.readFileSync('./test.js').toString();
      const md5Str = md5(js);
      if (md5Str === ctx.get('If-None-Match')) {
        ctx.status = 304;
        ctx.set({
          'Cache-Control': 'max-age=60',
        })
      } else {
        ctx.set({
          'Cache-Control': 'no-cache',
        })
      }

      ctx.set({
        'ETag': md5Str,
      })
      ctx.body = js;
      break;
  }
})


app.listen(3004);

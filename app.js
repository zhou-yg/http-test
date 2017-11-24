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
      var js = fs.readFileSync('./test.js').toString();
      const md5Str = md5(js);
      if (md5Str === ctx.get('If-None-Match')) {
        ctx.status = 304;
        ctx.set({
          'Cache-Control': 'max-age=20',
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
    case '/test2.js':
      var js = fs.readFileSync('./test2.js').toString();
      if (ctx.get('If-Modified-Since')) {
        var sinceDate = new Date(ctx.get('If-Modified-Since'));
        var lastModified = new Date('2017-11-14 17:35:30');

        if (sinceDate >= new Date()) {
          ctx.status = 304;
          ctx.set({
            'Last-Modified': sinceDate,
          })
        } else {
          ctx.set({
            'Last-Modified': lastModified,
          })
        }
      } else {
        ctx.set({
          'Last-Modified': new Date(),
        })
      }
      ctx.body = js;
      break;
  }
})
app.listen(3004);

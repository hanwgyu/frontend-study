var http = require('http');
var fs = require('fs');
var url = require('url');
var qs = require('querystring');
var template = require('./lib/template.js')
var sanitizeHtml = require('sanitize-html');

var app = http.createServer(function(request,response){
    var url_ = request.url;
    const queryObject = url.parse(url_,true).query;
    const pathName = url.parse(url_,true).pathname;
    var title = queryObject.id;

    if(pathName == '/') {
      if(title == undefined) {
        fs.readdir('files', function(err, filelist){
          var title = 'Welcome';
          var description = 'Hello World!';
          var list = template.List(filelist);

          var html = template.HTML(title, list, description,
            '<a href="/create">create</a>'
          );
          response.writeHead(200);
          response.end(html);
        });
      } else {
        fs.readdir('files', function(err, filelist){
          var list = template.List(filelist);
          fs.readFile(`files/${title}`, 'utf8', function(err, description) {  
            var sanitizedTitle = sanitizeHtml(title);
            var sanitizedDescription = sanitizeHtml(description);
            
            var html = template.HTML(sanitizedTitle, list, sanitizedDescription,
              `<a href="/create">create</a> <a href="/update?id=${sanitizedTitle}">update</a> 
              <form action="/delete_process" method="post">
                <input type="hidden" name="id" value=${sanitizedTitle}>
                <input type="submit" value="delete">
              </form>
              `);
            response.writeHead(200);
            response.end(html);
          });
        });
      }
    }
    else if(pathName == '/create') {
      fs.readFile(`syntax/create_form.html`, 'utf8', function(err, contents) {  
        var html = template.HTML(title, '', contents, '');
        response.writeHead(200);
        response.end(html);
      });
    }
    else if(pathName == '/create_process') {
      if (request.method == 'POST') {
        var body = '';

        request.on('data', function (data) {
            body += data;

            // Too much POST data, kill the connection!
            // 1e6 === 1 * Math.pow(10, 6) === 1 * 1000000 ~~~ 1MB
            if (body.length > 1e6)
                request.connection.destroy();
        });

        request.on('end', function () {
            var post = qs.parse(body);
            var title = post.title;
            var description = post.description;

            // 파일 생성
            fs.writeFile(`files/${title}`, description, 'utf8', function (err) {
              response.writeHead(302, {Location: `/?id=${title}`});
              response.end("Success");
            });
        });
      }
    }
    else if(pathName == "/update") {
      var contents = `<form action="/update_process" method="POST">
      <input type="hidden" name="id" value="${title}">
      <p><input type="text" name="title" placeholder="title" value="${title}"></p>
      <p>
          <textarea name="description" placeholder="description"></textarea>
      </p>
      <p>
          <input type="submit" value="update">
      </p>
      </form>
      `;
      var html = template.HTML(title, '', contents, '');
      response.writeHead(200);
      response.end(html);
    }
    else if(pathName == "/update_process") {
      if (request.method == 'POST') {
        var body = '';

        request.on('data', function (data) {
            body += data;

            // Too much POST data, kill the connection!
            // 1e6 === 1 * Math.pow(10, 6) === 1 * 1000000 ~~~ 1MB
            if (body.length > 1e6)
                request.connection.destroy();
        });

        request.on('end', function () {
            var post = qs.parse(body);
            var id = post.id;
            var title = post.title;
            var description = post.description;

            // 파일 생성
            fs.rename(`files/${id}`, `files/${title}`, function (err) {
              fs.writeFile(`files/${title}`, description, 'utf8', function(err) {
                response.writeHead(302, {Location: `/?id=${title}`});
                response.end("Success");
              });
            });
        });
      }
    }
    else if(pathName == "/delete_process") {
      if (request.method == 'POST') {
        var body = '';

        request.on('data', function (data) {
            body += data;

            // Too much POST data, kill the connection!
            // 1e6 === 1 * Math.pow(10, 6) === 1 * 1000000 ~~~ 1MB
            if (body.length > 1e6)
                request.connection.destroy();
        });

        request.on('end', function () {
            var post = qs.parse(body);
            var id = post.id;

            // 파일 제거
            fs.unlink(`files/${id}`, function(error) {
              response.writeHead(302, {Location: `/`});
              response.end("Success");
            });
        });
      }
    }
    else {
      response.writeHead(404);
      response.end('Not found');
    }
  
});
app.listen(3000);
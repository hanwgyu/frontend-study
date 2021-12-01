var template = {
    HTML: function (title, list, body, control) {
      return `
      <!doctype html>
      <html>
      <head>
        <title>WEB2 - ${title}</title>
        <meta charset="utf-8">
      </head>
      <body>
        <h1><a href="/">WEB</a></h1>
        ${list}
        ${control}
        <h2>${title}</h2>
        <p>${body}</p>
      </body>
      </html>`;
    },
  
    List: function (filelist) {
      var list = '<ol>';
      var i = 0;
      while(i < filelist.length) {
        var name = filelist[i];
        list += `<li><a href="/?id=${name}">${name}</a></li>`;
        i += 1;
      }
      list += '</ol>';
      return list;
    }
  };

  module.exports = template;
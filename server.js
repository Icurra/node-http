const http = require("http");
const port = 3000;

const requestHandler = (req, res) => {
  const chunks = [];

  req.on("data", (chunk) => chunks.push(chunk));

  req.on("end", () => {
    const { method, url } = req;
    let reqBody;

    try {
      reqBody = JSON.parse(Buffer.concat(chunks).toString());
    } catch (err) {
      console.error("Request body cannot be parsed to JSON");
      reqBody = null;
    }

    const { statusCode, contentType, content } = getRouteInfo(
      method,
      url,
      reqBody
    );

    res.writeHead(statusCode, { "content-type": contentType });
    res.write(content);
    res.end();
  });
};

const getRouteInfo = (method, url, reqBody) => {
  const info = {
    statusCode: 200,
    contentType: "text/html",
    content: "",
  };

  switch (true) {
    case url == "/" && method == "GET":
      info.content = "<h1>Home</h1>";
      break;
    case url == "/about" && method == "GET":
      info.contentType = "application/json";
      info.content = JSON.stringify({ name: "Landin", city: "Apple Valley" });
      break;
    case url == "/echo" && method == "POST":
      info.contentType = "application/json";
      info.content = JSON.stringify({ url, method, reqBody });
      break;
    default:
      info.statusCode = 404;
      info.content = "<h1>404 Not Found</h1>";
  }

  return info;
};

const server = http.createServer(requestHandler);

server.listen(port, () => {
  console.log(`Server listening on port ${port}...`);
});

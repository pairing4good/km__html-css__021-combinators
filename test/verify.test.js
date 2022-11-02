const http = require("http");
const fs = require("fs");
const puppeteer = require("puppeteer");

let server;
let browser;
let page;

beforeAll(async () => {
  server = http.createServer(function (req, res) {
    fs.readFile(__dirname + "/.." + req.url, function (err, data) {
      if (err) {
        res.writeHead(404);
        res.end(JSON.stringify(err));
        return;
      }
      res.writeHead(200);
      res.end(data);
    });
  });  

  server.listen(process.env.PORT || 3000);
});

afterAll(() => {
  server.close();
});

beforeEach(async () => {
  browser = await puppeteer.launch();
  page = await browser.newPage();
  await page.goto("http://localhost:3000/index.html");
});

afterEach(async () => {
  await browser.close();
});

describe('the div same-line', () => {
  it('should display on the same line as the element above it', async () => {
    const display = await page.$eval('div[class="same-line"]', (div) => {
      let style = window.getComputedStyle(div);
      return style.getPropertyValue('display');
    });
    
    expect(display).toContain('inline');
  });
});

describe('the span next-line', () => {
  it('should display on the next line after the element above it', async () => {
    const display = await page.$eval('span[class="next-line"]', (span) => {
      let style = window.getComputedStyle(span);
      return style.getPropertyValue('display');
    });
      
    expect(display).toBe('block');
  });
});


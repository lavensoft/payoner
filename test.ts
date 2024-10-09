import puppeteer from "puppeteer-extra";
import UserAgent from 'user-agents';

const testUrl = 'https://start.adspower.net';

const browser = await puppeteer.launch({
  // executablePath: '/usr/bin/google-chrome',
  headless: false, // Chế độ headless được bật, không hiển thị UI trình duyệt
  ignoreDefaultArgs: ['--disable-extensions', '--enable-automation'],
  defaultViewport: {
    width: 1280 + Math.floor(Math.random() * 100),
    height: 720 + Math.floor(Math.random() * 100),
    deviceScaleFactor: 1,
    hasTouch: false,
    isLandscape: false,
    isMobile: false,
  },
  args: [
    '--no-sandbox',
    '--disable-setuid-sandbox',
    `--proxy-server=${'http://14.230.28.114:6127'}`,
    '--disable-web-security',
    '--disable-features=IsolateOrigins,site-per-process',
  ], // Thêm các tùy chọn bảo mật cho môi trường production
});

const userAgent = new UserAgent().toString();

const page = await browser.newPage();
await page.setUserAgent(userAgent.toString()); //Add user agent
// Bật chặn yêu cầu
await page.setRequestInterception(true);

await page.goto(testUrl, {
  waitUntil: 'networkidle0',
});
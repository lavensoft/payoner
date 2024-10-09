import puppeteer from 'puppeteer-extra';
import fs from 'fs';
import csv from 'csv-parser';
import proxyChain from 'proxy-chain';
import { newInjectedPage } from 'fingerprint-injector';
import Preferences from 'preferences';

const prefs = new Preferences('com.payoner.tool',{
  currentRowIndex: 0,
});

const StealthPlugin = require('puppeteer-extra-plugin-stealth');

puppeteer.use(StealthPlugin());

const mainUrl = 'https://payouts.payoneer.com/partners/or.aspx?pid=YOYIZC74IO2s4KZQp7tgsw%3d%3d&BusinessLine=7&Volume=below-2000&web_interaction=webpage_accounts|website_traffic&utm_medium=cpc&utm_source=Google&utm_campaign=Reg_SE_GEN_APAC_VN_PureBrand&utm_content=exact_payoneer&utm_term=payoneer&Placement=&Keyword=e&CampaignID=21101166127&utm_id=21101166127&utm_agid=162309452320&creative=693625186049&gclid=Cj0KCQjw05i4BhDiARIsAB_2wfCCYe79e52buunNmbKh1SnUqtVFp8UF4JWwwP6yiKGLh46Mb_K_DpkaAtzaEALw_wcB&langid=21&locale=vi';
const testUrl = 'https://start.adspower.net';
const TYPING_SPEED = 0;
const WAIT_SPEED = 1000;

interface Data {
  mail2: string,
  mailPass: string,
  name: string,
  city: string,
  address: string,
  secret: string,
  cccd: string,
  bankName: string,
  bankBranch: string,
  bankNum: string,
  bank: string
}

if (process.argv.includes('--clear')) {
  prefs.clear();
}

const StartJob = async (options: {
  proxyServer: string,
  data: Data
}) => {
  console.log(options.proxyServer);

  // const fingerprint = GenerateFingerprint('Chrome', {
  //   webgl_vendor: "NVIDIA Corporation", // You can use values instead of functions too
  //   webgl_renderer: "NVIDIA GeForce GTX 1650/PCIe/SSE2",
  //   userAgent: (e: any) => {return e.includes("Windows NT 10.0")},
  //   language: (e: any) => {return e.includes("en")},
  //   viewport: (e: any) => {return e.width > 1000 && e.height > 800},
  //   // language: (e: any) => true,
  //   cpus: (e: any) => {return e <= 32 && e >= 4},
  //   memory: (e: any) => {return e <= 8},
  //   compatibleMediaMimes: (e: any) => {return e.audio.includes("aac"), e.video["mp4"] && e.video.mp4.length > 0},
  //   canvas: {chance: 95, shift: 4}, // set shift to 0 to cancel canvas spoofing
  //   // proxy: "direct", // Support for string only
  //   // proxy: () => "direct", // Defaults to this, meaning no proxy
  //   proxy: () =>  ["direct", options.proxyServer] // Support for array and get a random object
  // })


  // puppeteer.use(fingerprint);

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
      `--proxy-server=${options.proxyServer}`,
      '--disable-web-security',
      '--disable-features=IsolateOrigins,site-per-process',
    ], // Thêm các tùy chọn bảo mật cho môi trường production
  });

  const page = await newInjectedPage(
    browser,
    {
        // constraints for the generated fingerprint
        fingerprintOptions: {
            devices: ['mobile'],
            operatingSystems: ['ios', 'android'],
        },
    },
);

  // const page = await browser.newPage();

  // const userAgent = new UserAgent();
  // console.log(userAgent.toString());
  // await page.setUserAgent(userAgent.toString());
  // page.emulateTimezone('Asia/Ho_Chi_Minh');

  await page.goto(testUrl, {
    waitUntil: 'networkidle2',
  });

  await page.goto(mainUrl, {
    waitUntil: 'networkidle2',
  });

  //*FIRST PAGE
  //First name
  // await new Promise((resolve) => setTimeout(resolve, Math.floor(Math.random() * 900) + 600));
  await page.type('#txtFirstName', options.data.name.split(' ')[0], {
    delay: Math.floor(Math.random() * 60) + TYPING_SPEED
  });

  //Last name
  // await new Promise((resolve) => setTimeout(resolve, Math.floor(Math.random() * 900) + 600));
  await page.type('#txtLastName', options.data.name.replace(options.data.name.split(' ')[0], ''), {
    delay: Math.floor(Math.random() * 60) + TYPING_SPEED
  });

  //Email
  // await new Promise((resolve) => setTimeout(resolve, Math.floor(Math.random() * 900) + 600));
  await page.type('input#txtEmail', options.data.mail2, {
    delay: Math.floor(Math.random() * 60) + TYPING_SPEED
  });

  //Retype Email
  // await new Promise((resolve) => setTimeout(resolve, Math.floor(Math.random() * 900) + 600));
  await page.type('#txtRetypeEmail', options.data.mail2, {
    delay: Math.floor(Math.random() * 60) + TYPING_SPEED
  });

  //Birthdate
  //Random from 1 - 31
  const bDate = Math.floor(Math.random() * 31) + 1;
  const bMonth = Math.floor(Math.random() * 12) + 1;
  const bYear = Math.floor(Math.random() * 10) + 1990;

  //Pass date to input
  // await new Promise((resolve) => setTimeout(resolve, Math.floor(Math.random() * 900) + 600));
  await page.type('input#datepicker5', `${
    bDate <= 9 ? 
      `0${
        bDate}` : bDate
      }/${
    bMonth <= 9 ?
      `0${
        bMonth}` : bMonth
      }/${bYear}`, {
        delay: Math.floor(Math.random() * 60) + TYPING_SPEED
      });

  //Click confirm button
  // await new Promise((resolve) => setTimeout(resolve, Math.floor(Math.random() * 900) + 600));
  await page.click('#PersonalDetailsButtonArkose');

  //Wait for next page & disable timeout
  await page.waitForSelector('#inputAddress', {
    timeout: 1000 * 60 * 60,
    visible: true,
  });

  //*SECOND PAGE
  //Address
  //Await 3s
  await new Promise((resolve) => setTimeout(resolve, 3000));
  await page.type('input#inputAddress', options.data.address, {
    delay: Math.floor(Math.random() * 60) + TYPING_SPEED
  })

  //Await 1s
  await new Promise((resolve) => setTimeout(resolve, 1000));
  await page.click('#inputAddressOptions .inputAddressOptions_OtherAddressOption');

  //City
  //Remove zip code from last string, Ex: Bac Lieu 980000 -> Bac Lieu
  // await new Promise((resolve) => setTimeout(resolve, Math.floor(Math.random() * 900) + 600));
  await page.type('#txtCity', options.data.city.split(' ').slice(0, -1).join(' '), {
    delay: Math.floor(Math.random() * 60) + TYPING_SPEED
  });

  //Zip
  // await new Promise((resolve) => setTimeout(resolve, Math.floor(Math.random() * 900) + 600));
  await page.type('#txtZip', options.data.city.split(' ').slice(-1).join(' '), {
    delay: Math.floor(Math.random() * 60) + TYPING_SPEED
  });

  //Wait for next page
  // await new Promise((resolve) => setTimeout(resolve, Math.floor(Math.random() * 900) + 600));
  await page.waitForSelector('#txtCollectForeignId', {
    timeout: 1000 * 60 * 60,
    visible: true,
  });

  //Password
  // await new Promise((resolve) => setTimeout(resolve, Math.floor(Math.random() * 900) + 600));
  await page.type('#tbPassword', options.data.mailPass, {
    delay: Math.floor(Math.random() * 60) + TYPING_SPEED
  });

  //Retype Password
  // await new Promise((resolve) => setTimeout(resolve, Math.floor(Math.random() * 900) + 600));
  await page.type('#tbRetypePassword', options.data.mailPass, {
    delay: Math.floor(Math.random() * 60) + TYPING_SPEED
  });

  //Secret Question
  //Select first question
  // await new Promise((resolve) => setTimeout(resolve, Math.floor(Math.random() * 900) + 600));
  const firstOption = await page.$eval('#ddlSecurityQuestions', (el) => el.children[1].getAttribute('value'));
  
  console.log(firstOption);
  
  // await new Promise((resolve) => setTimeout(resolve, Math.floor(Math.random() * 900) + 600));
  await page.select('#ddlSecurityQuestions', firstOption || '71').catch((e) => console.log(e));
  // await new Promise((resolve) => setTimeout(resolve, Math.floor(Math.random() * 900) + 600));
  await page.type('#tbSecurityAnswer', options.data.secret, {
    delay: Math.floor(Math.random() * 60) + TYPING_SPEED
  }).catch((e) => console.log(e));

  //CCCD
  // await new Promise((resolve) => setTimeout(resolve, Math.floor(Math.random() * 900) + 600));
  await page.type('#txtCollectForeignId', options.data.cccd, {
    delay: Math.floor(Math.random() * 60) + TYPING_SPEED
  }).catch((e) => console.log(e));

  //Wait 3s
  // await new Promise((resolve) => setTimeout(resolve, 3000));
  await page.click('#AccountDetailsButton').catch((e) => console.log(e));

  //Wait for next page
  console.log('WAIT');
  const iframeElement = await page.waitForSelector('#iframMR', {
    timeout: 1000 * 60 * 60,
    visible: true,
  });

  //Wait 3s
  console.log('WAIT 3s');
  await new Promise((resolve) => setTimeout(resolve, 3000));

  const frame = await iframeElement!.contentFrame();

  await frame?.waitForSelector('#iachfield1ddl', {
    timeout: 1000 * 60 * 60,
    visible: true,
  });

  //Bank
  console.log('Bank:', options.data.bank);
  const bankInput = await frame?.$('#iachfield1ddl');
  await bankInput?.select('#iachfield1ddl', 'ORIENT COMMERCIAL JOINT STOCK BANK').catch((e) => console.log(e));

  //Branch
  console.log('Branch:', options.data.bankBranch);
  // await new Promise((resolve) => setTimeout(resolve, Math.floor(Math.random() * 900) + 600));

  const branchInput = await frame?.$('#iachfield44');
  await branchInput?.type(options.data.bankBranch, {
    delay: Math.floor(Math.random() * 60) + TYPING_SPEED
  }).catch((e) => console.log(e));

  //Account Name
  console.log('Account Name:', options.data.bankName);
  // await new Promise((resolve) => setTimeout(resolve, Math.floor(Math.random() * 900) + 600));

  const accountNameInput = await frame?.$('#iachfield2');
  await accountNameInput?.type(options.data.bankName, {
    delay: Math.floor(Math.random() * 60) + TYPING_SPEED
  }).catch((e) => console.log(e));

  //Account Number
  console.log('Account Number:', options.data.bankNum);
  // await new Promise((resolve) => setTimeout(resolve, Math.floor(Math.random() * 900) + 600));

  const accountNumInput = await frame?.$('#iachfield3');
  await accountNumInput?.type(options.data.bankNum, {
    delay: Math.floor(Math.random() * 60) + TYPING_SPEED
  }).catch((e) => console.log(e));

  // await frame?.evaluate(() => {
  //   document?.querySelector('#iachfield3')?.blur();
  // }).catch((e) => console.log(e));

  // //Checkbox
  // await new Promise((resolve) => setTimeout(resolve, Math.floor(Math.random() * 900) + 600));

  // const checkboxs = await frame?.$$('#sdReg label.radio');

  // await checkboxs?.[0]?.click().catch((e) => console.log(e));

  // await new Promise((resolve) => setTimeout(resolve, Math.floor(Math.random() * 900) + 600));

  // await checkboxs?.[1]?.click().catch((e) => console.log(e));

  // await page.click('#btnNextPhantomOnly');

  // //Delay 30s
  // await new Promise((resolve) => setTimeout(resolve, 30000));

  // await browser.close();

  browser.on('disconnected', () => {
    console.log('Browser closed');
  });
}

//Read csv
const d: Data[] = [];

const deleteProxy = async (rowIndex: number) => {
  const proxies = fs.readFileSync('proxs.txt', 'utf-8')
    .split('\n')
    .filter(Boolean);

  proxies.splice(rowIndex, 1);

  fs.writeFileSync('proxs.txt', proxies.join('\n'), 'utf-8');
}

const usedProxy: any = {};

const tempWrite = fs.createWriteStream('temp.csv')
tempWrite.write('mail,mail2,mailPass,name,city,address,secret,cccd,bankName,bankBranch,bankNum,bank');

const tempRead = fs.createReadStream('temp.csv');

const dataRead = fs.createReadStream('data.csv');

await new Promise((res) => {
  dataRead
  .on('data', (data: any) => {
    tempWrite.write(`\n${data}`);
  })
  .on('end', () => {
    tempWrite.end();
    tempWrite.close();
    dataRead.close();
    res(1);
  });
})

await new Promise((res) => {
  tempRead
  .pipe(csv())
  .on('data', (data: Data) => d.push(data))
  .on('end', async () => {
    tempRead.close();
    res(1);
  });
});

(async () => {
  let i = 0;
  for (const data of d) {
    if (!data.mail2 || i < prefs.currentRowIndex) {
      console.log('continue');
      i++;
      continue;
    }

    console.log(`${i}/${d.length - 1} --- ${prefs.currentRowIndex}`);

    const proxies = fs.readFileSync('proxs.txt', 'utf-8')
      .split('\n')
      .filter(Boolean);
      
    const prox = proxies[Math.floor(Math.random() * proxies.length)];
    const newProxyUrl = await proxyChain.anonymizeProxy(prox);

    usedProxy[newProxyUrl] = (usedProxy[newProxyUrl] || 0) + 1;

    await StartJob({
      proxyServer: newProxyUrl,
      data,
    });

    if (usedProxy[newProxyUrl] === 2) {
      await deleteProxy(proxies.indexOf(prox));
    }

    console.log('=========== [DONE] ==========');

    i++;

    prefs.currentRowIndex = (prefs.currentRowIndex || 0) + 1;

    prefs.save();
  }

  console.log('========== [COMPLETED ALL] ==========');
})();
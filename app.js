import * as puppeteer from "puppeteer";

async function interceptRequest(url) {

    try {
        const browser = puppeteer.launch({
            headless: false,
            devtools: true,
        });
        const page = await (await browser).newPage();
        await page.setRequestInterception(true);

        page.on('request', (request) => {
            if (request.url().endsWith('.png')) {
                request.respond({
                    status: 404,
                    contentType: 'application/javascript; charset=utf-8',
                    body: 'console.log(1);'
                });
            } else {
                request.continue();
                page.on('response', (response) => {
                    console.log(response.status()) // <-- I want raw HTTP(S) message, not an object
                })
            }
        });

        await page.goto(url);
        await browser.close();

        console.log('Request Interception completed');

    } catch (error) {
        console.log(error.message)
    }

}

interceptRequest('https://unsplash.com/fr')


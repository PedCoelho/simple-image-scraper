
const puppeteer = require('puppeteer');
const fs = require('fs');
const request = require('request');

var download = function(uri, filename, callback){
  request.head(uri, function(err, res, body){    
    request(uri).pipe(fs.createWriteStream(filename)).on('close', callback);
  });
};

var urls = ['INSERT URL HERE', 'INSERT URL HERE'];


(async () => {
    const browser = await puppeteer.launch({
        headless: false
    });

    // await getPage(urls, browser);
    await getAllSrc(urls, browser);
    await browser.close();
})();


async function getAllSrc(pageUrl, browser) {
    var urlCounter = 1;
    // var page;

    if (Array.isArray(pageUrl)) {
        for (url of pageUrl) {
            var page = await browser.newPage();
            try{
                await page.goto(url, {
                    waitUntil: ['domcontentloaded', 'load']
                });
            }catch(e){
                console.error('//URL Inválida// '+e);
                return browser.close();
            }
            await getImgs();
        }
    } else {
        var page = await browser.newPage();
        try{
            await page.goto(pageUrl, {
                waitUntil: ['domcontentloaded', 'load']
            });
        }catch(e){
            console.error('//URL Inválida// '+e);
            return browser.close();
        }
     await getImgs();
    }

    async function getImgs(){

  //coleta as imagens e processa as screenshots
  var imgArray = await page.$$eval('img.size-full[src]', imgs => imgs.map(img => img.getAttribute('src')));
  var prefix = 'screen_url' + urlCounter + '_img';
  var counter = 0;
  for (img of imgArray) {
      try {
          await console.log('Imagem_' + counter + ' Src:' + img);
          await download(img, './images/'+prefix+counter+' .jpg', function(){
           console.log('done');
});
      } catch (e) {
         await console.log(e);
      }
      counter++;
  };
 await page.close();
 urlCounter++;
}
  
}

//================ JAVASCRIPT NATIVO / OLD CODEBASE ======================
// function getImg() {
//     imgArray = document.getElementsByClassName('size-full');

//     for (i = 0; i < imgArray.length; i++) {
//         var link = document.createElement('a');
//         link.href = imgArray[i].src;
//         link.download = 'Download_' + i + '.jpg';
//         document.body.appendChild(link);
//         link.click();
//         document.body.removeChild(link);
//     }
// }
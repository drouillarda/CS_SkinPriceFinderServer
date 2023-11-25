const nacl = require('tweetnacl');
const https = require('https');
const axios = require('axios');

function byteToHexString(uint8arr) {
    if (!uint8arr) {
        return '';
    }

    let hexStr = '';
    const radix = 16;
    const magicNumber = 0xff;
    for (let i = 0; i < uint8arr.length; i++) {
        let hex = (uint8arr[i] & magicNumber).toString(radix);
        hex = (hex.length === 1) ? '0' + hex : hex;
        hexStr += hex;
    }

    return hexStr;
}

function hexStringToByte(str) {
    if (typeof str !== 'string') {
        throw new TypeError('Wrong data type passed to convertor. Hexadecimal string is expected');
    }
    const twoNum = 2;
    const radix = 16;
    const uInt8arr = new Uint8Array(str.length / twoNum);
    for (let i = 0, j = 0; i < str.length; i += twoNum, j++) {
        uInt8arr[j] = parseInt(str.substr(i, twoNum), radix);
    }
    return uInt8arr;
}

function hex2ascii(hexx) {
    const hex = hexx.toString();
    let str = '';
    for (let i = 0; (i < hex.length && hex.substr(i, 2) !== '00'); i += 2)
        str += String.fromCharCode(parseInt(hex.substr(i, 2), 16));
    return str;
}

// insert your api keys
const publicKey = "54e133c630ec6779ced05a1e1ef5999dae4b50ee4e6ea95db75577cef0ae544c";
const secretKey = "45aa3d6fdb06ae6ed8f7a5c4ffe357719d5b098da02e83337bebaa86eb0cf3bc54e133c630ec6779ced05a1e1ef5999dae4b50ee4e6ea95db75577cef0ae544c";
const host = 'api.dmarket.com';

function getSkinOfferFromMarket() {
    const requestOptions = {
        host: host,
        path: '/exchange/v1/offers-by-title?gameId=a8db&limit=1&currency=USD' + queryParams,
        method: 'GET',
    };

    // you can use a more high-level wrapper for requests instead of native https.request
    // check https://github.com/axios/axios as an example
    return new Promise(function(resolve, reject) {
        const request = https.request(requestOptions, (response) => {
            let body = '';
            response.on('data', (chunk) => {
                body += (chunk);
            });
            // resolve on end
            response.on('end', () => {
                try {
                    body = JSON.parse(Buffer.concat(body).toString());
                } catch(e) {
                    reject(e);
                }
                resolve(body['objects'][0]);
            });
        });
        request.end();
    });
}

function buildTargetBodyFromOffer(offer) {
    return {
        "targets": [
            {
                "amount": 1, "gameId": offer.gameId, "price": {"amount": "2", "currency": "USD"},
                "attributes": {
                    "gameId": offer.gameId, "categoryPath": offer.extra.categoryPath, "title": offer.title,
                    "name": offer.title,
                    "image": offer.image,
                    "ownerGets": {"amount": "1", "currency": "USD"}
                }
            }]
    }
}

function sign(string) {
    const signatureBytes = nacl.sign(new TextEncoder('utf-8').encode(string), hexStringToByte(secretKey));
    return byteToHexString(signatureBytes).substr(0,128);
}

function sendNewTargetRequest(requestOptions, targetRequestBody) {
    const req = https.request(requestOptions, (response) => {
        console.log('statusCode:', response.statusCode);
        response.on('data', (responseBodyBytes) => {
            console.log(hex2ascii(byteToHexString(responseBodyBytes)));
        });
    });

    req.on('error', (e) => {
        console.error(e);
    });

    req.write(targetRequestBody);
    req.end();
}

async function getDmarketSkin(_req, res) {
  try {
    const { searchSkins } = _req.query;
    if (!searchSkins) {
      return res.status(400).json({ success: false, error: 'Search query is required' });
    }
    const result = {};
    const skinOffer = await getSkinOfferFromMarket(searchSkins);
    console.log('Offer was found: ' + randomOffer.title);

    const method = "GET";
    const apiUrlPath = "/exchange/v1/offers-by-title";
    const targetRequestBody = JSON.stringify(buildTargetBodyFromOffer(skinOffer));
    console.log(targetRequestBody);
    const timestamp = Math.floor(new Date().getTime() / 1000);
    const stringToSign = method + apiUrlPath + targetRequestBody + timestamp;
    const signature = sign(stringToSign);
    const requestOptions = {
        host: host,
        path: apiUrlPath + `?search=${encodeURIComponent(searchSkins)}`,
        method: method,
        headers: {
            "X-Api-Key": publicKey,
            "X-Request-Sign": "dmar ed25519 " + signature,
            "X-Sign-Date": timestamp,
            'Content-Type': 'application/json',
        }
    };

    const responseBody = sendNewTargetRequest(requestOptions, targetRequestBody);
    console.log('Target request sent successfully.', responseBody);
    result.responseBody = responseBody;

    res.status(200).json({ success: true, result })
  } catch (error) {
    console.error('Error creating test target:', error.message);
    res.status(500).json({ success: false, error: 'Internal Server Error' });
  }

}

module.exports = {
  getDmarketSkin,
};
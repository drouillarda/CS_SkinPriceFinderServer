const nacl = require('tweetnacl');
const https = require('https');
const axios = require('axios');
const { error } = require('console');

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
const publicKey = process.env.PUBLIC_KEY;
const secretKey = process.env.SECRET_KEY;

async function getSkinOfferFromMarket(searchSkins) {
  const encodedSearchSkins = encodeURIComponent(searchSkins);
  const apiUrl = `https://api.dmarket.com/exchange/v1/offers-by-title?Title=${encodedSearchSkins}`;
    try {
      const response = await axios.get(apiUrl, {headers: {'X-Api-Key': publicKey,},
    });
      const body = response.data;
    return body['objects'][0] && body['objects'][0] || null;
    } catch (error) {
      console.error('Error making request:', error.message);
    }
}

async function buildTargetBodyFromOffer(offer) {
    return {
        "targets": [
            {
              "amount": 1,
              "gameId": offer.gameId,
              "price": {"amount": "2", "currency": "USD"},
              "attributes": {
                  "gameId": offer.gameId,
                  "categoryPath": offer.extra && offer.extra.categoryPath ? offer.extra.categoryPath : null,
                  "title": offer.title,
                  "name": offer.title,
                  "image": offer.image,
                  "ownerGets": {"amount": "1", "currency": "USD"}
                }
            }]
    }
}

async function sign(string) {
    const signatureBytes = nacl.sign(new TextEncoder('utf-8').encode(string), hexStringToByte(secretKey));
    return byteToHexString(signatureBytes).substr(0,128);
}

 async function sendNewTargetRequest(requestOptions, targetRequestBody) {
    return new Promise((resolve, reject) => {
      const req = https.request(requestOptions, (response) => {
          let body = '';
          response.on('data', (chunk) => {
              body += (chunk);
          });
          // resolve on end
          response.on('end', () => {
            resolve(body);
          });
      });
      req.on('error', (e) => {
        reject(e);
      })

      req.write(targetRequestBody);
      req.end();
  });
}

async function getDmarketSkin(req, res) {
  try {
    const { searchSkins } = req.params;
    const encodedSearchSkins = encodeURIComponent(searchSkins);
    console.log(req.params);
    if (!searchSkins) {
      return res.status(400).json({ success: false, error: 'Search query is required' });
    }
    const skinOffer = await getSkinOfferFromMarket(searchSkins);
    console.log('Offer:', skinOffer);
    console.log('Offer was found: ' + skinOffer.title);

    const method = "GET";
    const apiUrlPath = `https://api.dmarket.com/exchange/v1/offers-by-title?Title=${encodedSearchSkins}&Limit=100`;
    const targetRequestBody = JSON.stringify(buildTargetBodyFromOffer(skinOffer));
    console.log(targetRequestBody);
    const timestamp = Math.floor(new Date().getTime() / 1000);
    const stringToSign = method + apiUrlPath + targetRequestBody + timestamp;
    const signature = sign(stringToSign);
    const requestOptions = {
        path: apiUrlPath,
        method: method,
        headers: {"X-Api-Key": publicKey, "X-Request-Sign": "dmar ed25519 " + signature, "X-Sign-Date": timestamp, 'Content-Type': 'application/json',}
    };
    try {
      const response = await axios.get(apiUrlPath, {headers: {"X-Api-Key": publicKey, "X-Request-Sign": "dmar ed25519 " + signature, "X-Sign-Date": timestamp, 'Content-Type': 'application/json',}
    });
      const responseBody = response.data;
    } catch (error) {
      console.error('Error making request:', error.message);
    }
    const responseBody = await sendNewTargetRequest(requestOptions, targetRequestBody);
    console.log('Dmarket API Response:', responseBody);
 
    const parsedResponseBody = JSON.parse(responseBody);

    const skinOffers = parsedResponseBody;
    console.log('Target request sent successfully.', skinOffers);
    result.responseBody = parsedResponseBody;

    res.status(200).json({ success: true, result })
  } catch (error) {
    console.error('Error getting skin offer from the market:', error.message);
    res.status(500).json({ success: false, error: 'Internal Server Error' });
  }

}

module.exports = {
  getDmarketSkin,
};
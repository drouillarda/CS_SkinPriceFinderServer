const nacl = require('tweetnacl');

const axios = require('axios');

const getDmarket = async (_req, res, next) => {
  const apiKey = "9de61c1c8a6dfb3e33ae57325d4cb12905140f31e0e1f743621be3aa9fbb054f"

  try {
    const currentDate = new Date().toUTCString();
    const nonSignedString = (`${GET}${"/account/v1/user"}${currentDate}`);
    const privateKey = nacl.util.decodeBase64('NDVhYTNkNmZkYjA2YWU2ZWQ4ZjdhNWM0ZmZlMzU3NzE5ZDViMDk4ZGEwMmU4MzMzN2JlYmFhODZlYjBjZjNiYzU0ZTEzM2M2MzBlYzY3NzljZWQwNWExZTFlZjU5OTlkYWU0YjUwZWU0ZTZlYTk1ZGI3NTU3N2NlZjBhZTU0NGM=')
    const signature = nacl.sign.detached(nacl.util.decodeUTF8(nonSignedString), privateKey);
    const hexSignature = nacl.util.encodeBase64(signature);

    const Dmarket = await axios.get("https://api.dmarket.com/account/v1/user", {
      "headers": {
        "content-type": "application/json",
        "x-apikey": apiKey,
        "x-sign-date": currentDate,
        "x-request-sign": hexSignature,
      },
  })
    res.status(200).json(Dmarket.data);
  } catch (error) {
    res.status(500).json({error: `Error getting Dmarket data: ${error}` });
  }
  next();
};

module.exports = {
  getDmarket,
};
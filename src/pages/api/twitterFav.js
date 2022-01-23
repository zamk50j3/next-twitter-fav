const needle = require('needle')
const twitter = require("twitter");

const client = new twitter({
  consumer_key: process.env.consumer_key,
  consumer_secret: process.env.consumer_secret,
  access_token_key: process.env.access_token_key,
  access_token_secret: process.env.access_token_secret,
});
const token = process.env.bearer_token

export default async function handler(req, res) {
  const { name, maxid } = req.query
  const params = {screen_name: name, count: 180}
  if (maxid) {
    params.max_id = Numver(maxid)
  }
  const tweets = await getTweets(params)
  res.status(200).json({
    ...tweets
  })
}
// exports.handler = async (event) => {
//   const params = { screen_name: event.queryStringParameters.name, count: 180 };
//   if (event.queryStringParameters.maxid) {
//     params.max_id = Number(event.queryStringParameters.maxid);
//   }
//   const tweets = await getTweets(params);
//   return {
//     statusCode: 200,
//     headers: {
//       "Access-Control-Allow-Origin": "*",
//       "Access-Control-Allow-Headers": "Content-Type",
//       "Access-Control-Allow-Methods": "OPTIONS,GET",
//     },
//     body: JSON.stringify(tweets),
//   };
// };

const getTweets = async function (params) {
  // const endpointURL = `https://api.twitter.com/2/users/468122115/liked_tweets`;
  // const params = {
  //   "tweet.fields": "lang,author_id", // Edit optional query parameters here
  //   "user.fields": "created_at", // Edit optional query parameters here
  // };

  // // this is the HTTP header that adds bearer token authentication
  // const res = await needle("get", endpointURL, params, {
  //   headers: {
  //     "User-Agent": "v2LikedTweetsJS",
  //     authorization: `Bearer ${token}`
  //   },
  // });

  // if (res.body) {
  //   console.log(res.body);
  //   return extractData(res.body);
  // } else {
  //   throw new Error("Unsuccessful request");
  // }
  return new Promise((resolve, reject) => {
    client.get("favorites/list", params, function (error, tweets, response) {
      if (!error) {
        resolve(extractData(tweets));
      } else {
        console.error(error);
        reject(error);
      }
    });
  });
};

const extractData = function (tweets) {
  var images = { url: [], source: [], height: [], max_id: 0 };
  tweets.forEach((tweet) => {
    if (tweet.entities.media) {
      if (tweet.entities.media[0].type == "photo") {
        if (!tweet.entities.media[0].media_url_https.includes("video_thumb")) {
          images.url.push(tweet.entities.media[0].media_url_https);
          images.source.push(tweet.entities.media[0].expanded_url);
          const w = tweet.entities.media[0].sizes.medium.w;
          const h = tweet.entities.media[0].sizes.medium.h;
          images.height.push(h / w);
        }
      }
    }
  });
  const max_id = tweets[tweets.length - 1].id - 10000;
  images.max_id = max_id;
  return images;
};
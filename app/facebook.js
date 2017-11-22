
const FACEBOOK_OPTIONS = {
  // two emoji facebook app id and secrets from dev console
  appId: process.env['TWO_EMOJI_FB_APP_ID'],
  appSecret: process.env['TWO_EMOJI_FB_APP_SECRET'],
  // this is a long living access token, must be generated every 2 months or so
  accessToken: process.env['TWO_EMOJI_FB_ACCESS_TOKEN'],
  pageId: process.env['TWO_EMOJI_FB_PAGE']
}

var { Facebook, FacebookApiException } = require('fb'),
FB = new Facebook(FACEBOOK_OPTIONS);
FB.setAccessToken(FACEBOOK_OPTIONS.accessToken);

const FB_PAGE_ID = process.env['TWO_EMOJI_FB_PAGE']

const postToFacebook = (statement, cb) => {
  FB.api(`/${FACEBOOK_OPTIONS.pageId}/feed`, 'post', { message: statement }, function (response) {
    if (!response || response.error) {
      console.log('Error occured', response );
    } else {
      console.log('Post ID: ' + response.id, `statement: ${statement}` );
    }
    if (cb) cb(response);
  });
}

const testFacebook = (cb) => {
  FB.api('/me', function (response) {
    if (!response || response.error) {
      console.log('Error occured', response );
    } else {
      console.log('Test success: ' + response );
    }
    if (cb) cb(response);
  });
}


module.exports = {
  postToFacebook: postToFacebook,
  testFacebook: testFacebook
};

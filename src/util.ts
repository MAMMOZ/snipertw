import consola, { Consola } from "consola";
import { ofetch } from "ofetch";
const authorization =
  "AAAAAAAAAAAAAAAAAAAAANRILgAAAAAAnNwIzUejRCOuH5E6I8xnZz4puTs%3D1Zv7ttfk8LF81IUq16cHjhLTvJu4FA33AGWWjCpTnA";
interface TwitterCookie {
  ct0: string;
  auth_token: string;
}

async function redeemAngPao(hash: string, mobile: string) {
  try {
    const result = await ofetch(
      `https://gift.truemoney.com/campaign/vouchers/${hash}/redeem`,
      {
        method: "POST",
        body: { mobile },
      }
    );
    consola.success(`${mobile} GET ${result.data.my_ticket.amount_baht} baht!`);
  } catch (e) {
    if (!e.data) {
      console.log(e);
      consola.error("RATE LIMIT TRUEWALLET");
    }
  }
}

async function getHashFromTwitter(
  auth_token: string,
  ct0: string
): Promise<string[]> {
  try {
    const res = await ofetch(
      "https://twitter.com/i/api/graphql/fZK7JipRHWtiZsTodhsTfQ/SearchTimeline?variables=%7B%22rawQuery%22%3A%22gift.truemoney.com%22%2C%22count%22%3A20%2C%22querySource%22%3A%22typed_query%22%2C%22product%22%3A%22Latest%22%7D&features=%7B%22responsive_web_graphql_exclude_directive_enabled%22%3Atrue%2C%22verified_phone_label_enabled%22%3Afalse%2C%22creator_subscriptions_tweet_preview_api_enabled%22%3Atrue%2C%22responsive_web_graphql_timeline_navigation_enabled%22%3Atrue%2C%22responsive_web_graphql_skip_user_profile_image_extensions_enabled%22%3Afalse%2C%22c9s_tweet_anatomy_moderator_badge_enabled%22%3Atrue%2C%22tweetypie_unmention_optimization_enabled%22%3Atrue%2C%22responsive_web_edit_tweet_api_enabled%22%3Atrue%2C%22graphql_is_translatable_rweb_tweet_is_translatable_enabled%22%3Atrue%2C%22view_counts_everywhere_api_enabled%22%3Atrue%2C%22longform_notetweets_consumption_enabled%22%3Atrue%2C%22responsive_web_twitter_article_tweet_consumption_enabled%22%3Atrue%2C%22tweet_awards_web_tipping_enabled%22%3Afalse%2C%22freedom_of_speech_not_reach_fetch_enabled%22%3Atrue%2C%22standardized_nudges_misinfo%22%3Atrue%2C%22tweet_with_visibility_results_prefer_gql_limited_actions_policy_enabled%22%3Atrue%2C%22rweb_video_timestamps_enabled%22%3Atrue%2C%22longform_notetweets_rich_text_read_enabled%22%3Atrue%2C%22longform_notetweets_inline_media_enabled%22%3Atrue%2C%22responsive_web_media_download_video_enabled%22%3Afalse%2C%22responsive_web_enhance_cards_enabled%22%3Afalse%7D",
      {
        headers: {
          authorization: `Bearer ${authorization}`,
          "x-csrf-token": ct0,
          "x-twitter-active-user": "yes",
          "x-twitter-auth-type": "OAuth2Session",
          "x-twitter-client-language": "th",
          "User-Agent": "Mozilla/5.0",
          cookie:
            "_twitter_sess=BAh7CSIKZmxhc2hJQzonQWN0aW9uQ29udHJvbGxlcjo6Rmxhc2g6OkZsYXNo%250ASGFzaHsABjoKQHVzZWR7ADoPY3JlYXRlZF9hdGwrCCmBwoSNAToMY3NyZl9p%250AZCIlZjE5MjBkODEzNmM0NWRmNmQwMDBlMjZjOGQwMmUxMDI6B2lkIiU2YzZi%250AZDhiODhiZmQxMGExZDQwOTA0NDQ1ZDlkOTM5Mg%253D%253D--4bb127257c25878dfac097f0ea0d826f8f2a471f" +
            ";auth_token=" +
            auth_token +
            ";ct0=" +
            ct0 +
            ";",
        },
        method: "GET",
      }
    );
    if (res.errors) {
      consola.error("ACCOUNT ERROR");
      throw 1;
    }
    return (
      JSON.stringify(res)
        .match(/v=([a-zA-Z0-9]+)/g)
        ?.map((_) => {
          return _.replace("v=", "");
        })
        .filter((_) => _.length > 6) || []
    );
  } catch (e) {
    throw 1;
  }
}

function getParameterValueFromQueryString(
  queryString: string,
  parameterName: string
) {
  var regex = new RegExp("[?&]" + parameterName + "=([^&#]*)");
  var match = regex.exec(queryString);
  return match && match[1] && decodeURIComponent(match[1].replace(/\+/g, " "));
}

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));
export {
  redeemAngPao,
  getHashFromTwitter,
  getParameterValueFromQueryString,
  sleep,
};
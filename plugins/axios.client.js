export default function ({ $axios, env }) {
  $axios.onRequest((config) => {
    // API key should not be exposed on the frontend.
    // There should be a backend to handle this. And we can use JWT Token to get the API Key
    config.headers.common['x-rapidapi-key'] = env.RAPID_API_KEY
      ? env.RAPID_API_KEY
      : '985785cdcfmsh3ef2b8815f93b69p13b044jsn24697bc7de12'
    config.headers.common['x-rapidapi-host'] =
      'skyscanner-skyscanner-flight-search-v1.p.rapidapi.com'
  })
}

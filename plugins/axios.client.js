export default function ({ $axios, env }) {
  $axios.onRequest((config) => {
    config.headers.common['x-rapidapi-key'] = env.RAPID_API_KEY
    config.headers.common['x-rapidapi-host'] =
      'skyscanner-skyscanner-flight-search-v1.p.rapidapi.com'
  })
}

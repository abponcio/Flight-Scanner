export default function ({ $axios, env }) {
  $axios.onRequest((config) => {
    // API key should not be exposed on the frontend.
    // There should be a backend to handle this. And we can use JWT Token to get the API Key
    config.headers.common['x-rapidapi-key'] = env.RAPID_API_KEY
    config.headers.common['x-rapidapi-host'] =
      'skyscanner-skyscanner-flight-search-v1.p.rapidapi.com'
  })
}

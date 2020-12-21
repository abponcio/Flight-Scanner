export default function ({ $axios }) {
  $axios.onRequest((config) => {
    config.headers.common['x-rapidapi-key'] =
      '985785cdcfmsh3ef2b8815f93b69p13b044jsn24697bc7de12'
    config.headers.common['x-rapidapi-host'] =
      'skyscanner-skyscanner-flight-search-v1.p.rapidapi.com'
  })
}

export default class Config {
  apiBaseURL = process.env.REACT_APP_API_BASE_URL ?? 'https://devapiads.southcentralus.cloudapp.azure.com/apis/ibe';

  authToken = process.env.REACT_APP_AUTH_TOKEN ?? 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyLCJpc3MiOiJmN2JkLWtleS1zbm93ZmFsbCJ9.j4v0em_fikrGt_gQr9BaV7AUqhtakAW-4HbtkJb_-V0';

  hotelImageBaseURL = process.env.REACT_APP_HOTEL_IMAGE_BASE_URL ?? 'http://photos.hotelbeds.com/giata';

  googleMapsApiKey = 'AIzaSyDe6h49EIq4Iony4Rn9OJXcvXJ7wDTbiBw';

  ndcApiBaseURL = process.env.REACT_APP_NDC_API_BASE_URL ?? 'https://devapiads.southcentralus.cloudapp.azure.com/apis/ndc';

  ndcAuthToken = process.env.REACT_APP_NDC_API_TOKEN ?? 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyLCJpc3MiOiJmN2JkLWtleS1zbm93ZmFsbC1uZGMifQ.EhWNqRRNY1o55wJLtkNM2ZaNxMnXxtkrYXT_-yma2SI';
}

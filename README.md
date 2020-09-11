# Lases

Application for torrent downloading

## Authentication Routes

> All routes needd to start with /api, if you are accessing the api

| Route Name | Route Method | Endpoint     | Description                                     |
| ---------- | ------------ | ------------ | ----------------------------------------------- |
| Sign In    | POST         | /auth/signin | Provides user object and a authentication token |
| Sign Up    | POST         | /auth/signup | Registers new user and provides auth token      |

Sample Response for `auth/signin`

```json
{
  "user": {
    "_id": "5f5b498ec6bd733b8942d020",
    "email": "testing@mail.com",
    "name": "Jayant Malik",
    "createdAt": "2020-09-11T09:55:26.497Z",
    "updatedAt": "2020-09-11T10:44:17.088Z",
    "__v": 11
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI1ZjViNDk4ZWM2YmQ3MzNiODk0MmQwMjAiLCJlbWFpbCI6InRlc3RpbmdAbWFpbC5jb20iLCJuYW1lIjoiSmF5YW50IE1hbGlrIiwiY3JlYXRlZEF0IjoiMjAyMC0wOS0xMVQwOTo1NToyNi40OTdaIiwidXBkYXRlZEF0IjoiMjAyMC0wOS0xMVQxMDo0NDoxNy4wODhaIiwiX192IjoxMSwiaWF0IjoxNTk5ODIyMzQwLCJleHAiOjE2MDAyNTQzNDB9.Vih1mxsi6dLWFSVx1PtNrAxIXL1UmXOsHqG3KbnOe6Q"
}
```

Sample Response for `auth/signup`

```json
{
  "user": {
    "_id": "5f5b498ec6bd733b8942d020",
    "email": "testing@mail.com",
    "name": "Jayant Malik"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI1ZjViNWE1M2FjYTVlODRmMzUxYmZkNDkiLCJlbWFpbCI6InRlc3RpbkBtYWlsLmNvbSIsIm5hbWUiOiJKYXlhbnQgTWFsaWsiLCJpYXQiOjE1OTk4MjI0MTksImV4cCI6MTYwMDI1NDQxOX0.A1qh5S0Bd8hu-FpTT5UZiA5iahn3BaAmS3UmGGAq1tY"
}
```

## User Routes

Sample Response for `users/me`

```json
{
  "_id": "5f5b498ec6bd733b8942d020",
  "email": "testing@mail.com",
  "name": "Jayant Malik",
  "createdAt": "2020-09-11T09:55:26.497Z",
  "updatedAt": "2020-09-11T10:44:17.088Z",
  "__v": 11
}
```

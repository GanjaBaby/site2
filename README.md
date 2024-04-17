
# Full Stack Web Application



## API Reference

#### Get user information

```http
  GET /api/v1/user/{id}
```

| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `id`      | `int`    | **ID Required** for get user details|

#### Create new user

```http
  POST /api/v1/user/${id}
```

| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `id`      | `int`    | **ID Required** to post and create new user|





## Tech Stack

**Client:** HTML and CSS

**Server:** ExpressJS

**Database** MySQL

**Reverse Proxy** Nginx

## Software need to run the website

**Docker Desktop**: https://docs.docker.com/desktop/

**Yarn**: https://classic.yarnpkg.com/lang/en/docs/install/#windows-stable

**NodeJS**: https://nodejs.org/en/download
## Installation

Clone git repository

```bash
  git clone git@github.com:GanjaBaby/site2.git
```

Command to run project

```bash
  docker-compose up --build
```


    
## Badges

[![GPLv3 License](https://img.shields.io/badge/License-GPL%20v3-yellow.svg)](https://opensource.org/licenses/)


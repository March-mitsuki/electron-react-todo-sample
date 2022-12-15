# developing guide

- reqirement
  - nodejs v18+
  - yarn
  - docker
  - gui enviromention (electron only)

### step 1 - prepare your enviroment

first, clone this repository

```bash
git clone https://github.com/March-mitsuki/youdoya.git
```

install dependencies

```bash
yarn install
```

init necessary enviroment file

```bash
yarn init-app
```

**if you are using mac with Apple silicon(zsh), please run below command instead**

```bash
yarn init-app-z
```

start docker compose service

```bash
docker compose up -d
```

migarate database in development mode

```bash
yarn db:migrate:dev
```

or you just want to testing but not migrate, run prisma db push directly instead

```bash
yarn run:prisma db push
```

### step 2

start dev server

```
yarn dev:server
```

**common step is over here, if**

### develop electron app

keep server running, and open a diffrent terminal, start webpack there.

this is to watch file changes and antomatically compile ts file to js.

```
yarn dev:electron:webpack
```

open another separate terminal, start electron app there

this is to restart electron app when webpack output js file changes

```
yarn dev:electron:app
```

**remind:** electron hot reload plugin customize with this PR
https://github.com/catdad/electronmon/pull/67

# make a production version

production without docker (local mysql OR mariadb)

# todo

- electron-app
  - [ ] design loading screen
- server
- web

# logic memo

1. uesr right click (open ctx-menu)
1. click edit
1. dispatch todo.id to store
1. store save todo id and set form type to edit
1. form open and check type is edit
1. find current todo in state.todos
1. display current todo in form

# coding stand

- firebase:
  - client todo class do not include server side cloum (ex: created_at, updated_at, deleted_at, ...etc)

## how to use

1. run `yarn init-app` to init necessary enviroment.

- **if you are using mac with Apple silicon(zsh), please run** `yarn init-app-z`

2. run `docker compose up -d` to up docker compose

3. migrate your datebase `yarn db:migrate`

- or run it on development mode `yarn db:migrate:dev`

### electron_app

electron hot reload plugin customize with this PR

https://github.com/catdad/electronmon/pull/67

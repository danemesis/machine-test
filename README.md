# MachineTest

This is an implementation of the following [task](./docs/Machine_test.pdf)

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 18.1.0.

## Development

### Run locally

- clone repo & install dependencies,
- run `npm run codegen-trials-api:local`,
- run `npm run start` for a dev server,
- navigate to `http://localhost:4200/`

### Test & Build & Deploy

- run `npm run test`,
- once committed `lint, prettier and commitlint` will be executed automatically by `hooks`,
- Github actions will build, lint and test (unit tests),
- once PR approved & merged to main

## Project structure

Project is a simple Angular 18 application utilizes [primeng](https://primeng.org/) for UI component, [primeicons](https://primeng.org/icons) and [tailwind](https://tailwindcss.com/) for styles.

Angular source code is pretty standard:

- The app has 2 pages and they are in respective `/pages` folder,
- `/containers` for smart components, `/components` for dumb,
- `/services` folder holds business-logic,
- `/api` - data services only (no business / ui )

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

# Resco - Room comparator

This project is a list of rooms with their detail pages. Each of the rooms has reviews and ratings.

There are three types of users

- Basic user - can add a review to a room
- Owner - can modify his room, reply once to each review in rooms owned by him
- Admin - can modify/add/remove - users/rooms
- Superadmin - same as Admin, but can't be removed/modified

The list of rooms and reviews can be sorted by various metrics.

## To run the project for development

```js
yarn
yarn dev
```

## To run the project for production

```js
yarn --frozen-lockfile // --production
yarn build
yarn start
```

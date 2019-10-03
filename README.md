# Sacafi 🥡
> Gimme dat wifi baus!!

## Dev Setup 🥾
1. Boot up MongoDB: `"C:\Program Files\MongoDB\Server\4.2\bin\mongod" --dbpath="C:\Users\Ethan\Documents\GitHub\sacawifi\backend\data\db"`
1. Set up .env in backend directory: [see SAMPLE.env](backend/SAMPLE.env)
1. Spin up backend server in backend directory: `npm run dev`
1. Spin up frontend server in frontend directory: `npm run serve`
1. Test in [Postman](https://github.com/gothinkster/realworld/blob/master/api/Conduit.postman_collection.json) and on [localhost](http://localhost:8080)

## Feature Doc 🐾
* Accounts can view map of places with verified wifi access, but can only unlock one per day using their free account.
* Unverified wifi access points can be used once per free account in order to verify the access point.
* Paid accounts can view any wifi access point.
* Open wifi access points (ones without passwords) are viewable for free as well. Users can verify if that access point is secure (safe to use; not a phish).

## Todo ✔
* Get Leaflet working ([quickstart](https://korigan.github.io/Vue2Leaflet/#/quickstart.md))
* Research for a good web transaction processor

---

Engineered with 💖 by EthanThatOneKid
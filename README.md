# Sacafi 🥡
> Gimme dat wifi baus!!

## Dev Setup 🥾
1. Set up .env in backend directory: [see SAMPLE.env](backend/SAMPLE.env)
1. Spin up backend server in backend directory: `npm run dev`
1. Spin up frontend server in frontend directory: `npm run serve`
1. Test in [Postman](https://github.com/gothinkster/realworld/blob/master/api/Conduit.postman_collection.json) and on [localhost](http://localhost:8080)

## Business Aspect 💰
* Accounts can view map of places with verified wifi access, but can only unlock one per day using their free account.
* Unverified wifi access points can be used once per free account in order to verify the access point.
* Paid accounts can view any wifi access point.
* Open wifi access points (ones without passwords) are viewable for free as well. Users can verify if that access point is secure (safe to use; not a phish).

## Developer Notes 📝
* To add a new property to the Article (location) schema:
    * Add it to `ArticleSchema`'s initialization in [Article.js](backend\models\Article.js).
    * Add it to `ArticleSchema.methods.toJSONFor` (JSON output) in [Article.js](backend\models\Article.js)
    * Make appropriate adjustments where the schema is used, such as in [Article.vue](frontend\src\views\Article.vue), [ArticleEdit.vue](frontend\src\views\ArticleEdit.vue), etc.
* Check out [Ionicons](https://ionicons.com/) to pick out the perfect icon for some element or another.

## Todo ✔
* Research for a good web transaction processor.

## Known Bugs 🐛
* Various security risks within npm packages.
* TagList does not load tags in editing page.
* Does not redirect to location after creating/updating location data.
* Description input should be a textarea.
* Notification does not pop up upon copying data to clipboard.
* Cannot upload profile picture from device.

---

Engineered with 💖 by EthanThatOneKid
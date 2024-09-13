const express = require('express');
const app = express();
const mongoose = require('mongoose');
const Listing = require('./models/listing.js');
const path = require('path');
const methodOverride = require('method-override');
const ejsMate = require('ejs-mate');
const wrapAsync = require("./utils/wrapAsync.js");
const ExpressError = require("./utils/expressError.js");

const port = 8080;
const MONGO_URL = 'mongodb://127.0.0.1:27017/voyage';

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.urlencoded({ extended: true}));
app.use(methodOverride('_method'));
app.engine('ejs', ejsMate);
app.use(express.static(path.join(__dirname, 'public')));

main()
.then(() => {
    console.log('connection succesful');
})
.catch((err) => {
    console.log(err);
});

async function main() {
    mongoose.connect(MONGO_URL);
}

// New route
app.get('/listings/new', (req, res) => {
    res.render('new.ejs');
});

app.post('/listings', wrapAsync(async (req, res, next) => {
    let listing = new Listing(req.body.listing);
    await listing.save();
    res.redirect('/listings');
}));

// Edit route
app.get('/listings/:id/edit', wrapAsync(async (req, res) => {
    let {id} = req.params;
    let listing = await Listing.findById(id);
    res.render('edit.ejs', {listing});
}));

app.put('/listings/:id', wrapAsync(async (req, res) => {
    let {id} = req.params;
    console.log(req.body.listing);
    await Listing.findByIdAndUpdate(id, {...req.body.listing});
    res.redirect(`/listings/${id}`);
}));

// Index route
app.get('/listings', wrapAsync(async (req, res) => {
    let listings = await Listing.find();
    res.render('index.ejs', {listings})
}));

// show route
app.get('/listings/:id', wrapAsync(async (req, res) => {
    let {id} = req.params;
    let listing = await Listing.findById(id);
    res.render('show.ejs', {listing});
}));

// delete route
app.delete('/listings/:id', wrapAsync(async (req, res) => {
    let {id} = req.params;
    await Listing.findByIdAndDelete(id);
    res.redirect('/listings');
}));

app.all('*', (req, res, next) => {
    next(new ExpressError(404, "Page not found"));
});

app.use((err, req, res, next) => {
    let {status=500, message="something went wrong!"} = err;
    res.status(status).render("error.ejs", {status, message});
});

app.listen(port, () => {
    console.log('server started');
});
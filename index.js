const express = require('express');
const app = express();
const mongoose = require('mongoose');
const Listing = require('./models/listing.js');
const path = require('path');
const methodOverride = require('method-override');

const port = 8080;
const MONGO_URL = 'mongodb://127.0.0.1:27017/voyage';

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.urlencoded({ extended: true}));
app.use(methodOverride('_method'));

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

app.listen(port, () => {
    console.log('server started');
});

// New route
app.get('/listings/new', (req, res) => {
    res.render('new.ejs');
});

app.post('/listings', async (req, res) => {
    let listing = new Listing(req.body.listing);
    await listing.save();
    res.redirect('/listings');
});

// Edit route
app.get('/listings/:id/edit', async (req, res) => {
    let {id} = req.params;
    let listing = await Listing.findById(id);
    res.render('edit.ejs', {listing});
});

app.put('/listings/:id', async (req, res) => {
    let {id} = req.params;
    await Listing.findByIdAndUpdate(id, {...req.body.listing});
    res.redirect(`/listings/${id}`);
})

// Index route
app.get('/listings', async (req, res) => {
    let listings = await Listing.find();
    res.render('index.ejs', {listings})
});

// show route
app.get('/listings/:id', async (req, res) => {
    let {id} = req.params;
    let listing = await Listing.findById(id);
    res.render('show.ejs', {listing});
});

// delete route
app.delete('/listings/:id', async (req, res) => {
    let {id} = req.params;
    await Listing.findByIdAndDelete(id);
    res.redirect('/listings');
});
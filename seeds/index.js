const mongoose = require('mongoose');
const Techrepair = require('../models/techrepair');
const {names, cities} = require('./seedHelpers');

mongoose.connect('mongodb://localhost:27017/tech-repair', {
    useNewUrlParser: true, 
    // useCreateIndex: true,
    useUnifiedTopology: true
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
})


const imagesToFill = [
    {
        url: 'https://res.cloudinary.com/dj2dxtus2/image/upload/v1661519328/TechRepairShops/plsaavnufd1o6jn90qru.jpg',
        filename: 'TechRepairShops/plsaavnufd1o6jn90qru'
    },
    {
        url: 'https://res.cloudinary.com/dj2dxtus2/image/upload/v1661519302/TechRepairShops/h9mevswrwbizblajceql.jpg',
        filename: 'TechRepairShops/h9mevswrwbizblajceql'
    },
    {
        url: 'https://res.cloudinary.com/dj2dxtus2/image/upload/v1661519328/TechRepairShops/e6ahtdiefv79ojyh2z53.jpg',
        filename: 'TechRepairShops/e6ahtdiefv79ojyh2z53'
    },
    {
        url: 'https://res.cloudinary.com/dj2dxtus2/image/upload/v1661519328/TechRepairShops/yvnbkueqiqlokw7ln3hn.jpg',
        filename: 'TechRepairShops/yvnbkueqiqlokw7ln3hn'
    },
    {
        url: 'https://res.cloudinary.com/dj2dxtus2/image/upload/v1661519328/TechRepairShops/qomifif2a5myxnwgv0o2.jpg',
        filename: 'TechRepairShops/qomifif2a5myxnwgv0o2'
    }
]


const seedDB = async () => {
    await Techrepair.deleteMany({});
    for(let i = 0; i < 100; i++) {
        const randNum = Math.floor(Math.random() * 100);
        const price = Math.floor(Math.random() * 20 + 10);
        const phone = Math.floor(100000000 + Math.random() * 9000000000);
        const shop = new Techrepair ({
            author: '62f51cd23b69f73df9ef54f5',
            location: `${cities[randNum]}, CA`,
            title: `${names[randNum]}`,
            // image: 'https://source.unsplash.com/collection/8357212',
            images: imagesToFill,
            description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Autem aspernatur beatae voluptas modi est cum aliquam officiis molestias delectus optio, sunt deserunt hic, fugit ad mollitia enim impedit dolor officia.',
            price,
            phone
        })

        await shop.save();
    }
}

seedDB().then(() => {
    mongoose.connection.close();
})
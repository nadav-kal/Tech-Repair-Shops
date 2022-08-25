const mongoose = require('mongoose');
const Techrepair = require('../models/techrepair');
// const cities = require('./cities');
const {names, cities} = require('./seedHelpers');
// const myDownload = require('./images');

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

// const randBetweenInput = input => Math.floor(Math.random() * input);
// myDownload();

// const generateImage = setTimeOut(function() {
//     return 'https://source.unsplash.com/collection/8357212';
// },2000 * i);

const seedDB = async () => {
    await Techrepair.deleteMany({});
    for(let i = 0; i < 100; i++) {
        const randNum = Math.floor(Math.random() * 100);
        const price = Math.floor(Math.random() * 20 + 10);
        const phone = Math.floor(100000000 + Math.random() * 9000000000);
        const shop = new Techrepair ({
            author: '62f51cd23b69f73df9ef54f5',
            location: `${cities[randNum]}`,
            title: `${names[randNum]}`,
            // image: 'https://source.unsplash.com/collection/8357212',
            images: [
                {
                    url: 'https://res.cloudinary.com/dj2dxtus2/image/upload/v1660904190/TechRepairShops/lcokpq1fbybg870i0jre.jpg',
                    filename: 'TechRepairShops/lcokpq1fbybg870i0jre'
                },
                {
                    url: 'https://res.cloudinary.com/dj2dxtus2/image/upload/v1660904190/TechRepairShops/rmwqylaaxo3tjojk5zep.jpg',
                    filename: 'TechRepairShops/rmwqylaaxo3tjojk5zep'
                }
            ],
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
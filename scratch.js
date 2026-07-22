//TEMP FILE FOR TESTING COMPLETED MILESTONES' FUNCTIONALITY

import { Users, Books, Reviews } from "./models/associations.js";

const addUser = async () => {
    try {
        const data = await Users.create({
            username: "johndoe",
            email: "jd@gmail.com",
            passwordHash: "$2a$12$N.wTwM4AdyEWuS"
        });

        console.log(data);
    }

    catch (err) {
        console.log("Issue with adding a user");
        console.log(err);
    }
}

const addBook = async () => {
    try {
        const data = await Books.create({
            title: "And Then There Were None",
            author: "Agatha Christie",
            genre: "Suspense, Mystery, Thriller",
            price: 10.99
        });

        console.log(data);
    }

    catch (err) {
        console.log("Issue with adding a Book");
        console.log(err);
    }
}

const addReview = async () => {
    try {
        const data = await Reviews.create({
            rating: 4.8,
            comment: "Unputdownable...Absolute Cinema!!",
            user_id: 1,
            book_id: 1
        });

        console.log(data);
    }

    catch (err) {
        console.log("Issue with adding a Review");
        console.log(err);
    }
}

const getBooks = async () => {
    try {
        const res = await Books.findAll();
        console.log(res);
    }

    catch (err) {
        console.log("Couldnt read Books");
        console.error(err);
    }
    
}

const getReviews = async () => {
    try {
        const res = await Reviews.findAll();
        console.log(res);
    }

    catch (err) {
        console.log("Couldnt read Reviews");
        console.error(err);
    }
}

const updateBook = async () => {
    try {
        const update = await Books.update(
            {
                price: 8.97
            }, 
            {
                where: {
                    author: "Agatha Christie"
                }
            }
        )
    }

    catch (err) {
        console.log("Couldnt update book");
        console.log(err);
    }
}

const updateReview = async () => {
    try {
        const update = await Reviews.update(
            {
                rating: 4.5
            }, 
            {
                where: {
                    review_id: 1
                }
            }
        )
    }

    catch (err) {
        console.log("Couldnt update Review");
        console.log(err);
    }
}

const deleteReviews = async () => {
    try {
        await Reviews.truncate();
        console.log("Deleted records of Reviews");
    }
    catch (err) {
        console.log(err);
    }
}

const deleteBooks = async () => {
    try {
        await Books.truncate();
        console.log("Deleted records of Books");
    }
    catch (err) {
        console.log(err);
    }
}

const deleteUsers = async () => {
    try {
        await Users.truncate();
        console.log("Deleted records of Users");
    }

    catch (err) {
        console.log(err);
    }
}

// const createTest2 = async () => {
//     try {

//         const book1 = await Books.create({
//             title: "lessgoo",
//             author: "idkwho",
//             genre: "mystery",
//             price: 11.99
//         });

//         console.log("Inserted successfully");
//         console.log(book1);
//     }

//     catch (err) {
//         console.error(err);
//     }
// }

const getTest = async () => {

    try {
        const res = await Books.findByPk(1);
        console.log(res.dataValues);
    }

    catch (err) {
        console.log(err);
    }
}

getTest();
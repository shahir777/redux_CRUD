import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { addDoc, collection, deleteDoc, doc, getDocs } from "firebase/firestore";
import db, { storage } from "../Firebase/Config";
import { v4 } from "uuid";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";

// Function to upload an image to Firebase Storage
export const uploadImage = createAsyncThunk(
    "books/uploadImage",
    async (file) => {
        try {
            console.log("hhir")
            const filename = v4();
            const storageRef = ref(storage, `Logos/${filename}`);
            await uploadBytes(storageRef, file);
            const downloadURL = await getDownloadURL(storageRef);
            return downloadURL;
        }
        catch (error) {
            console.log("hhir")
            console.error("Error uploading image:", error);
            throw error; 
        }

    }
);

// Function to add a book to Firestore
export const addBookToFirestore = createAsyncThunk(
    "books/addBookToFirestore",
    async ({ book, imageFile }, { dispatch }) => {
        try {
            // If an image file is provided, upload it and get the download URL
            let imageUrl = null;
            if (imageFile) {
                const imageUploadResult = await dispatch(uploadImage(imageFile));
                imageUrl = imageUploadResult.payload;
            }

            // Add the book to Firestore with the download URL of the image
            const addBookRef = await addDoc(collection(db, "Books"), {
                ...book,
                imageUrl,
            });

            return { id: addBookRef.id, book: { ...book, imageUrl } };
        } catch (error) {
            console.error("Error adding book to Firestore:", error);
            throw error; // Propagate the error to be handled elsewhere
        }
    }
);


//displaying books
export const fetchBooks = createAsyncThunk(
    'books/fetchBooks',
    async () => {
        const querySnapshot = await getDocs(collection(db, 'Books'));
        const books = querySnapshot.docs.map((doc) => ({
            id: doc.id,
            book: doc.data(),
        }));
        return books;
    }
);

//deleting book
export const deleteBook = createAsyncThunk(
    'books/deleteBook',
    async (id) => {
        const books = await getDocs(collection(db, 'Books'));
        for (var snap of books.docs) {
            if (snap.id === id) {
                await deleteDoc(doc(db, 'Books', snap.id));
            }
        }
        return id;
    }
);

// deleting all books
export const deleteAllBooks = createAsyncThunk(
    'books/deleteAllBooks',
    async () => {
        const books = await getDocs(collection(db, 'Books'));
        for (var snap of books.docs) {
            await deleteDoc(doc(db, 'Books', snap.id));
        }
        return [];
    }
);

const bookSlice = createSlice({
    name: 'Books',
    initialState: {
        booksArray: [],
    },

    //we handle synchronus actions in reducers
    reducers: {

    },

    //we handle asynchronus functions in extraReducers
    extraReducers: (builder) => {

        //adding book into database
        builder.addCase(
            addBookToFirestore.fulfilled, (state, action) => {
                state.booksArray.push(action.payload)
            })
            //done adding book into database

            //displaying books
            .addCase(
                fetchBooks.fulfilled, (state, action) => {
                    state.booksArray = action.payload;
                })
            //done displaying books

            //deleting book
            .addCase(
                deleteBook.fulfilled, (state, action) => {
                    state.booksArray = state.booksArray.filter((book) => book.id !== action.payload);
                })
            //done deleting book

            //deleting all books
            .addCase(
                deleteAllBooks.fulfilled, (state, action) => {
                    state.booksArray = action.payload;
                })
    }
});

export default bookSlice.reducer;
import {  useState } from "react";
import { useDispatch } from "react-redux";
import { addBookToFirestore } from "../Store/BookSlice";

export const AddBooks = () => {
  const dispatch = useDispatch();

  // add book states
  const [isbn, setIsbn] = useState("");
  const [author, setAuthor] = useState("");
  const [title, setTitle] = useState("");
  const [authorPhoto, setAuthorPhoto] = useState("");

  

  // add book event
  const handleAddBook = (e) => {
    e.preventDefault();

    const book = {
      isbn,
      author,
      title,
    };

    // Dispatch the addBookToFirestore action with the book details and image file
    dispatch(addBookToFirestore({ book, imageFile: authorPhoto }));

    // Clearing form
    setIsbn("");
    setAuthor("");
    setTitle("");
    setAuthorPhoto("");

    console.log("State after clearing:", { isbn, author, title, authorPhoto });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setAuthorPhoto(file);
  };


  return (
    <>
        <form className='form-group custom-form' onSubmit={handleAddBook}>

          <label>#ISBN</label>
          <input className='form-control' required
            onChange={(e) => setIsbn(e.target.value)} value={isbn} />
          <br />

          <label>Author</label>
          <input className='form-control' required
            onChange={(e) => setAuthor(e.target.value)} value={author} />
          <br />

          <label>Title</label>
          <input className='form-control' required
            onChange={(e) => setTitle(e.target.value)} value={title} />
          <br />

          <label>Author Photo</label>
          <input type="file" className='form-control' required onChange={handleFileChange} />
          <br />

          <button type='submit' className='btn btn-success'>Add</button>

        </form>
    </>
  )
}

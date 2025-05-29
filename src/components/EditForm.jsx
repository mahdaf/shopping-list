import React, { useState, useEffect } from 'react';

// library imports
import { CheckIcon } from '@heroicons/react/24/solid';

const EditForm = ({ editedTask, updateTask, closeEditMode }) => {
<<<<<<< HEAD
  const [updatedTaskName, setUpdatedTaskName] = useState(editedTask.name);
  const [updatedPrice, setUpdatedPrice] = useState(editedTask.price);
  const [updatedQuantity, setUpdatedQuantity] = useState(editedTask.quantity);
  const [updatedImage, setUpdatedImage] = useState(editedTask.image);
=======
  const [updatedNama, setUpdatedNama] = useState(editedTask.nama);
  const [updatedHarga, setUpdatedHarga] = useState(editedTask.harga);
  const [updatedJumlah, setUpdatedJumlah] = useState(editedTask.jumlah);
  const [updatedImg, setUpdatedImg] = useState(editedTask.img);
>>>>>>> daftarbelanja/master

  useEffect(() => {
    const closeModalIfEscaped = (e) => {
      e.key === "Escape" && closeEditMode();
    };

    window.addEventListener('keydown', closeModalIfEscaped);

    return () => {
      window.removeEventListener('keydown', closeModalIfEscaped);
    };
  }, [closeEditMode]);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
<<<<<<< HEAD
        setUpdatedImage(reader.result); // Set updated image as base64 URL
=======
        setUpdatedImg(reader.result); // Set updated image as base64 URL
>>>>>>> daftarbelanja/master
      };
      reader.readAsDataURL(file);
    }
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    updateTask({
      ...editedTask,
<<<<<<< HEAD
      name: updatedTaskName,
      price: updatedPrice,
      quantity: updatedQuantity,
      image: updatedImage,
=======
      nama: updatedNama,
      harga: updatedHarga,
      jumlah: updatedJumlah,
      img: updatedImg,
>>>>>>> daftarbelanja/master
    });
  };

  return (
    <div
      role="dialog"
      aria-labelledby="editTask"
      onClick={(e) => { e.target === e.currentTarget && closeEditMode(); }}
    >
      <form
        className="todo"
        onSubmit={handleFormSubmit}
      >
        <div className="wrapper">
          <input
            type="text"
<<<<<<< HEAD
            id="editTask"
            className="input"
            value={updatedTaskName}
            onInput={(e) => setUpdatedTaskName(e.target.value)}
=======
            id="editNama"
            className="input"
            value={updatedNama}
            onInput={(e) => setUpdatedNama(e.target.value)}
>>>>>>> daftarbelanja/master
            required
            autoFocus
            maxLength={60}
            placeholder="Update Nama Barang"
          />
<<<<<<< HEAD
          <label htmlFor="editTask" className="label">Update Nama Barang</label>
=======
          <label htmlFor="editNama" className="label">Update Nama Barang</label>
>>>>>>> daftarbelanja/master
        </div>
        <div className="wrapper">
          <input
            type="number"
<<<<<<< HEAD
            id="editPrice"
            className="input"
            value={updatedPrice}
            onInput={(e) => setUpdatedPrice(e.target.value)}
            required
            placeholder="Update Harga Barang"
          />
          <label htmlFor="editPrice" className="label">Update Harga Barang</label>
=======
            id="editHarga"
            className="input"
            value={updatedHarga}
            onInput={(e) => setUpdatedHarga(e.target.value)}
            required
            placeholder="Update Harga Barang"
          />
          <label htmlFor="editHarga" className="label">Update Harga Barang</label>
>>>>>>> daftarbelanja/master
        </div>
        <div className="wrapper">
          <input
            type="number"
<<<<<<< HEAD
            id="editQuantity"
            className="input"
            value={updatedQuantity}
            onInput={(e) => setUpdatedQuantity(e.target.value)}
            required
            placeholder="Update Jumlah Barang"
          />
          <label htmlFor="editQuantity" className="label">Update Jumlah Barang</label>
=======
            id="editJumlah"
            className="input"
            value={updatedJumlah}
            onInput={(e) => setUpdatedJumlah(e.target.value)}
            required
            placeholder="Update Jumlah Barang"
          />
          <label htmlFor="editJumlah" className="label">Update Jumlah Barang</label>
>>>>>>> daftarbelanja/master
        </div>
        <div className="wrapper">
          <input
            type="file"
<<<<<<< HEAD
            id="editImage"
=======
            id="editImg"
>>>>>>> daftarbelanja/master
            className="input"
            accept="image/*"
            onChange={handleImageUpload}
          />
<<<<<<< HEAD
          <label htmlFor="editImage" className="label">Update Gambar</label>
        </div>
        <button
          className="btn"
          aria-label={`Confirm edited task to now read ${updatedTaskName}`}
=======
          <label htmlFor="editImg" className="label">Update Gambar</label>
        </div>
        <button
          className="btn"
          aria-label={`Confirm edited task to now read ${updatedNama}`}
>>>>>>> daftarbelanja/master
          type="submit"
        >
          <CheckIcon strokeWidth={2} height={24} width={24} />
        </button>
      </form>
    </div>
  );
};

export default EditForm;

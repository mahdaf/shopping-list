import React, { useState } from "react";
import { PlusIcon } from "@heroicons/react/24/solid";

const CustomForm = ({ addItem }) => {
<<<<<<< HEAD
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [quantity, setQuantity] = useState("");
  const [image, setImage] = useState("");
=======
  const [nama, setNama] = useState("");
  const [harga, setHarga] = useState("");
  const [jumlah, setJumlah] = useState("");
  const [img, setImg] = useState("");
>>>>>>> daftarbelanja/master

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const validFormats = ["image/jpeg", "image/png", "image/jpg"];
      const maxSize = 1 * 1024 * 1024; // 1 MB

      if (!validFormats.includes(file.type)) {
        alert("Hanya file JPG, JPEG, dan PNG yang diperbolehkan.");
        return;
      }

      if (file.size > maxSize) {
        alert("Ukuran file tidak boleh lebih dari 1 MB.");
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
<<<<<<< HEAD
        setImage(reader.result); // Set image as base64 URL
=======
        setImg(reader.result); // Set image as base64 URL
>>>>>>> daftarbelanja/master
      };
      reader.readAsDataURL(file);
    }
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    addItem({
<<<<<<< HEAD
      name,
      price,
      quantity,
      image,
      id: Date.now(),
    });
    setName("");
    setPrice("");
    setQuantity("");
    setImage("");
=======
      nama,
      harga,
      jumlah,
      img
    });
    setNama("");
    setHarga("");
    setJumlah("");
    setImg("");
>>>>>>> daftarbelanja/master
  };

  return (
    <form className="todo" onSubmit={handleFormSubmit}>
      <div className="wrapper">
        <input
          type="text"
<<<<<<< HEAD
          id="name"
          className="input"
          value={name}
          onInput={(e) => setName(e.target.value)}
          required
          placeholder="Nama Barang"
        />
        <label htmlFor="name" className="label">Nama Barang</label>
=======
          id="nama"
          className="input"
          value={nama}
          onInput={(e) => setNama(e.target.value)}
          required
          placeholder="Nama Barang"
        />
        <label htmlFor="nama" className="label">Nama Barang</label>
>>>>>>> daftarbelanja/master
      </div>
      <div className="wrapper">
        <input
          type="number"
<<<<<<< HEAD
          id="price"
          className="input"
          value={price}
          step="1000"
          onInput={(e) => setPrice(e.target.value)}
          required
          placeholder="Harga Barang"
        />
        <label htmlFor="price" className="label">Harga Barang</label>
=======
          id="harga"
          className="input"
          value={harga}
          step="1000"
          onInput={(e) => setHarga(e.target.value)}
          required
          placeholder="Harga Barang"
        />
        <label htmlFor="harga" className="label">Harga Barang</label>
>>>>>>> daftarbelanja/master
      </div>
      <div className="wrapper">
        <input
          type="number"
<<<<<<< HEAD
          id="quantity"
          className="input"
          value={quantity}
          onInput={(e) => setQuantity(e.target.value)}
          required
          placeholder="Jumlah Barang"
        />
        <label htmlFor="quantity" className="label">Jumlah Barang</label>
=======
          id="jumlah"
          className="input"
          value={jumlah}
          onInput={(e) => setJumlah(e.target.value)}
          required
          placeholder="Jumlah Barang"
        />
        <label htmlFor="jumlah" className="label">Jumlah Barang</label>
>>>>>>> daftarbelanja/master
      </div>
      <div className="wrapper">
        <input
          type="file"
<<<<<<< HEAD
          id="image"
=======
          id="img"
>>>>>>> daftarbelanja/master
          className="input"
          accept="image/*"
          onChange={handleImageUpload}
          required
        />
<<<<<<< HEAD
        <label htmlFor="image" className="label">Unggah Gambar</label>
=======
        <label htmlFor="img" className="label">Unggah Gambar</label>
>>>>>>> daftarbelanja/master
      </div>
      <button className="btn" aria-label="Add Item" type="submit">
        <PlusIcon />
      </button>
    </form>
  );
};

export default CustomForm;

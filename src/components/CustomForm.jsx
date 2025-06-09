import { useState } from "react";
import { PlusIcon } from "@heroicons/react/24/solid";

const CustomForm = ({ addItem }) => {
  const [formData, setFormData] = useState({
    nama: "",
    harga: "",
    jumlah: "",
    img: "",
    imgValid: true
  });

  const DEFAULT_IMG = "https://raw.githubusercontent.com/mahdaf/shopping-list/refs/heads/main/src/assets/shop.png";

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const validFormats = ["image/jpeg", "image/png", "image/jpg"];
      const maxSize = 1 * 1024 * 1024; // 1 MB

      if (!validFormats.includes(file.type)) {
        alert("Hanya file JPG, JPEG, dan PNG yang diperbolehkan.");
        setFormData(prev => ({
          ...prev,
          img: "",
          imgValid: false
        }));
        return;
      }

      if (file.size > maxSize) {
        alert("Ukuran file tidak boleh lebih dari 1 MB.");
        setFormData(prev => ({
          ...prev,
          img: "",
          imgValid: false
        }));
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({
          ...prev,
          img: reader.result,
          imgValid: true
        }));
      };
      reader.readAsDataURL(file);
    } else {
      setFormData(prev => ({
        ...prev,
        img: "",
        imgValid: true
      }));
    }
  };

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [id]: value
    }));
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (!formData.imgValid) {
      alert("Gambar tidak valid. Silakan upload gambar yang sesuai (JPG/PNG/JPEG kurang dari 1 MB).");
      return;
    }
    addItem({
      nama: formData.nama,
      harga: formData.harga,
      jumlah: formData.jumlah,
      img: formData.img || DEFAULT_IMG
    });
    setFormData({
      nama: "",
      harga: "",
      jumlah: "",
      img: "",
      imgValid: true
    });
    e.target.reset();
  };

  return (
    <form className="todo" onSubmit={handleFormSubmit}>
      <div className="wrapper">
        <input
          type="text"
          id="nama"
          className="input"
          value={formData.nama}
          onChange={handleInputChange}
          required
          placeholder="Nama Barang"
        />
        <label htmlFor="nama" className="label">Nama Barang</label>
      </div>
      <div className="wrapper">
        <input
          type="number"
          id="harga"
          className="input"
          value={formData.harga}
          step="1000"
          onChange={handleInputChange}
          required
          placeholder="Harga Barang"
        />
        <label htmlFor="harga" className="label">Harga Barang</label>
      </div>
      <div className="wrapper">
        <input
          type="number"
          id="jumlah"
          className="input"
          value={formData.jumlah}
          onChange={handleInputChange}
          required
          placeholder="Jumlah Barang"
        />
        <label htmlFor="jumlah" className="label">Jumlah Barang</label>
      </div>
      <div className="wrapper">
        <input
          type="file"
          id="img"
          className="input"
          accept="image/*"
          onChange={handleImageUpload}
        />
        <label htmlFor="img" className="label">Unggah Gambar</label>
      </div>
      <button className="btn" aria-label="Add Item" type="submit">
        <PlusIcon />
      </button>
    </form>
  );
};

export default CustomForm;

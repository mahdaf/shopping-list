import React, { useState, useEffect } from 'react';
// library imports
import { CheckIcon } from '@heroicons/react/24/solid';

const EditForm = ({ editedTask, updateTask, closeEditMode }) => {
  const [updatedNama, setUpdatedNama] = useState(editedTask.nama);
  const [updatedHarga, setUpdatedHarga] = useState(editedTask.harga);
  const [updatedJumlah, setUpdatedJumlah] = useState(editedTask.jumlah);
  const [updatedImg, setUpdatedImg] = useState(editedTask.img);
  const [imgValid, setImgValid] = useState(true);

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
      const validFormats = ["image/jpeg", "image/png", "image/jpg"];
      const maxSize = 1 * 1024 * 1024; // 1 MB

      if (!validFormats.includes(file.type)) {
        alert("Hanya file JPG, JPEG, dan PNG yang diperbolehkan.");
        setUpdatedImg("");
        setImgValid(false);
        return;
      }

      if (file.size > maxSize) {
        alert("Ukuran file tidak boleh lebih dari 1 MB.");
        setUpdatedImg("");
        setImgValid(false);
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        setUpdatedImg(reader.result);
        setImgValid(true);
      };
      reader.readAsDataURL(file);
    } else {
      setUpdatedImg("");
      setImgValid(false);
    }
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (!imgValid) {
      alert("Gambar tidak valid. Silakan upload gambar yang sesuai (JPG/PNG/JPEG kurang dari 1 MB).");
      return;
    }
    updateTask({
      ...editedTask,
      nama: updatedNama,
      harga: updatedHarga,
      jumlah: updatedJumlah,
      img: updatedImg,
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
        data-testid="form"   // <<--- ADD THIS LINE
      >
        <div className="wrapper">
          <input
            type="text"
            id="editNama"
            className="input"
            value={updatedNama}
            onInput={(e) => setUpdatedNama(e.target.value)}
            required
            autoFocus
            maxLength={60}
            placeholder="Update Nama Barang"
          />
          <label htmlFor="editNama" className="label">Update Nama Barang</label>
        </div>
        <div className="wrapper">
          <input
            type="number"
            id="editHarga"
            className="input"
            value={updatedHarga}
            onInput={(e) => setUpdatedHarga(e.target.value)}
            required
            placeholder="Update Harga Barang"
          />
          <label htmlFor="editHarga" className="label">Update Harga Barang</label>
        </div>
        <div className="wrapper">
          <input
            type="number"
            id="editJumlah"
            className="input"
            value={updatedJumlah}
            onInput={(e) => setUpdatedJumlah(e.target.value)}
            required
            placeholder="Update Jumlah Barang"
          />
          <label htmlFor="editJumlah" className="label">Update Jumlah Barang</label>
        </div>
        <div className="wrapper">
          <input
            type="file"
            id="editImg"
            className="input"
            accept="image/*"
            onChange={handleImageUpload}
          />
          <label htmlFor="editImg" className="label">Update Gambar</label>
        </div>
        <button
          className="btn"
          aria-label={`Confirm edited task to now read ${updatedNama}`}
          type="submit"
        >
          <CheckIcon strokeWidth={2} height={24} width={24} />
        </button>
      </form>
    </div>
  );
};

export default EditForm;
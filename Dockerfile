# Gunakan image dasar
FROM node:16

# Set direktori kerja
WORKDIR /app

# Salin file package.json dan install dependensi
COPY package.json ./
RUN npm install

# Salin sisa file aplikasi
COPY . .

# Tentukan port yang digunakan
EXPOSE 8080

# Jalankan aplikasi
CMD ["npm", "start"]

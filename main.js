const detailButtons = document.querySelectorAll(".btnDetail");
const modal = new bootstrap.Modal(document.getElementById("exampleModal"));

detailButtons.forEach(button => {
  button.addEventListener("click", function (e) {
    e.preventDefault();

    const card = this.closest(".card");

    // Ambil data dari elemen
    const title = card.querySelector(".card-text").innerText;
    const deskripsi = card.querySelector(".deskripsi") 
                      ? card.querySelector(".deskripsi").innerHTML 
                      : '<i>tidak ada informasi yang tersedia</i>';
    const harga = card.querySelector(".harga").innerText;

    // Kalau ada atribut data-gambar JSON array (untuk carousel),
    // kalau gak ada fallback ke gambar tunggal
    let gambarData = [];
    if (card.hasAttribute("data-gambar")) {
      try {
        gambarData = JSON.parse(card.getAttribute("data-gambar"));
      } catch {
        // kalau JSON salah, fallback ke gambar tunggal
        const imgSingle = card.querySelector('.card-img-top');
        if (imgSingle) gambarData = [imgSingle.src];
      }
    } else {
      const imgSingle = card.querySelector('.card-img-top');
      if (imgSingle) gambarData = [imgSingle.src];
    }

    // Set konten modal
    document.querySelectorAll(".modalTitle").forEach(el => el.innerText = title);
    document.querySelector(".modalDeskripsi").innerHTML = deskripsi;
    document.querySelector(".modalHarga").innerText = harga;

    // Isi carousel
    const carouselInner = document.querySelector(".modalCarousel");
    carouselInner.innerHTML = ""; // kosongkan dulu

    gambarData.forEach((src, index) => {
      const item = document.createElement("div");
      item.classList.add("carousel-item");
      if (index === 0) item.classList.add("active");

      const img = document.createElement("img");
      img.src = src;
      img.className = "d-block w-100";
      item.appendChild(img);

      carouselInner.appendChild(item);
    });

    // Update link WhatsApp dengan gambar pertama sebagai referensi produk
    const nohp = '6288225280321';
    const firstImage = gambarData.length > 0 ? gambarData[0] : '';
    let pesan = `https://api.whatsapp.com/send?phone=${nohp}&text=Halo Bang, saya mau pesan produk ini ${firstImage}`;
    document.querySelector('.btnBeli').href = pesan;

    // Tampilkan modal
    modal.show();
  });
});

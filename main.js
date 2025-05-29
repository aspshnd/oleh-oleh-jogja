// Toggle mobile menu
        const menuBtn = document.getElementById('menu-btn');
        const mobileMenu = document.getElementById('mobile-menu');

        menuBtn.addEventListener('click', () => {
            mobileMenu.classList.toggle('hidden');
        });

        // Cart functionality
        const cartBtn = document.getElementById('cart-btn');
        const cartModal = document.getElementById('cart-modal');
        const cartCloseBtn = document.getElementById('cart-close-btn');
        const cartItemsContainer = document.getElementById('cart-items');
        const cartCount = document.getElementById('cart-count');
        const checkoutBtn = document.getElementById('checkout-btn');

        // Checkout modal elements
        const checkoutModal = document.getElementById('checkout-modal');
        const checkoutCloseBtn = document.getElementById('checkout-close-btn');
        const checkoutForm = document.getElementById('checkout-form');
        const checkoutTotal = document.getElementById('checkout-total');
        const paymentMethodSelect = document.getElementById('paymentMethod');

        // Thank you modal elements
        const thankyouModal = document.getElementById('thankyou-modal');
        const thankyouCloseBtn = document.getElementById('thankyou-close-btn');
        const thankyouOkBtn = document.getElementById('thankyou-ok-btn');
        const konfirmasiBtn = document.getElementById('konfirmasi-btn');
        const thankyouMessage = document.getElementById('thankyou-message');

        let cart = JSON.parse(localStorage.getItem('cart')) || {};
        let currentWhatsAppURL = ''; // Store WhatsApp URL for later use

        function saveCart() {
            localStorage.setItem('cart', JSON.stringify(cart));
        }

        function updateCartCount() {
            const totalCount = Object.values(cart).reduce((acc, item) => acc + item.quantity, 0);
            if (totalCount > 0) {
                cartCount.style.display = 'flex';
                cartCount.textContent = totalCount;
            } else {
                cartCount.style.display = 'none';
            }
        }

        function formatRupiah(number) {
            return 'Rp' + number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
        }

        function renderCart() {
            cartItemsContainer.innerHTML = '';
            const keys = Object.keys(cart);
            if (keys.length === 0) {
                cartItemsContainer.innerHTML = '<p class="text-gray-600 text-center">Keranjang Anda kosong.</p>';
                checkoutBtn.disabled = true;
                document.getElementById('cart-total').textContent = 'Total: Rp0';
                return;
            }
            checkoutBtn.disabled = false;
            let totalPrice = 0;
            keys.forEach(key => {
                const item = cart[key];
                totalPrice += item.price * item.quantity;

                const itemDiv = document.createElement('div');
                itemDiv.className = 'flex items-center space-x-4 border rounded p-3';

                const img = document.createElement('img');
                img.src = item.image;
                img.alt = item.name + ' oleh-oleh khas Jogja';
                img.className = 'w-20 h-20 object-cover rounded';

                const infoDiv = document.createElement('div');
                infoDiv.className = 'flex-grow';

                const nameP = document.createElement('p');
                nameP.className = 'font-semibold text-yellow-700';
                nameP.textContent = item.name;

                const priceP = document.createElement('p');
                priceP.className = 'text-yellow-600';
                priceP.textContent = formatRupiah(item.price) + ' x ' + item.quantity;

                infoDiv.appendChild(nameP);
                infoDiv.appendChild(priceP);

                const qtyDiv = document.createElement('div');
                qtyDiv.className = 'flex items-center space-x-2';

                const minusBtn = document.createElement('button');
                minusBtn.className = 'bg-yellow-600 hover:bg-yellow-700 text-white rounded px-2 py-1';
                minusBtn.textContent = '-';
                minusBtn.setAttribute('aria-label', 'Kurangi jumlah ' + item.name);
                minusBtn.addEventListener('click', () => {
                    if (item.quantity > 1) {
                        item.quantity--;
                    } else {
                        delete cart[key];
                    }
                    saveCart();
                    renderCart();
                    updateCartCount();
                });

                const qtySpan = document.createElement('span');
                qtySpan.className = 'w-6 text-center';
                qtySpan.textContent = item.quantity;

                const plusBtn = document.createElement('button');
                plusBtn.className = 'bg-yellow-600 hover:bg-yellow-700 text-white rounded px-2 py-1';
                plusBtn.textContent = '+';
                plusBtn.setAttribute('aria-label', 'Tambah jumlah ' + item.name);
                plusBtn.addEventListener('click', () => {
                    item.quantity++;
                    saveCart();
                    renderCart();
                    updateCartCount();
                });

                qtyDiv.appendChild(minusBtn);
                qtyDiv.appendChild(qtySpan);
                qtyDiv.appendChild(plusBtn);

                const removeBtn = document.createElement('button');
                removeBtn.className = 'text-red-600 hover:text-red-800 ml-4';
                removeBtn.setAttribute('aria-label', 'Hapus ' + item.name + ' dari keranjang');
                removeBtn.innerHTML = '<i class="fas fa-trash-alt"></i>';
                removeBtn.addEventListener('click', () => {
                    delete cart[key];
                    saveCart();
                    renderCart();
                    updateCartCount();
                });

                itemDiv.appendChild(img);
                itemDiv.appendChild(infoDiv);
                itemDiv.appendChild(qtyDiv);
                itemDiv.appendChild(removeBtn);

                cartItemsContainer.appendChild(itemDiv);
            });
            document.getElementById('cart-total').textContent = 'Total: ' + formatRupiah(totalPrice);
        }

        function addToCart(product) {
            if (cart[product.id]) {
                cart[product.id].quantity++;
            } else {
                cart[product.id] = {
                    id: product.id,
                    name: product.name,
                    price: product.price,
                    image: product.image,
                    quantity: 1
                };
            }
            saveCart();
            updateCartCount();
        }

        // Add event listeners to all add-to-cart buttons
        document.querySelectorAll('.add-to-cart').forEach(button => {
            button.addEventListener('click', (e) => {
                const productCard = e.target.closest('[data-id]');
                const product = {
                    id: productCard.getAttribute('data-id'),
                    name: productCard.getAttribute('data-name'),
                    price: parseInt(productCard.getAttribute('data-price')),
                    image: productCard.getAttribute('data-image')
                };
                addToCart(product);
                alert(`Produk "${product.name}" berhasil ditambahkan ke keranjang.`);
            });
        });

        // Show cart modal
        cartBtn.addEventListener('click', () => {
            renderCart();
            cartModal.classList.remove('hidden');
            cartModal.classList.add('flex');
            document.body.style.overflow = 'hidden';
        });

        // Close cart modal
        cartCloseBtn.addEventListener('click', () => {
            cartModal.classList.add('hidden');
            cartModal.classList.remove('flex');
            document.body.style.overflow = '';
        });

        // Close modal on outside click (cart)
        cartModal.addEventListener('click', (e) => {
            if (e.target === cartModal) {
                cartModal.classList.add('hidden');
                cartModal.classList.remove('flex');
                document.body.style.overflow = '';
            }
        });

        // Checkout button in cart modal opens checkout modal
        checkoutBtn.addEventListener('click', () => {
            cartModal.classList.add('hidden');
            cartModal.classList.remove('flex');
            openCheckoutModal();
        });

        // Checkout modal close
        checkoutCloseBtn.addEventListener('click', () => {
            closeCheckoutModal();
        });

        // Close modal on outside click (checkout)
        checkoutModal.addEventListener('click', (e) => {
            if (e.target === checkoutModal) {
                closeCheckoutModal();
            }
        });

        // Open checkout modal and fill total
        function openCheckoutModal() {
            updateCheckoutTotal();
            checkoutModal.classList.remove('hidden');
            checkoutModal.classList.add('flex');
            document.body.style.overflow = 'hidden';
        }

        // Close checkout modal
        function closeCheckoutModal() {
            checkoutModal.classList.add('hidden');
            checkoutModal.classList.remove('flex');
            document.body.style.overflow = '';
            clearCheckoutFormErrors();
            checkoutForm.reset();
            paymentMethodSelect.value = '';
        }

        // Update total payment in checkout modal
        function updateCheckoutTotal() {
            let totalPrice = 0;
            Object.values(cart).forEach(item => {
                totalPrice += item.price * item.quantity;
            });
            checkoutTotal.textContent = 'Total Pembayaran: ' + formatRupiah(totalPrice);
        }

        // Clear error messages
        function clearCheckoutFormErrors() {
            ['fullName', 'emailCheckout', 'phone', 'address', 'paymentMethod'].forEach(id => {
                document.getElementById('error-' + id).classList.add('hidden');
            });
        }

        // Validate email format
        function validateEmail(email) {
            const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            return re.test(email.toLowerCase());
        }

        // Validate phone format (simple)
        function validatePhone(phone) {
            const re = /^[0-9+\-\s]{6,15}$/;
            return re.test(phone);
        }

        // Encode text for URL
        function encodeForURL(text) {
            return encodeURIComponent(text);
        }

        // Checkout form submit handler
        checkoutForm.addEventListener('submit', (e) => {
            e.preventDefault();
            clearCheckoutFormErrors();

            const fullName = checkoutForm.fullName.value.trim();
            const email = checkoutForm.emailCheckout.value.trim();
            const phone = checkoutForm.phone.value.trim();
            const address = checkoutForm.address.value.trim();
            const notes = checkoutForm.notes.value.trim();
            const paymentMethod = paymentMethodSelect.value;

            let valid = true;

            if (!fullName) {
                document.getElementById('error-fullName').classList.remove('hidden');
                valid = false;
            }
            if (!email || !validateEmail(email)) {
                document.getElementById('error-emailCheckout').classList.remove('hidden');
                valid = false;
            }
            if (!phone || !validatePhone(phone)) {
                document.getElementById('error-phone').classList.remove('hidden');
                valid = false;
            }
            if (!address) {
                document.getElementById('error-address').classList.remove('hidden');
                valid = false;
            }
            if (!paymentMethod) {
                document.getElementById('error-paymentMethod').classList.remove('hidden');
                valid = false;
            }

            if (!valid) return;

            if (Object.keys(cart).length === 0) {
                alert('Keranjang Anda kosong. Silakan tambahkan produk terlebih dahulu.');
                closeCheckoutModal();
                return;
            }

            // Show loading state on button
            const submitBtn = document.getElementById('submit-checkout');
            submitBtn.disabled = true;
            submitBtn.textContent = 'Memproses...';

            setTimeout(() => {
                // Prepare WhatsApp message for later use

                // Compose order details
                let orderDetails = 'Pesanan Oleh-Oleh Jogja:%0A';
                let totalPrice = 0;
                Object.values(cart).forEach(item => {
                    orderDetails += `- ${item.name} x${item.quantity} = ${formatRupiah(item.price * item.quantity)}%0A`;
                    totalPrice += item.price * item.quantity;
                });
                orderDetails += `Total: ${formatRupiah(totalPrice)}%0A%0A`;

                // Compose customer details
                let customerDetails = `Nama: ${fullName}%0AEmail: ${email}%0ANomor Telepon: ${phone}%0AAlamat: ${address}%0A`;
                if (notes) {
                    customerDetails += `Catatan: ${notes}%0A`;
                }
                customerDetails += `Metode Pembayaran: ${paymentMethod === 'transfer' ? 'Transfer Bank' : paymentMethod === 'cod' ? 'Bayar di Tempat (COD)' : 'E-Wallet (OVO, GoPay, Dana)'}%0A`;

                // Payment instructions
                let paymentText = '';
                if (paymentMethod === 'transfer') {
                    paymentText = 'Silakan lakukan transfer ke rekening BRI 306101007770508 atas nama Alvian Damarjati.';
                } else if (paymentMethod === 'cod') {
                    paymentText = 'Pesanan akan dibayar saat pengiriman (COD). Harap siapkan pembayaran saat barang diterima.';
                } else if (paymentMethod === 'e-wallet') {
                    paymentText = 'Silakan lakukan pembayaran melalui OVO, GoPay, atau Dana ke nomor 088225280321.';
                }

                // Full message
                let fullMessage = orderDetails + customerDetails + '%0A' + paymentText;

                // WhatsApp number (Indonesia country code without +)
                const waNumber = '6288225280321';

                // Store WhatsApp URL for confirmation button
                currentWhatsAppURL = `https://wa.me/${waNumber}?text=${fullMessage}`;

                // Clear cart and update UI
                cart = {};
                saveCart();
                updateCartCount();

                // Reset form and close checkout modal
                checkoutForm.reset();
                paymentMethodSelect.value = '';
                closeCheckoutModal();

                // Show thank you modal with payment method info
                thankyouMessage.textContent = 'Pesanan Anda telah kami terima dan akan segera kami proses. ' + paymentText;
                showThankYouModal();

                // Restore button state
                submitBtn.disabled = false;
                submitBtn.textContent = 'Bayar Sekarang';

                // DO NOT open WhatsApp here anymore - wait for confirmation button
            }, 2000);
        });

        // Show thank you modal
        function showThankYouModal() {
            thankyouModal.classList.remove('hidden');
            thankyouModal.classList.add('flex');
            document.body.style.overflow = 'hidden';
            
            // Setup konfirmasi button after modal is shown
            setupKonfirmasiButton();
        }

        // Close thank you modal
        function closeThankYouModal() {
            thankyouModal.classList.add('hidden');
            thankyouModal.classList.remove('flex');
            document.body.style.overflow = '';
        }

        thankyouCloseBtn.addEventListener('click', () => {
            closeThankYouModal();
        });

        thankyouOkBtn.addEventListener('click', () => {
            closeThankYouModal();
        });

        // Add event listener for confirmation button to open WhatsApp
        function setupKonfirmasiButton() {
            const konfirmasiButton = document.getElementById('konfirmasi-btn');
            if (konfirmasiButton) {
                // Remove any existing listeners to prevent duplicates
                konfirmasiButton.replaceWith(konfirmasiButton.cloneNode(true));
                const newKonfirmasiButton = document.getElementById('konfirmasi-btn');
                
                newKonfirmasiButton.addEventListener('click', () => {
                    console.log('Konfirmasi button clicked!', currentWhatsAppURL); // Debug log
                    if (currentWhatsAppURL) {
                        window.open(currentWhatsAppURL, '_blank');
                        closeThankYouModal();
                    } else {
                        alert('Terjadi kesalahan. Silakan coba lagi.');
                    }
                });
            } else {
                console.error('Button konfirmasi tidak ditemukan!');
            }
        }

        // Call setup function on page load
        setupKonfirmasiButton();

        // Initialize cart count on page load
        updateCartCount();
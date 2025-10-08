// Mock Product Data
const mockProducts = [
    {
        id: 1,
        name: 'Smartphone X Pro',
        category: 'smartphone',
        price: 5999000,
        oldPrice: 6999000,
        image: 'rangga.jpg',
        description: 'Smartphone dengan performa tinggi dan kamera canggih',
        fullDescription: 'Smartphone X Pro hadir dengan layar AMOLED 6.7 inci yang memukau, prosesor terbaru yang powerful, dan sistem kamera triple dengan kemampuan fotografi malam yang luar biasa. Dengan baterai 5000mAh dan fast charging 65W, Anda tidak perlu khawatir kehabisan daya. Desain premium dengan material kaca dan metal membuatnya terasa mewah di tangan.',
        rating: 4.5,
        reviewCount: 24,
        specifications: {
            brand: 'X Tech',
            model: 'X Pro',
            dimensions: '160.8 x 74.5 x 8.1 mm',
            weight: '189 g',
            battery: '5000 mAh',
            os: 'Android 12'
        }
    },
    {
        id: 2,
        name: 'Laptop Ultra Slim',
        category: 'laptop',
        price: 12999000,
        oldPrice: null,
        image: 'rangga.jpg',
        description: 'Laptop tipis dengan performa tinggi untuk produktivitas',
        fullDescription: 'Laptop Ultra Slim dirancang untuk profesional yang membutuhkan perangkat ringan namun powerful. Dengan prosesor Intel Core i7 generasi terbaru, RAM 16GB, dan SSD 512GB, laptop ini mampu menjalankan aplikasi berat dengan mulus. Layar 14 inci dengan resolusi 4K memberikan pengalaman visual yang memukau. Baterai tahan hingga 12 jam membuat Anda bekerja tanpa khawatir kehabisan daya.',
        rating: 4.2,
        reviewCount: 18,
        specifications: {
            brand: 'TechBook',
            model: 'Ultra Slim',
            dimensions: '321.5 x 212.3 x 15.9 mm',
            weight: '1.2 kg',
            battery: '76 Wh',
            os: 'Windows 11'
        }
    },
    {
        id: 3,
        name: 'Tablet Pro',
        category: 'tablet',
        price: 3999000,
        oldPrice: 4499000,
        image: 'rangga.jpg',
        description: 'Tablet serbaguna untuk hiburan dan produktivitas',
        fullDescription: 'Tablet Pro hadir dengan layar 10.5 inci yang besar dan jernih, sempurna untuk menonton film, bermain game, atau bekerja. Dengan prosesor octa-core dan RAM 6GB, tablet ini mampu menjalankan multitasking dengan lancar. Sistem operasi terbaru dengan dukungan stylus membuatnya ideal untuk kreatif. Baterai 7000mAh tahan hingga 15 jam penggunaan normal.',
        rating: 4.0,
        reviewCount: 12,
        specifications: {
            brand: 'TabTech',
            model: 'Pro',
            dimensions: '247.6 x 157.4 x 7.1 mm',
            weight: '485 g',
            battery: '7000 mAh',
            os: 'Android 12'
        }
    },
    {
        id: 4,
        name: 'Wireless Earbuds',
        category: 'aksesoris',
        price: 1299000,
        oldPrice: null,
        image: 'rangga.jpg',
        description: 'Earbuds nirkabel dengan kualitas suara premium',
        fullDescription: 'Wireless Earbuds menghadirkan pengalaman audio yang imersif dengan driver dinamis 11mm yang menghasilkan bass yang dalam dan detail yang jernih. Dengan teknologi peredam kebisingan aktif (ANC), Anda dapat menikmati musik tanpa gangguan. Desain ergonomis membuatnya nyaman digunakan dalam waktu lama. Baterai tahan hingga 8 jam dengan case charging yang dapat mengisi daya hingga 24 jam.',
        rating: 4.7,
        reviewCount: 36,
        specifications: {
            brand: 'AudioTech',
            model: 'Wireless Earbuds',
            dimensions: '21.6 x 20.7 x 24.5 mm (per earbud)',
            weight: '5.4 g (per earbud)',
            battery: '55 mAh (per earbud), 500 mAh (case)',
            os: 'Universal'
        }
    },
    {
        id: 5,
        name: 'Smart TV 4K',
        category: 'tv',
        price: 8999000,
        oldPrice: 10999000,
        image: 'rangga.jpg',
        description: 'TV pintar dengan resolusi 4K dan fitur canggih',
        fullDescription: 'Smart TV 4K menghadirkan pengalaman menonton yang luar biasa dengan layar 55 inci dan resolusi 4K Ultra HD. Dilengkapi dengan teknologi HDR yang meningkatkan kontras dan warna, setiap adegan terlihat nyata. Sistem operasi pintar dengan berbagai aplikasi streaming membuat Anda dapat menikmati konten favorit dengan mudah. Desain tipis dengan bezel minimalis menambah keindahan ruangan Anda.',
        rating: 4.3,
        reviewCount: 21,
        specifications: {
            brand: 'ViewTech',
            model: 'Smart 4K',
            dimensions: '1235.6 x 712.8 x 85.1 mm (with stand)',
            weight: '17.8 kg (with stand)',
            battery: 'N/A',
            os: 'ViewOS 3.0'
        }
    },
    {
        id: 6,
        name: 'Smartphone Y',
        category: 'smartphone',
        price: 3999000,
        oldPrice: null,
        image: 'rangga.jpg',
        description: 'Smartphone terjangkau dengan fitur lengkap',
        fullDescription: 'Smartphone Y menawarkan nilai terbaik dengan harga terjangkau. Layar IPS 6.5 inci dengan resolusi Full HD+ memberikan pengalaman visual yang jernih. Prosesor octa-core dan RAM 4GB memastikan performa yang lancar untuk aktivitas sehari-hari. Kamera ganda dengan AI enhancement memungkinkan Anda mengambil foto yang bagus dalam berbagai kondisi. Baterai 5000mAh dengan fast charging 18W membuatnya siap digunakan sepanjang hari.',
        rating: 4.1,
        reviewCount: 32,
        specifications: {
            brand: 'Y Mobile',
            model: 'Y',
            dimensions: '162.3 x 77.3 x 8.9 mm',
            weight: '198 g',
            battery: '5000 mAh',
            os: 'Android 12'
        }
    },
    {
        id: 7,
        name: 'Gaming Laptop',
        category: 'laptop',
        price: 15999000,
        oldPrice: 17999000,
        image: 'rangga.jpg',
        description: 'Laptop gaming dengan performa maksimal',
        fullDescription: 'Gaming Laptop dirancang khusus untuk gamer yang membutuhkan performa ekstrem. Ditenagai oleh prosesor Intel Core i9 generasi terbaru dan GPU NVIDIA RTX 3060, laptop ini mampu menjalankan game AAA dengan setting tertinggi. Layar 15.6 inci dengan refresh rate 144Hz memberikan pengalaman gaming yang mulus. Sistem pendingin canggih dengan multiple heat pipes menjaga suhu tetap optimal bahkan saat sesi gaming maraton.',
        rating: 4.6,
        reviewCount: 15,
        specifications: {
            brand: 'GameTech',
            model: 'Gaming Pro',
            dimensions: '357 x 268 x 26.9 mm',
            weight: '2.5 kg',
            battery: '90 Wh',
            os: 'Windows 11'
        }
    },
    {
        id: 8,
        name: 'Smartwatch Pro',
        category: 'aksesoris',
        price: 2499000,
        oldPrice: null,
        image: 'rangga.jpg',
        description: 'Jam tangan pintar dengan fitur kesehatan lengkap',
        fullDescription: 'Smartwatch Pro adalah pendamping kesehatan yang sempurna dengan sensor canggih untuk memantau detak jantung, kadar oksigen darah, dan kualitas tidur. Layar AMOLED 1.4 inci yang cerah dan jernih membuatnya mudah dibaca di bawah sinar matahari. Dengan GPS built-in, Anda dapat melacak aktivitas luar ruangan dengan akurat. Baterai tahan hingga 14 hari dengan penggunaan normal dan tahan air hingga 50 meter.',
        rating: 4.4,
        reviewCount: 28,
        specifications: {
            brand: 'TimeTech',
            model: 'Smartwatch Pro',
            dimensions: '46.5 x 46.5 x 10.7 mm',
            weight: '52 g (without strap)',
            battery: '471 mAh',
            os: 'TimeOS 2.0'
        }
    }
];

// Get Featured Products
function getFeaturedProducts() {
    return new Promise((resolve) => {
        // Simulate API delay
        setTimeout(() => {
            // Return first 4 products as featured
            resolve(mockProducts.slice(0, 4));
        }, 500);
    });
}

// Get Products by Category
function getProducts(category = null) {
    return new Promise((resolve) => {
        // Simulate API delay
        setTimeout(() => {
            if (category) {
                // Filter products by category
                const filteredProducts = mockProducts.filter(
                    product => product.category === category
                );
                resolve(filteredProducts);
            } else {
                // Return all products
                resolve(mockProducts);
            }
        }, 500);
    });
}

// Get Product by ID
function getProductById(id) {
    return new Promise((resolve, reject) => {
        // Simulate API delay
        setTimeout(() => {
            const product = mockProducts.find(p => p.id === parseInt(id));
            
            if (product) {
                resolve(product);
            } else {
                reject(new Error('Product not found'));
            }
        }, 500);
    });
}

// Search Products
function searchProducts(query) {
    return new Promise((resolve) => {
        // Simulate API delay
        setTimeout(() => {
            const searchResults = mockProducts.filter(
                product => 
                    product.name.toLowerCase().includes(query.toLowerCase()) ||
                    product.category.toLowerCase().includes(query.toLowerCase()) ||
                    product.description.toLowerCase().includes(query.toLowerCase())
            );
            resolve(searchResults);
        }, 500);
    });
}
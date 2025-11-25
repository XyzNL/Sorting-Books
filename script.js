// Kelas Hash Table untuk implementasi algoritma HashSearch
class HashTable {
  constructor(size = 100) {
    this.size = size;
    this.table = new Array(size);
    this.count = 0;
  }

  // Fungsi hash untuk mengkonversi key menjadi index
  hash(key) {
    let hash = 0;
    for (let i = 0; i < key.length; i++) {
      hash = (hash + key.charCodeAt(i) * (i + 1)) % this.size;
    }
    return hash;
  }

  // Memasukkan buku ke dalam hash table
  insert(book) {
    // Buat index untuk title, author, dan ISBN agar bisa dicari dari ketiganya
    const keys = [
      book.title.toLowerCase(),
      book.author.toLowerCase(),
      book.isbn.toLowerCase(),
    ];

    keys.forEach((key) => {
      const index = this.hash(key);
      if (!this.table[index]) {
        this.table[index] = [];
      }
      this.table[index].push(book);
    });

    this.count++;
  }

  // Fungsi pencarian menggunakan hash
  search(query) {
    query = query.toLowerCase().trim();
    const index = this.hash(query);

    if (!this.table[index]) {
      return [];
    }

    // Filter hasil yang mengandung query
    return this.table[index].filter(
      (book) =>
        book.title.toLowerCase().includes(query) ||
        book.author.toLowerCase().includes(query) ||
        book.isbn.toLowerCase().includes(query)
    );
  }

  // Mengambil semua buku dari hash table
  getAllBooks() {
    const books = [];
    const seen = new Set();

    for (let i = 0; i < this.table.length; i++) {
      if (this.table[i]) {
        this.table[i].forEach((book) => {
          // Hindari duplikasi karena buku disimpan di multiple index
          if (!seen.has(book.isbn)) {
            books.push(book);
            seen.add(book.isbn);
          }
        });
      }
    }

    return books;
  }
}

// Inisialisasi hash table
const hashTable = new HashTable(100);
let searchCount = 0;

// Data buku awal
const initialBooks = [
  {
    title: "Laskar Pelangi",
    author: "Andrea Hirata",
    isbn: "978-979-22-2928-4",
    year: 2005,
  },
  {
    title: "Bumi Manusia",
    author: "Pramoedya Ananta Toer",
    isbn: "978-602-06-0000-1",
    year: 1980,
  },
  {
    title: "Ronggeng Dukuh Paruk",
    author: "Ahmad Tohari",
    isbn: "978-979-433-196-2",
    year: 1982,
  },
  {
    title: "Negeri 5 Menara",
    author: "Ahmad Fuadi",
    isbn: "978-602-8811-04-4",
    year: 2009,
  },
  {
    title: "Perahu Kertas",
    author: "Dee Lestari",
    isbn: "978-979-22-6142-0",
    year: 2009,
  },
  {
    title: "Pulang",
    author: "Tere Liye",
    isbn: "978-602-03-1234-5",
    year: 2015,
  },
  {
    title: "Laut Bercerita",
    author: "Leila S. Chudori",
    isbn: "978-602-424-694-5",
    year: 2017,
  },
  {
    title: "Gadis Kretek",
    author: "Ratih Kumala",
    isbn: "978-602-424-825-3",
    year: 2012,
  },
  {
    title: "Sepotong Hati yang Baru",
    author: "Tere Liye",
    isbn: "978-602-03-4567-8",
    year: 2020,
  },
  {
    title: "Kata",
    author: "Rintik Sedu",
    isbn: "978-623-744-701-2",
    year: 2019,
  },
];

// Masukkan data awal ke hash table
initialBooks.forEach((book) => hashTable.insert(book));
updateStats();
displayBooks(hashTable.getAllBooks());

// Implementasi Quick Sort (Tanpa Library .sort())
function quickSort(arr, sortBy = 'title') {
    if (arr.length <= 1) {
        return arr;
    }

    const pivot = arr[arr.length - 1];
    const left = [];
    const right = [];

    for (let i = 0; i < arr.length - 1; i++) {
        // Bandingkan berdasarkan properti yang dipilih (title/year)
        let valA = arr[i][sortBy];
        let valB = pivot[sortBy];

        // Jika string, ubah ke lowercase agar tidak case-sensitive
        if (typeof valA === 'string') {
            valA = valA.toLowerCase();
            valB = valB.toLowerCase();
        }

        if (valA < valB) {
            left.push(arr[i]);
        } else {
            right.push(arr[i]);
        }
    }

    // Rekursif: gabungkan left + pivot + right
    return [...quickSort(left, sortBy), pivot, ...quickSort(right, sortBy)];
}

// Fungsi untuk dipanggil dari Tombol di HTML
function sortBooks(criteria) {
    // Ambil semua buku
    let currentBooks = hashTable.getAllBooks();
    
    // Lakukan sorting manual
    const sortedBooks = quickSort(currentBooks, criteria);
    
    // Tampilkan hasil
    displayBooks(sortedBooks);
    showAlert(`Buku diurutkan berdasarkan ${criteria}`, "info");
}

// Fungsi menambah buku baru
function addBook() {
  const title = document.getElementById("title").value.trim();
  const author = document.getElementById("author").value.trim();
  const isbn = document.getElementById("isbn").value.trim();
  const year = document.getElementById("year").value.trim();

  if (!title || !author || !isbn || !year) {
    showAlert("Mohon lengkapi semua field!", "error");
    return;
  }

  const book = { title, author, isbn, year: parseInt(year) };
  hashTable.insert(book);

  // Reset form
  document.getElementById("title").value = "";
  document.getElementById("author").value = "";
  document.getElementById("isbn").value = "";
  document.getElementById("year").value = "";

  showAlert("Buku berhasil ditambahkan!", "success");
  updateStats();
  displayBooks(hashTable.getAllBooks());
}

// Fungsi pencarian buku menggunakan HashSearch
function searchBook() {
  const query = document.getElementById("searchInput").value.trim();

  if (!query) {
    showAlert("Masukkan kata kunci pencarian!", "error");
    return;
  }

  searchCount++;
  updateStats();

  const results = hashTable.search(query);

  if (results.length === 0) {
    showAlert(`Tidak ditemukan buku dengan kata kunci "${query}"`, "info");
    displayBooks([]);
  } else {
    showAlert(`Ditemukan ${results.length} buku`, "success");
    displayBooks(results);
  }
}

// Fungsi menampilkan semua buku
function showAllBooks() {
  document.getElementById("searchInput").value = "";
  displayBooks(hashTable.getAllBooks());
  showAlert("Menampilkan semua buku", "info");
}

// Fungsi menampilkan buku ke UI
function displayBooks(books) {
  const bookList = document.getElementById("bookList");

  if (books.length === 0) {
    bookList.innerHTML =
      '<div class="no-results">Tidak ada buku untuk ditampilkan</div>';
    return;
  }

  bookList.innerHTML = books
    .map(
      (book) => `
        <div class="book-item">
            <h3>${book.title}</h3>
            <p><span class="label">Penulis:</span> ${book.author}</p>
            <p><span class="label">ISBN:</span> ${book.isbn}</p>
            <p><span class="label">Tahun:</span> ${book.year}</p>
        </div>
    `
    )
    .join("");
}

// Update statistik
function updateStats() {
  document.getElementById("totalBooks").textContent = hashTable.count;
  document.getElementById("searchCount").textContent = searchCount;
}

// Menampilkan alert
function showAlert(message, type) {
  const alertBox = document.getElementById("alertBox");
  alertBox.innerHTML = `<div class="alert alert-${type}">${message}</div>`;

  setTimeout(() => {
    alertBox.innerHTML = "";
  }, 3000);
}
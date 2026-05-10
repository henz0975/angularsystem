import Chart from 'chart.js/auto';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { BookService } from '../../services/book.service';
import { BorrowService } from '../../services/borrow.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,

  imports: [
    FormsModule,
    CommonModule
  ],

  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css'
})

export class Dashboard implements OnInit {

  showBorrowModal = false;

borrowSearch = '';

totalFines = 0;

overdueCount = 0;

messages = [
  {
    text: 'Hello! Welcome to USTP Library.',
    time: '10:30 AM',
    mine: false
  }
];

newMessage = '';

  borrowedBooks: any[] = [];

totalUsers = 0;
chart: any;
showLoader = true;
currentUser: any = null;
showProfileModal = false;
selectedUser: any = null;

defaultMaleAvatar =
'https://cdn-icons-png.flaticon.com/512/3135/3135715.png';

defaultFemaleAvatar =
'https://cdn-icons-png.flaticon.com/512/6997/6997662.png';
isAdmin = false;
borrowerName = '';
borrowerId = '';

selectedBook = '';

  get filteredBooks() {
    
  return this.books.filter(book => {

    const matchSearch =

      book.title.toLowerCase().includes(
        this.searchText.toLowerCase()
      ) ||

      book.author.toLowerCase().includes(
        this.searchText.toLowerCase()
      );

    const matchCategory =

      this.selectedCategory === 'All' ||

      book.category === this.selectedCategory;

    return matchSearch && matchCategory;

  });

}
get filteredBorrowedBooks() {

  return this.borrowedBooks.filter(b =>

    b.borrower.toLowerCase().includes(
      this.borrowSearch.toLowerCase()
    ) ||

    b.book.toLowerCase().includes(
      this.borrowSearch.toLowerCase()
    )

  );

}
sidebarOpen = false;

toggleMenu() {
  this.sidebarOpen = !this.sidebarOpen;
}

activePage = 'home';
showModal = false;
changePage(page: string) {
  this.activePage = page;
}
  searchText = '';

  bookTitle = '';
  bookAuthor = '';
  bookImage = '';

  books: any[] = [];

  showAddBookModal = false;

showBookModal = false;

selectedBookData: any = null;

selectedCategory = 'All';

favorites: string[] = [];

bookDescription = '';

bookCategory = 'Programming';

previewImage = '';

  constructor(
  private bookService: BookService,
  private borrowService: BorrowService
) {}

  ngOnInit(): void {

  this.currentUser = JSON.parse(
    localStorage.getItem('currentUser') || 'null'
  );

  if (
  this.currentUser &&
  !this.currentUser.profileImage
) {

  this.currentUser.profileImage =
    this.currentUser.sex === 'female'
      ? this.defaultFemaleAvatar
      : this.defaultMaleAvatar;

}

  this.isAdmin =
    this.currentUser?.role === 'admin';
    
  const users = JSON.parse(
  localStorage.getItem('users') || '[]'
);

this.totalUsers = users.length;
  
  this.selectedUser = this.currentUser;

  const savedBooks =
    localStorage.getItem('books');

  if (savedBooks) {

    this.books =
      JSON.parse(savedBooks);

  } else {

    if (this.bookService.getBooks().length === 0) {

      this.bookService.saveBooks([
        {
          title: 'Harry Potter',
          author: 'J.K. Rowling',
          available: true
        },
        {
          title: 'The Hobbit',
          author: 'J.R.R. Tolkien',
          available: true
        }
      ]);

    }

    this.loadBooks();

  }

    this.loadBorrowedBooks();

this.overdueCount =
  this.borrowedBooks.filter(
    b => this.isOverdue(b.dueDate)
  ).length;

this.totalFines =
  this.borrowedBooks.reduce(

    (total, b) =>

      total +
      this.calculateFine(b.dueDate),

    0

  );

  this.createChart();

  setTimeout(() => {

  this.createBorrowChart();

}, 500);

  this.favorites = JSON.parse(
  localStorage.getItem('favorites') || '[]'
);

}

  loadBooks() {
    this.books = this.bookService.getBooks();
  }

  loadBorrowedBooks() {

  this.borrowedBooks =
    this.borrowService.getBorrowedBooks();

}

borrowBook() {

  if (
    !this.borrowerName ||
    !this.borrowerId ||
    !this.selectedBook
  ) {
    alert('Complete fields');
    return;
  }

  const selected = this.books.find(
    b => b.title === this.selectedBook
  );

  if (!selected.available) {
    alert('Book already borrowed');
    return;
  }

  this.borrowService.borrowBook({

    borrower: this.borrowerName,
    studentId: this.borrowerId,
    book: this.selectedBook,
    dateBorrowed: new Date(),

dueDate: new Date(
  new Date().setDate(
    new Date().getDate() + 7
  )
)

  });

  selected.available = false;

  this.bookService.saveBooks(this.books);

  this.loadBooks();

  this.loadBorrowedBooks();

  this.borrowerName = '';
  this.borrowerId = '';
  this.selectedBook = '';

}

returnBook(index: number) {

  const borrowed =
    this.borrowedBooks[index];

  const book = this.books.find(
    b => b.title === borrowed.book
  );

  if (book) {
    book.available = true;
  }

  this.bookService.saveBooks(this.books);

  this.borrowService.returnBook(index);

  this.loadBorrowedBooks();

  this.loadBooks();

}

isOverdue(dueDate: string): boolean {

  return new Date(dueDate) < new Date();

}
calculateFine(dueDate: string): number {

  const due = new Date(dueDate);

  const today = new Date();

  const diffTime =
    today.getTime() - due.getTime();

  const diffDays = Math.floor(
    diffTime / (1000 * 60 * 60 * 24)
  );

  return diffDays > 0
    ? diffDays * 10
    : 0;

}

createChart() {

  const totalBooks =
    this.books.length;

  const borrowedBooks =
    this.books.filter(
      b => !b.available
    ).length;

  const availableBooks =
    this.books.filter(
      b => b.available
    ).length;

  this.chart = new Chart('libraryChart', {

    type: 'bar',

    data: {

      labels: [
        'Total',
        'Borrowed',
        'Available'
      ],

      datasets: [{

        label: 'Library Statistics',

        data: [
          totalBooks,
          borrowedBooks,
          availableBooks
        ]

      }]

    }

  });

}
createBorrowChart() {

  new Chart('borrowChart', {

    type: 'line',

    data: {

      labels: [
        'Mon',
        'Tue',
        'Wed',
        'Thu',
        'Fri',
        'Sat',
        'Sun'
      ],

      datasets: [{

        label: 'Borrow Activity',

        data: [
          4,
          7,
          5,
          10,
          8,
          6,
          12
        ],

        tension: .4

      }]

    }

  });

}
  addBook() {

    if (!this.bookTitle || !this.bookAuthor) {
      alert('Complete fields');
      return;
    }

    this.bookService.addBook({

  title: this.bookTitle,

  author: this.bookAuthor,

  image:
    this.previewImage ||

    this.bookImage ||

'https://via.placeholder.com/150',

  available: true,

  category: this.bookCategory,

  description:
    this.bookDescription ||

    'No description available.'

});

    this.bookTitle = '';
    this.bookAuthor = '';
    this.bookImage = '';
    this.bookDescription = '';

this.bookCategory = 'Programming';

this.previewImage = '';

this.showAddBookModal = false;

    

    this.loadBooks();
  }

  deleteBook(index: number) {

    this.bookService.deleteBook(index);

    this.loadBooks();

    localStorage.setItem(
  'books',
  JSON.stringify(this.books)
);

    localStorage.setItem(
  'books',
  JSON.stringify(this.books)
);
    if (this.chart) {
  this.chart.destroy();
}

this.createChart();

  }

  logout() {

    localStorage.removeItem('currentUser');

    window.location.href = '/login';
  }
toggleTheme() {
  document.body.classList.toggle('dark');
}

setAccent(color: string) {
  document.documentElement.style.setProperty(
    '--accent',
    color
  );
}

setLanguage(lang: string) {
  console.log('Language:', lang);
}

resetDemo() {
  localStorage.clear();
  location.reload();
}

exportAllData() {
  const data = {
    books: this.books,
    borrowed: this.borrowedBooks
  };

  const blob = new Blob(
    [JSON.stringify(data, null, 2)],
    { type: 'application/json' }
  );

  const url = window.URL.createObjectURL(blob);

  const a = document.createElement('a');

  a.href = url;
  a.download = 'library-data.json';

  a.click();

  window.URL.revokeObjectURL(url);
}

closeModal() {

  const modal =
    document.getElementById('modal');

  if (modal) {
    modal.style.display = 'none';
  }

}

onProfileImageSelected(event: any) {

  const file = event.target.files[0];

  if (!file) return;

  const reader = new FileReader();

  reader.onload = () => {

    this.currentUser.profileImage =
      reader.result as string;

    localStorage.setItem(
      'currentUser',
      JSON.stringify(this.currentUser)
    );

    const users = JSON.parse(
      localStorage.getItem('users') || '[]'
    );

    const index = users.findIndex(
      (u: any) =>
        u.username === this.currentUser.username
    );

    if (index !== -1) {

      users[index] = this.currentUser;

      localStorage.setItem(
        'users',
        JSON.stringify(users)
      );

    }

  };

  reader.readAsDataURL(file);

}
openProfile() {

  this.selectedUser = this.currentUser;

  this.showProfileModal = true;

}

closeProfileModal() {

  this.showProfileModal = false;

}

defaultAvatar(gender: string) {

  if (gender === 'Female') {

    return 'https://cdn-icons-png.flaticon.com/512/6997/6997662.png';

  }

  return 'https://cdn-icons-png.flaticon.com/512/3135/3135715.png';

}

saveProfile() {

  const users = JSON.parse(
    localStorage.getItem('users') || '[]'
  );

  const index = users.findIndex(
    (u: any) =>
      u.username === this.currentUser.username
  );

  if (index !== -1) {

    users[index] = this.selectedUser;

    localStorage.setItem(
      'users',
      JSON.stringify(users)
    );

    localStorage.setItem(
      'currentUser',
      JSON.stringify(this.selectedUser)
    );

    this.currentUser = this.selectedUser;

    alert('Profile Updated');

  }
setTimeout(() => {

  this.showLoader = false;

}, 2500);

setTimeout(() => {

  const loader =
    document.getElementById('loading-screen');

  if (loader) {

    loader.classList.add('hide-loader');

    setTimeout(() => {
      loader.remove();
    }, 600);

  }

}, 1500);

}
sendMessage(){

  if(this.newMessage.trim()){

    this.messages.push({
      text: this.newMessage,
      time: new Date().toLocaleTimeString(),
      mine: true
    });

    this.newMessage = '';
  }

}
onBookImageSelected(event: any) {

  const file = event.target.files[0];

  if (!file) return;

  const reader = new FileReader();

  reader.onload = () => {

    this.previewImage =
      reader.result as string;

  };

  reader.readAsDataURL(file);

}
toggleFavorite(book: any) {

  const index =
    this.favorites.indexOf(book.title);

  if (index === -1) {

    this.favorites.push(book.title);

  } else {

    this.favorites.splice(index, 1);

  }

  localStorage.setItem(
    'favorites',
    JSON.stringify(this.favorites)
  );

}
openBookModal(book: any) {

  this.selectedBookData = book;

  this.showBookModal = true;

}

closeBookModal() {

  this.showBookModal = false;

}
}
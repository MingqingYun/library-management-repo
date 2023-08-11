package com.library.backend.service;

import com.library.backend.Entity.Book;
import com.library.backend.Entity.Checkout;
import com.library.backend.Entity.History;
import com.library.backend.dao.BookRepository;
import com.library.backend.dao.CheckoutRepository;
import javax.transaction.Transactional;

import com.library.backend.dao.HistoryRepository;
import com.library.backend.requestmodels.AddNewBookRequest;
import com.library.backend.responseModel.ShelfCurrentLoanResponse;
import org.hibernate.annotations.Check;
import org.springframework.stereotype.Service;

import java.text.SimpleDateFormat;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Optional;
import java.util.concurrent.TimeUnit;

@Service
@Transactional
public class BookService {

    private BookRepository bookRepository;
    private CheckoutRepository checkoutRepository;
    private HistoryRepository historyRepository;

    public BookService(BookRepository bookRepository, CheckoutRepository checkoutRepository,
            HistoryRepository historyRepository){
        this.bookRepository = bookRepository;
        this.checkoutRepository = checkoutRepository;
        this.historyRepository = historyRepository;
    }

    public Book checkoutBook(String userEmail, Long bookId) throws Exception{
        Optional<Book> book = bookRepository.findById(bookId);
        Checkout validateCheckout = checkoutRepository.findByUserEmailAndBookId(userEmail, bookId);

        if (!book.isPresent() || validateCheckout != null || book.get().getCopiesAvailable() <= 0){
            throw new Exception("Book doesn't exist or already checked out");
        }

        book.get().setCopiesAvailable(book.get().getCopiesAvailable() - 1);
        bookRepository.save(book.get());

        Checkout checkout = new Checkout(
                userEmail,
                LocalDate.now().toString(),
                LocalDate.now().plusDays(7).toString(),
                book.get().getId()
        );
        checkoutRepository.save(checkout);

        History history = new History(
                userEmail,
                checkout.getId(),
                checkout.getCheckoutDate(),
                null,
                book.get().getTitle(),
                book.get().getAuthor(),
                book.get().getDescription(),
                book.get().getImg()
        );
        historyRepository.save(history);
        return book.get();
    }

    public Boolean checkoutBookByUser(String userEmail, Long bookId){
        Checkout validateCheckout = checkoutRepository.findByUserEmailAndBookId(userEmail, bookId);
        if (validateCheckout!= null){
            return true;
        } else{
            return false;
        }
    }

    public int currentLoansCount(String userEmail){
        return checkoutRepository.findByUserEmail(userEmail).size();
    }

    public List<ShelfCurrentLoanResponse> currentLoan(String userEmail) throws Exception{
        List<ShelfCurrentLoanResponse> shelfCurrentLoanResponseList = new ArrayList<>();
        List<Checkout> checkoutList = checkoutRepository.findByUserEmail(userEmail);

        List<Long> bookIdList = new ArrayList<>();

        for (Checkout checkout: checkoutList){
            bookIdList.add(checkout.getBookId());
        }

        List<Book> books = bookRepository.findBooksByBookIds(bookIdList);
        SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");
        for (Book book: books){
            Optional<Checkout> checkout = checkoutList.stream().filter(x->x.getBookId() == book.getId()).findFirst();
            if (checkout.isPresent()){
                Date d1 = sdf.parse(checkout.get().getReturnDate());
                Date d2 = sdf.parse(LocalDate.now().toString());

                TimeUnit time = TimeUnit.DAYS;

                long differenceInTime = time.convert(d1.getTime()- d2.getTime(), TimeUnit.MILLISECONDS);

                shelfCurrentLoanResponseList.add(new ShelfCurrentLoanResponse(book, (int)differenceInTime));
            }
        }
        return shelfCurrentLoanResponseList;
    }

    public void returnBook(String userEmail, Long bookId) throws Exception{
        Optional<Book> book = bookRepository.findById(bookId);

        Checkout validatedCheckout = checkoutRepository.findByUserEmailAndBookId(userEmail, bookId);

        if (!book.isPresent() || validatedCheckout == null){
            throw new Exception("Book does not exist or not been checked out by user");
        }

        book.get().setCopiesAvailable(book.get().getCopiesAvailable()+1);
        bookRepository.save(book.get());

        History history = historyRepository.findByUserEmailAndCheckoutId(userEmail, validatedCheckout.getId());
        history.setReturnDate(LocalDate.now().toString());
        historyRepository.save(history);

        checkoutRepository.deleteById(validatedCheckout.getId());
    }

    public void renewBook(String userEmail, Long bookId) throws Exception{
        Optional<Book> book = bookRepository.findById(bookId);
        Checkout validatedCheckout = checkoutRepository.findByUserEmailAndBookId(userEmail, bookId);

        if (validatedCheckout == null){
            throw new Exception("Book does not exist or not been checked out by user");
        }

        SimpleDateFormat sdFormat = new SimpleDateFormat("yyyy-MM-dd");

        Date d1 = sdFormat.parse(validatedCheckout.getReturnDate());
        Date d2 = sdFormat.parse(LocalDate.now().toString());

        if (d1.compareTo(d2) > 0 || d1.compareTo(d2) == 0){
            validatedCheckout.setReturnDate(LocalDate.now().plusDays(7).toString());
            checkoutRepository.save(validatedCheckout);
        }

    }


}

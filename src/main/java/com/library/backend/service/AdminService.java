package com.library.backend.service;

import com.library.backend.Entity.Book;
import com.library.backend.dao.BookRepository;
import com.library.backend.dao.CheckoutRepository;
import com.library.backend.dao.ReviewRepository;
import com.library.backend.requestmodels.AddNewBookRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.stereotype.Service;

import javax.transaction.Transactional;
import java.util.Optional;

@Service
@Transactional
public class AdminService {
    private BookRepository bookRepository;
    private ReviewRepository reviewRepository;
    private CheckoutRepository checkoutRepository;

    @Autowired
    public AdminService(BookRepository bookRepository, ReviewRepository reviewRepository, CheckoutRepository checkoutRepository){
        this.bookRepository = bookRepository;
        this.reviewRepository = reviewRepository;
        this.checkoutRepository = checkoutRepository;

    }
    @CacheEvict(cacheNames="books", allEntries=true)
    public void postBook(AddNewBookRequest addNewBookRequest){
        Book book = new Book();
        book.setTitle(addNewBookRequest.getTitle());
        book.setAuthor(addNewBookRequest.getAuthor());
        book.setCopies(addNewBookRequest.getCopies());
        book.setCopiesAvailable(addNewBookRequest.getCopies());
        book.setCategory(addNewBookRequest.getCategory());
        book.setDescription(addNewBookRequest.getDescription());
        book.setImg(addNewBookRequest.getImg());

        bookRepository.save(book);
    }

    public void increaseQuantity(Long id) throws Exception{
        Optional<Book> book = bookRepository.findById(id);

        if (!book.isPresent()){
            throw new Exception("Book doesn't exist");
        }

        book.get().setCopies(book.get().getCopies() + 1);
        book.get().setCopiesAvailable(book.get().getCopiesAvailable() + 1);
        bookRepository.save(book.get());
    }

    public void decreaseQuantity(Long id) throws Exception{
        Optional<Book> book = bookRepository.findById(id);

        if (!book.isPresent() || book.get().getCopies() <=0 || book.get().getCopiesAvailable() <= 0){
            throw new Exception("Book doesn't exist");
        }

        book.get().setCopies(book.get().getCopies() - 1);
        book.get().setCopiesAvailable(book.get().getCopiesAvailable() - 1);
        bookRepository.save(book.get());
    }

    @CacheEvict(cacheNames="books", allEntries=true)
    public void deleteBook(Long id) throws Exception{
        Optional<Book> book = bookRepository.findById(id);
        if (!book.isPresent()){
            throw new Exception("Book doesn't exist");
        }

        bookRepository.delete(book.get());
        reviewRepository.deleteAllByBookId(id);
        checkoutRepository.deleteAllByBookId(id);
    }
}

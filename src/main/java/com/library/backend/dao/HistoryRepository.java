package com.library.backend.dao;

import com.library.backend.Entity.History;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestParam;

public interface HistoryRepository extends JpaRepository<History, Long> {

    Page<History> findBooksByUserEmail(@RequestHeader("email") String userEmail, Pageable pageable);

    History findByUserEmailAndCheckoutId(String userEmail, Long checkoutId);

}

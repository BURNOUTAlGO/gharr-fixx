package com.gharfix.backend.repository;

import com.gharfix.backend.entity.Booking;
import com.gharfix.backend.enums.BookingStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface BookingRepository extends JpaRepository<Booking, Long> {
    List<Booking> findByUserId(Long userId);
    List<Booking> findByVendorId(Long vendorId);
    List<Booking> findByUserIdAndStatus(Long userId, BookingStatus status);
    List<Booking> findByVendorIdAndStatus(Long vendorId, BookingStatus status);
}

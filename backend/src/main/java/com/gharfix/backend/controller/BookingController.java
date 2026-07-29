package com.gharfix.backend.controller;

import com.gharfix.backend.dto.BookingRequest;
import com.gharfix.backend.entity.Booking;
import com.gharfix.backend.enums.BargainStatus;
import com.gharfix.backend.enums.BookingStatus;
import com.gharfix.backend.service.BookingService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;

@RestController
@RequestMapping("/api/bookings")
@RequiredArgsConstructor
public class BookingController {

    private final BookingService bookingService;

    @PostMapping
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<Booking> createBooking(@RequestBody BookingRequest request) {
        return ResponseEntity.ok(bookingService.createBooking(request));
    }

    @GetMapping("/user")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<List<Booking>> getUserBookings() {
        return ResponseEntity.ok(bookingService.getUserBookings());
    }

    @GetMapping("/vendor")
    @PreAuthorize("hasRole('VENDOR')")
    public ResponseEntity<List<Booking>> getVendorBookings() {
        return ResponseEntity.ok(bookingService.getVendorBookings());
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<Booking> updateStatus(@PathVariable Long id, @RequestParam BookingStatus status) {
        return ResponseEntity.ok(bookingService.updateBookingStatus(id, status));
    }

    @PostMapping("/{id}/bargain")
    public ResponseEntity<Booking> respondToBargain(
            @PathVariable Long id,
            @RequestParam BargainStatus status,
            @RequestParam(required = false) BigDecimal counterPrice) {
        return ResponseEntity.ok(bookingService.respondToBargain(id, status, counterPrice));
    }

    @PutMapping("/{id}/review")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<Booking> submitReview(
            @PathVariable Long id,
            @RequestParam Integer rating,
            @RequestParam String review) {
        return ResponseEntity.ok(bookingService.submitReview(id, rating, review));
    }
}

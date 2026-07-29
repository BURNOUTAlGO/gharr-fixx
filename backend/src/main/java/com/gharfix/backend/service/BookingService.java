package com.gharfix.backend.service;

import com.gharfix.backend.dto.BookingRequest;
import com.gharfix.backend.entity.Booking;
import com.gharfix.backend.entity.GharService;
import com.gharfix.backend.entity.User;
import com.gharfix.backend.enums.BargainStatus;
import com.gharfix.backend.enums.BookingStatus;
import com.gharfix.backend.repository.BookingRepository;
import com.gharfix.backend.repository.ServiceRepository;
import com.gharfix.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;

@Service
@RequiredArgsConstructor
public class BookingService {

    private final BookingRepository bookingRepository;
    private final ServiceRepository serviceRepository;
    private final UserRepository userRepository;
    private final NotificationService notificationService;

    public Booking createBooking(BookingRequest request) {
        System.out.println("Creating booking for service: " + request.getServiceId());
        
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found: " + email));

        GharService service = serviceRepository.findById(request.getServiceId())
                .orElseThrow(() -> new RuntimeException("Service not found: " + request.getServiceId()));

        User vendor = service.getVendor();
        if (vendor == null) {
            System.err.println("CRITICAL: Vendor not found for service: " + service.getName());
            throw new RuntimeException("This service currently has no assigned professional.");
        }

        System.out.println("Booking details - User: " + user.getName() + ", Vendor: " + vendor.getName() + ", Price: " + request.getBargainPrice());

        Booking booking = Booking.builder()
                .user(user)
                .vendor(vendor)
                .service(service)
                .originalPrice(service.getBasePrice())
                .bargainPrice(request.getBargainPrice())
                .bargainStatus(BargainStatus.PENDING)
                .status(BookingStatus.REQUESTED)
                .address(request.getAddress())
                .notes(request.getNotes())
                .build();

        Booking savedBooking = bookingRepository.save(booking);
        System.out.println("Booking saved successfully with ID: " + savedBooking.getId());

        notificationService.sendNotification(
                vendor,
                "New Booking Request",
                "You have a new booking request for " + service.getName(),
                "BOOKING_CREATED",
                savedBooking.getId()
        );

        return savedBooking;
    }

    public List<Booking> getUserBookings() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return bookingRepository.findByUserId(user.getId());
    }

    public List<Booking> getVendorBookings() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        User vendor = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Vendor not found: " + email));
        
        List<Booking> bookings = bookingRepository.findByVendorId(vendor.getId());
        System.out.println("Fetched " + bookings.size() + " bookings for vendor: " + vendor.getName() + " (ID: " + vendor.getId() + ")");
        return bookings;
    }

    public Booking updateBookingStatus(Long id, BookingStatus status) {
        Booking booking = bookingRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Booking not found"));
        
        booking.setStatus(status);
        Booking savedBooking = bookingRepository.save(booking);

        notificationService.sendNotification(
                booking.getUser(),
                "Booking Update",
                "Your booking for " + booking.getService().getName() + " is now " + status,
                "STATUS_UPDATED",
                savedBooking.getId()
        );

        return savedBooking;
    }

    public Booking respondToBargain(Long id, BargainStatus bargainStatus, BigDecimal counterPrice) {
        Booking booking = bookingRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Booking not found"));
        
        String currentUserEmail = SecurityContextHolder.getContext().getAuthentication().getName();
        boolean isVendor = currentUserEmail.equals(booking.getVendor().getEmail());

        booking.setBargainStatus(bargainStatus);
        if (bargainStatus == BargainStatus.COUNTER) {
            booking.setCounterPrice(counterPrice);
        } else if (bargainStatus == BargainStatus.ACCEPTED) {
            booking.setStatus(BookingStatus.ACCEPTED);
            // If it was a counter offer, set the bargainPrice to the counterPrice
            if (booking.getCounterPrice() != null) {
                booking.setBargainPrice(booking.getCounterPrice());
            }
        }
        
        Booking savedBooking = bookingRepository.save(booking);

        // Notify the OTHER party
        User recipient = isVendor ? booking.getUser() : booking.getVendor();
        String party = isVendor ? "Vendor" : "Customer";
        
        notificationService.sendNotification(
                recipient,
                "Bargain Update",
                party + " has " + bargainStatus + " the bargain for " + booking.getService().getName(),
                "BARGAIN_UPDATED",
                savedBooking.getId()
        );

        return savedBooking;
    }
    public Booking submitReview(Long bookingId, Integer rating, String review) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new RuntimeException("Booking not found"));
        
        String currentUserEmail = SecurityContextHolder.getContext().getAuthentication().getName();
        if (!booking.getUser().getEmail().equals(currentUserEmail)) {
            throw new RuntimeException("Only the customer can submit a review");
        }

        if (booking.getStatus() != BookingStatus.COMPLETED) {
            throw new RuntimeException("Cannot review a booking that is not completed");
        }

        booking.setRating(rating);
        booking.setReview(review);
        Booking savedBooking = bookingRepository.save(booking);

        notificationService.sendNotification(
                booking.getVendor(),
                "New Review",
                "You received a " + rating + "-star review for " + booking.getService().getName(),
                "REVIEW_SUBMITTED",
                bookingId
        );

        return savedBooking;
    }
}

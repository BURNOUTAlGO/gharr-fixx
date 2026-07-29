package com.gharfix.backend.config;

import com.gharfix.backend.entity.User;
import com.gharfix.backend.entity.GharService;
import com.gharfix.backend.entity.Booking;
import com.gharfix.backend.enums.BookingStatus;
import com.gharfix.backend.enums.BargainStatus;
import com.gharfix.backend.enums.Role;
import com.gharfix.backend.repository.UserRepository;
import com.gharfix.backend.repository.ServiceRepository;
import com.gharfix.backend.repository.BookingRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.math.BigDecimal;

@Configuration
@RequiredArgsConstructor
@Slf4j
public class DataSeeder {

    @Bean
    public CommandLineRunner seedData(
            UserRepository userRepository,
            ServiceRepository serviceRepository,
            BookingRepository bookingRepository,
            PasswordEncoder passwordEncoder) {

        return args -> {
            if (userRepository.count() > 0) {
                log.info("Database already seeded. Skipping...");
                return;
            }

            log.info("Seeding database with initial data...");

            // Create Users
            User user1 = userRepository.save(User.builder()
                    .name("Rahul Sharma").email("rahul@example.com")
                    .password(passwordEncoder.encode("password123"))
                    .phone("9876543210").address("123 MG Road, Bangalore")
                    .role(Role.USER).build());

            User user2 = userRepository.save(User.builder()
                    .name("Priya Patel").email("priya@example.com")
                    .password(passwordEncoder.encode("password123"))
                    .phone("9876543211").address("45 Park Street, Mumbai")
                    .role(Role.USER).build());

            // Create Vendors
            User vendor1 = userRepository.save(User.builder()
                    .name("Suresh Kumar").email("suresh@vendor.com")
                    .password(passwordEncoder.encode("vendor123"))
                    .phone("9123456789").address("77 Tech Park, Hyderabad")
                    .role(Role.VENDOR).build());

            User vendor2 = userRepository.save(User.builder()
                    .name("Amit Singh").email("amit@vendor.com")
                    .password(passwordEncoder.encode("vendor123"))
                    .phone("9123456790").address("12 Ring Road, Delhi")
                    .role(Role.VENDOR).build());

            User vendor3 = userRepository.save(User.builder()
                    .name("Deepa Nair").email("deepa@vendor.com")
                    .password(passwordEncoder.encode("vendor123"))
                    .phone("9123456791").address("88 Anna Salai, Chennai")
                    .role(Role.VENDOR).build());

            // --- CATEGORY: CLEANING ---
            serviceRepository.save(GharService.builder()
                    .name("Full Home Deep Cleaning").description("Professional deep cleaning for your entire home including kitchen and all rooms.")
                    .category("Cleaning").basePrice(new BigDecimal("1500")).unit("per visit")
                    .imageUrl("https://images.unsplash.com/photo-1527515637462-cff94eecc1ac?w=800&q=80")
                    .vendor(vendor1).active(true).build());

            serviceRepository.save(GharService.builder()
                    .name("Washroom Deep Cleaning").description("Intensive cleaning and disinfection of bathrooms, tiles, and fittings.")
                    .category("Cleaning").basePrice(new BigDecimal("400")).unit("per washroom")
                    .imageUrl("https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=800&q=80")
                    .vendor(vendor1).active(true).build());

            serviceRepository.save(GharService.builder()
                    .name("Sofa & Carpet Cleaning").description("Shampooing and deep extraction cleaning for sofas and carpets.")
                    .category("Cleaning").basePrice(new BigDecimal("800")).unit("per set")
                    .imageUrl("https://images.unsplash.com/photo-1527515637462-cff94eecc1ac?w=800&q=80")
                    .vendor(vendor1).active(true).build());

            serviceRepository.save(GharService.builder()
                    .name("Cooking Utensils Wash").description("Professional dishwashing and kitchen utensil cleaning service.")
                    .category("Cleaning").basePrice(new BigDecimal("200")).unit("per session")
                    .imageUrl("https://images.unsplash.com/photo-1581622558667-3419a8dc5f83?w=800&q=80")
                    .vendor(vendor2).active(true).build());

            // --- CATEGORY: LAUNDRY ---
            serviceRepository.save(GharService.builder()
                    .name("Cloth Wash (Machine)").description("Automated machine wash and dry for regular daily wear.")
                    .category("Laundry").basePrice(new BigDecimal("150")).unit("per load")
                    .imageUrl("https://images.unsplash.com/photo-1545173168-9f1947eebb7f?w=800&q=80")
                    .vendor(vendor3).active(true).build());

            serviceRepository.save(GharService.builder()
                    .name("Cloth Wash (Hand)").description("Gentle hand wash for delicate fabrics and special care garments.")
                    .category("Laundry").basePrice(new BigDecimal("250")).unit("per 5 pcs")
                    .imageUrl("https://images.unsplash.com/photo-1545173168-9f1947eebb7f?w=800&q=80")
                    .vendor(vendor3).active(true).build());

            serviceRepository.save(GharService.builder()
                    .name("Premium Steam Ironing").description("Crisp steam ironing for shirts, trousers, and ethnic wear.")
                    .category("Laundry").basePrice(new BigDecimal("15")).unit("per piece")
                    .imageUrl("https://images.unsplash.com/photo-1517677208171-0bc6725a3e60?w=800&q=80")
                    .vendor(vendor3).active(true).build());

            // --- CATEGORY: BEAUTY & WELLNESS ---
            serviceRepository.save(GharService.builder()
                    .name("Men's Haircut & Grooming").description("Professional haircut, beard styling, and head massage at home.")
                    .category("Beauty").basePrice(new BigDecimal("299")).unit("per person")
                    .imageUrl("https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=800&q=80")
                    .vendor(vendor2).active(true).build());

            serviceRepository.save(GharService.builder()
                    .name("Salon at Home (Women)").description("Facial, waxing, pedicure, and manicure by expert beauticians.")
                    .category("Beauty").basePrice(new BigDecimal("999")).unit("per package")
                    .imageUrl("https://images.unsplash.com/photo-1560750588-73207b1ef5b8?w=800&q=80")
                    .vendor(vendor3).active(true).build());

            serviceRepository.save(GharService.builder()
                    .name("Full Body Massage").description("Relaxing oil massage therapy for stress relief and wellness.")
                    .category("Wellness").basePrice(new BigDecimal("1200")).unit("per hour")
                    .imageUrl("https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=800&q=80")
                    .vendor(vendor1).active(true).build());

            // --- CATEGORY: REPAIR & INSTALLATION ---
            serviceRepository.save(GharService.builder()
                    .name("AC Service & Repair").description("Complete AC servicing, gas refilling, and repair for all brands.")
                    .category("Repair").basePrice(new BigDecimal("800")).unit("per unit")
                    .imageUrl("https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=800&q=80")
                    .vendor(vendor1).active(true).build());

            serviceRepository.save(GharService.builder()
                    .name("RO Purifier Service").description("Filter replacement and deep cleaning of RO water purifiers.")
                    .category("Repair").basePrice(new BigDecimal("500")).unit("per visit")
                    .imageUrl("https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=800&q=80")
                    .vendor(vendor2).active(true).build());

            serviceRepository.save(GharService.builder()
                    .name("Plumbing & Leaks").description("Expert plumbing services for leaks, pipe fitting, and installations.")
                    .category("Repair").basePrice(new BigDecimal("500")).unit("per hour")
                    .imageUrl("https://images.unsplash.com/photo-1504148455328-c376907d081c?w=800&q=80")
                    .vendor(vendor2).active(true).build());

            serviceRepository.save(GharService.builder()
                    .name("Electrical Repair").description("Safe and certified electrical work for homes and offices.")
                    .category("Repair").basePrice(new BigDecimal("600")).unit("per hour")
                    .imageUrl("https://images.unsplash.com/photo-1621905251918-48416bd8575a?w=800&q=80")
                    .vendor(vendor2).active(true).build());

            // --- CATEGORY: AUTOMOBILE ---
            serviceRepository.save(GharService.builder()
                    .name("Car Wash & Detailing").description("Exterior foam wash and interior vacuum cleaning for your car.")
                    .category("Automobile").basePrice(new BigDecimal("499")).unit("per car")
                    .imageUrl("https://images.unsplash.com/photo-1520340356584-f9917d1eea6f?w=800&q=80")
                    .vendor(vendor1).active(true).build());

            // --- CATEGORY: PAINTING & DECOR ---
            serviceRepository.save(GharService.builder()
                    .name("Full Home Painting").description("Premium Asian Paints interior wall painting with surface putty & waterproofing.")
                    .category("Painting").basePrice(new BigDecimal("3500")).unit("per BHK")
                    .imageUrl("https://images.unsplash.com/photo-1562259949-e8e7689d7828?w=800&q=80")
                    .vendor(vendor2).active(true).build());

            serviceRepository.save(GharService.builder()
                    .name("Waterproofing & Wall Repair").description("Advanced damp treatment and wall seepage repair with 3-year warranty.")
                    .category("Painting").basePrice(new BigDecimal("1200")).unit("per wall")
                    .imageUrl("https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=800&q=80")
                    .vendor(vendor2).active(true).build());

            // --- CATEGORY: PEST CONTROL ---
            serviceRepository.save(GharService.builder()
                    .name("Cockroach & Ant Control").description("Odorless herbal gel treatment for cockroaches and ants.")
                    .category("Pest Control").basePrice(new BigDecimal("699")).unit("per service")
                    .imageUrl("https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&q=80")
                    .vendor(vendor3).active(true).build());

            serviceRepository.save(GharService.builder()
                    .name("Termite & Bedbug Treatment").description("Deep chemical injection treatment for wood termites and bedbugs.")
                    .category("Pest Control").basePrice(new BigDecimal("1499")).unit("per visit")
                    .imageUrl("https://images.unsplash.com/photo-1584622781564-1d9876a13d00?w=800&q=80")
                    .vendor(vendor3).active(true).build());

            // --- CATEGORY: CARPENTRY ---
            serviceRepository.save(GharService.builder()
                    .name("Modular Kitchen & Furniture").description("Custom carpentry work, lock replacement, hinges, and drawer repair.")
                    .category("Carpentry").basePrice(new BigDecimal("450")).unit("per hour")
                    .imageUrl("https://images.unsplash.com/photo-1538688525198-9b88f6f53126?w=800&q=80")
                    .vendor(vendor2).active(true).build());

            // --- CATEGORY: TECH & SMART HOME ---
            serviceRepository.save(GharService.builder()
                    .name("Smart Lock & CCTV Installation").description("HD Security camera setup, smart door locks, and WiFi configuration.")
                    .category("Smart Home").basePrice(new BigDecimal("999")).unit("per setup")
                    .imageUrl("https://images.unsplash.com/photo-1558002038-1055907df827?w=800&q=80")
                    .vendor(vendor1).active(true).build());

            serviceRepository.save(GharService.builder()
                    .name("Laptop & PC Repair").description("Hardware diagnosis, SSD upgrade, thermal paste & OS reinstallation.")
                    .category("Tech Support").basePrice(new BigDecimal("599")).unit("per device")
                    .imageUrl("https://images.unsplash.com/photo-1588702547919-26089e690ecc?w=800&q=80")
                    .vendor(vendor3).active(true).build());

            // --- CATEGORY: GARDENING ---
            serviceRepository.save(GharService.builder()
                    .name("Lawn & Garden Care").description("Plant pruning, organic fertilization, weed removal, and lawn mowing.")
                    .category("Gardening").basePrice(new BigDecimal("799")).unit("per visit")
                    .imageUrl("https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=800&q=80")
                    .vendor(vendor1).active(true).build());

            log.info("✅ Database seeded with a full suite of lifestyle services!");
        };
    }
}

package com.gharfix.backend.repository;

import com.gharfix.backend.entity.GharService;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ServiceRepository extends JpaRepository<GharService, Long> {
    List<GharService> findByVendorId(Long vendorId);
    List<GharService> findByActiveTrue();
    List<GharService> findByCategoryAndActiveTrue(String category);
}

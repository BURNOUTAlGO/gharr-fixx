package com.gharfix.backend.service;

import com.gharfix.backend.entity.GharService;
import com.gharfix.backend.entity.User;
import com.gharfix.backend.repository.ServiceRepository;
import com.gharfix.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ServiceManagementService {

    private final ServiceRepository serviceRepository;
    private final UserRepository userRepository;

    public GharService addService(GharService service) {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        User vendor = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Vendor not found"));
        
        service.setVendor(vendor);
        return serviceRepository.save(service);
    }

    public List<GharService> getAllServices() {
        return serviceRepository.findByActiveTrue();
    }

    public List<GharService> getVendorServices() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        User vendor = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Vendor not found"));
        return serviceRepository.findByVendorId(vendor.getId());
    }

    public GharService updateService(Long id, GharService serviceDetails) {
        GharService service = serviceRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Service not found"));
        
        service.setName(serviceDetails.getName());
        service.setDescription(serviceDetails.getDescription());
        service.setCategory(serviceDetails.getCategory());
        service.setBasePrice(serviceDetails.getBasePrice());
        service.setUnit(serviceDetails.getUnit());
        service.setActive(serviceDetails.isActive());
        
        return serviceRepository.save(service);
    }
}

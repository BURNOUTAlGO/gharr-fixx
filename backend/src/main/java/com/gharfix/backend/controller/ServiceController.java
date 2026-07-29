package com.gharfix.backend.controller;

import com.gharfix.backend.entity.GharService;
import com.gharfix.backend.service.ServiceManagementService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/services")
@RequiredArgsConstructor
public class ServiceController {

    private final ServiceManagementService serviceManagementService;

    @GetMapping
    public ResponseEntity<List<GharService>> getAllServices() {
        return ResponseEntity.ok(serviceManagementService.getAllServices());
    }

    @GetMapping("/vendor")
    @PreAuthorize("hasRole('VENDOR')")
    public ResponseEntity<List<GharService>> getVendorServices() {
        return ResponseEntity.ok(serviceManagementService.getVendorServices());
    }

    @PostMapping
    @PreAuthorize("hasRole('VENDOR')")
    public ResponseEntity<GharService> addService(@RequestBody GharService service) {
        return ResponseEntity.ok(serviceManagementService.addService(service));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('VENDOR')")
    public ResponseEntity<GharService> updateService(@PathVariable Long id, @RequestBody GharService service) {
        return ResponseEntity.ok(serviceManagementService.updateService(id, service));
    }
}

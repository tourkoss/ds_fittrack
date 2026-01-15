package gr.hua.dit.ds.fittrack.controllers;

import gr.hua.dit.ds.fittrack.entities.Appointment; // Πρώην Fund
import gr.hua.dit.ds.fittrack.services.AppointmentService; // Πρώην FundService
import gr.hua.dit.ds.fittrack.services.AvailabilityService;
import gr.hua.dit.ds.fittrack.services.UserDetailsImpl;
import gr.hua.dit.ds.fittrack.services.UserDetailsServiceImpl;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.annotation.Secured;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/appointment")
public class AppointmentController {

    private final AppointmentService appointmentService;
    private final AvailabilityService availabilityService;
    private final UserDetailsServiceImpl userService;

    public AppointmentController(AppointmentService appointmentService, AvailabilityService availabilityService, UserDetailsServiceImpl userService) {
        this.appointmentService = appointmentService;
        this.availabilityService = availabilityService;
        this.userService = userService;
    }

    @Secured("ROLE_USER")
    @PostMapping("/{availabilityId}/book")
    public ResponseEntity<String> bookAppointment(@PathVariable int availabilityId, @Valid @RequestBody Appointment appointment, @AuthenticationPrincipal UserDetailsImpl auth) {

        appointment.setBookingDate(LocalDateTime.now());
        appointment.setClient(userService.getUser(auth.getId()).get());

        boolean success = appointmentService.createAppointment(appointment, availabilityId);

        if(success) {
            return ResponseEntity.ok("Appointment booked successfully!");
        } else {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Failed to book: Slot might be taken or invalid.");
        }
    }

    @Secured("ROLE_USER")
    @GetMapping("/my-appointments")
    public ResponseEntity<List<Appointment>> getMyAppointments(@AuthenticationPrincipal UserDetailsImpl auth) {
        return ResponseEntity.ok(appointmentService.getAppointmentsByClientId(auth.getId()));
    }
}

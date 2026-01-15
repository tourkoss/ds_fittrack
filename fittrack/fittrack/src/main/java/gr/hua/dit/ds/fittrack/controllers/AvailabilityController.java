package gr.hua.dit.ds.fittrack.controllers;

import gr.hua.dit.ds.fittrack.entities.Availability;
import gr.hua.dit.ds.fittrack.entities.User;
import gr.hua.dit.ds.fittrack.payload.AvailabilityRequest; // Προσοχή στο import!
import gr.hua.dit.ds.fittrack.services.AvailabilityService;
import gr.hua.dit.ds.fittrack.services.UserDetailsImpl;
import gr.hua.dit.ds.fittrack.services.UserDetailsServiceImpl;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.annotation.Secured;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/availability")
@CrossOrigin(origins = "*", maxAge = 3600)
public class AvailabilityController {

    private final AvailabilityService availabilityService;
    private final UserDetailsServiceImpl userService;

    public AvailabilityController(AvailabilityService availabilityService, UserDetailsServiceImpl userService) {
        this.availabilityService = availabilityService;
        this.userService = userService;
    }

    @GetMapping("/all")
    public ResponseEntity<List<Availability>> getAllAvailabilities() {
        return ResponseEntity.ok(availabilityService.getAllAvailabilities());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Availability> getAvailability(@PathVariable int id) {
        return availabilityService.getAvailabilityById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @Secured("ROLE_TRAINER")
    @PostMapping("/add")
    public ResponseEntity<?> createAvailability(@RequestBody AvailabilityRequest request,
                                                @AuthenticationPrincipal UserDetailsImpl auth) {
        try {
            LocalDateTime start = LocalDateTime.parse(request.getStartTime());
            LocalDateTime end = LocalDateTime.parse(request.getEndTime());

            if (start.isBefore(LocalDateTime.now())) {
                return ResponseEntity.badRequest().body("Cannot create slots in the past!");
            }

            Availability availability = new Availability();
            availability.setStartTime(start);
            availability.setEndTime(end);
            availability.setActivityType(request.getActivityType());

            availability.setTitle(request.getActivityType() + " Session");
            availability.setDescription("Training session with specialist.");

            User trainer = userService.getUser(auth.getId()).orElseThrow(() -> new RuntimeException("Trainer not found"));
            availability.setTrainer(trainer);
            availability.setBooked(false);

            availabilityService.saveAvailability(availability);
            return ResponseEntity.ok("New availability slot created successfully!");

        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error creating slot: " + e.getMessage());
        }
    }

    @Secured("ROLE_TRAINER")
    @DeleteMapping("/{id}/delete")
    public ResponseEntity<String> deleteAvailability(@PathVariable int id, @AuthenticationPrincipal UserDetailsImpl auth) {
        Optional<Availability> av = availabilityService.getAvailabilityById(id);
        if (av.isPresent() && av.get().getTrainer().getUserID().equals(auth.getId())) {
            availabilityService.deleteAvailability(id);
            return ResponseEntity.ok("Availability slot deleted");
        }
        return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Access denied or Slot not found");
    }

    @Secured("ROLE_TRAINER")
    @GetMapping("/my-slots")
    public ResponseEntity<List<Availability>> getMySchedule(@AuthenticationPrincipal UserDetailsImpl auth) {
        User trainer = userService.getUser(auth.getId()).orElseThrow();
        return ResponseEntity.ok(trainer.getAvailabilities());
    }
}

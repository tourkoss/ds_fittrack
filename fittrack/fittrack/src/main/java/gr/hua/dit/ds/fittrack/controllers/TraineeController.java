package gr.hua.dit.ds.fittrack.controllers;

import gr.hua.dit.ds.fittrack.entities.TrainingLog;
import gr.hua.dit.ds.fittrack.entities.User;
import gr.hua.dit.ds.fittrack.repositories.TrainingLogRepository;
import gr.hua.dit.ds.fittrack.repositories.UserRepository;
import gr.hua.dit.ds.fittrack.services.UserDetailsImpl;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/trainee")
@CrossOrigin(origins = "*", maxAge = 3600)
public class TraineeController {

    private final UserRepository userRepository;
    private final TrainingLogRepository logRepository;

    public TraineeController(UserRepository userRepository, TrainingLogRepository logRepository) {
        this.userRepository = userRepository;
        this.logRepository = logRepository;
    }

    @GetMapping("/profile")
    public ResponseEntity<?> getProfile(@AuthenticationPrincipal UserDetailsImpl auth) {
        User user = userRepository.findById(auth.getId()).orElseThrow();

        return ResponseEntity.ok(Map.of(
                "weight", user.getWeight() != null ? user.getWeight() : 0,
                "goals", user.getGoals() != null ? user.getGoals() : "",
                "firstName", user.getFirstName(),
                "lastName", user.getLastName()
        ));
    }

    @PostMapping("/profile/update")
    public ResponseEntity<?> updateProfile(@AuthenticationPrincipal UserDetailsImpl auth, @RequestBody Map<String, Object> payload) {
        User user = userRepository.findById(auth.getId()).orElseThrow();

        if (payload.containsKey("weight")) {
            user.setWeight(Double.valueOf(payload.get("weight").toString()));
        }
        if (payload.containsKey("goals")) {
            user.setGoals((String) payload.get("goals"));
        }

        userRepository.save(user);
        return ResponseEntity.ok(Map.of("message", "Profile updated successfully!"));
    }

    @GetMapping("/logs")
    public ResponseEntity<List<TrainingLog>> getMyLogs(@AuthenticationPrincipal UserDetailsImpl auth) {
        return ResponseEntity.ok(logRepository.findByUserUserID(auth.getId()));
    }

    @PostMapping("/logs/add")
    public ResponseEntity<?> addLog(@AuthenticationPrincipal UserDetailsImpl auth, @RequestBody TrainingLog logRequest) {
        User user = userRepository.findById(auth.getId()).orElseThrow();

        LocalDate date = (logRequest.getDate() != null) ? logRequest.getDate() : LocalDate.now();

        TrainingLog log = new TrainingLog(
                date,
                logRequest.getLogType(),
                logRequest.getValue(),
                user
        );

        logRepository.save(log);
        return ResponseEntity.ok(Map.of("message", "Progress logged successfully!"));
    }
}

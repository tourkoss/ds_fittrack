package gr.hua.dit.ds.fittrack.controllers;

import gr.hua.dit.ds.fittrack.config.JwtUtils;
import gr.hua.dit.ds.fittrack.entities.Role;
import gr.hua.dit.ds.fittrack.entities.User;
import gr.hua.dit.ds.fittrack.payload.JwtResponse;
import gr.hua.dit.ds.fittrack.payload.LoginRequest;
import gr.hua.dit.ds.fittrack.payload.MessageResponse;
import gr.hua.dit.ds.fittrack.payload.SignupRequest;
import gr.hua.dit.ds.fittrack.repositories.RoleRepository;
import gr.hua.dit.ds.fittrack.repositories.UserRepository;
import gr.hua.dit.ds.fittrack.services.UserDetailsImpl;
import jakarta.annotation.PostConstruct;
import jakarta.transaction.Transactional;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    AuthenticationManager authenticationManager;
    UserRepository userRepository;
    RoleRepository roleRepository;
    BCryptPasswordEncoder encoder;
    JwtUtils jwtUtils;

    public AuthController(AuthenticationManager authenticationManager, UserRepository userRepository, RoleRepository roleRepository, BCryptPasswordEncoder encoder, JwtUtils jwtUtils) {
        this.authenticationManager = authenticationManager;
        this.userRepository = userRepository;
        this.roleRepository = roleRepository;
        this.encoder = encoder;
        this.jwtUtils = jwtUtils;
    }

    @Transactional
    @PostConstruct
    public void setup() {
        Role role_trainee = new Role("ROLE_TRAINEE");
        Role role_trainer = new Role("ROLE_TRAINER");
        Role role_admin = new Role("ROLE_ADMIN");

        roleRepository.updateOrInsert(role_trainee);
        roleRepository.updateOrInsert(role_trainer);
        roleRepository.updateOrInsert(role_admin);

        if (!userRepository.existsByEmail("admin@fittrack.gr")) {
            User admin = new User("admin", "Admin", "User", "admin@fittrack.gr", encoder.encode("admin123"));

            Set<Role> roles = new HashSet<>();
            roles.add(roleRepository.findByRoleName("ROLE_TRAINEE").orElseThrow());
            roles.add(roleRepository.findByRoleName("ROLE_ADMIN").orElseThrow());

            admin.setRoles(roles);
            userRepository.save(admin);
        }
    }

    @PostMapping("/signin")
    public ResponseEntity<?> authenticateUser(@Valid @RequestBody LoginRequest loginRequest) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(loginRequest.getUsername(), loginRequest.getPassword()));

        SecurityContextHolder.getContext().setAuthentication(authentication);
        String jwt = jwtUtils.generateJwtToken(authentication);

        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        List<String> roles = userDetails.getAuthorities().stream()
                .map(item -> item.getAuthority())
                .collect(Collectors.toList());

        return ResponseEntity.ok(new JwtResponse(jwt,
                userDetails.getId(),
                userDetails.getUsername(),
                userDetails.getEmail(),
                roles));
    }

    @PostMapping("/signup")
    public ResponseEntity<?> registerUser(@Valid @RequestBody SignupRequest signUpRequest) {
        if (userRepository.existsByUsername(signUpRequest.getUsername())) {
            return ResponseEntity
                    .badRequest()
                    .body(new MessageResponse("Error: Username is already taken!"));
        }

        if (userRepository.existsByEmail(signUpRequest.getEmail())) {
            return ResponseEntity
                    .badRequest()
                    .body(new MessageResponse("Error: Email is already in use!"));
        }

        User user = new User(signUpRequest.getUsername(),
                signUpRequest.getFirstName(),
                signUpRequest.getLastName(),
                signUpRequest.getEmail(),
                encoder.encode(signUpRequest.getPassword()));

        Set<String> strRoles = signUpRequest.getRoles();
        Set<Role> roles = new HashSet<>();

        if (strRoles == null) {
            Role userRole = roleRepository.findByRoleName("ROLE_TRAINEE")
                    .orElseThrow(() -> new RuntimeException("Error: Role is not found."));
            roles.add(userRole);
        } else {
            strRoles.forEach(role -> {
                switch (role) {
                    case "trainer":
                        Role trainerRole = roleRepository.findByRoleName("ROLE_TRAINER")
                                .orElseThrow(() -> new RuntimeException("Error: Role is not found."));
                        roles.add(trainerRole);
                        break;
                    case "admin":
                        Role adminRole = roleRepository.findByRoleName("ROLE_ADMIN")
                                .orElseThrow(() -> new RuntimeException("Error: Role is not found."));
                        roles.add(adminRole);
                        break;
                    default:
                        Role userRole = roleRepository.findByRoleName("ROLE_TRAINEE")
                                .orElseThrow(() -> new RuntimeException("Error: Role is not found."));
                        roles.add(userRole);
                }
            });
        }

        user.setRoles(roles);
        userRepository.save(user);

        return ResponseEntity.ok(new MessageResponse("User registered successfully!"));
    }
}

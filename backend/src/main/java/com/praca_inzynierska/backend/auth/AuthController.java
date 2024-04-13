package com.praca_inzynierska.backend.auth;

import com.praca_inzynierska.backend.auth.role.Role;
import com.praca_inzynierska.backend.auth.role.Role.ERole;
import com.praca_inzynierska.backend.auth.role.RoleRepository;
import com.praca_inzynierska.backend.auth.user.User;
import com.praca_inzynierska.backend.auth.user.UserDetailsImpl;
import com.praca_inzynierska.backend.auth.user.UserRepository;
import com.praca_inzynierska.backend.auth.user.requestBody.LoginRequest;
import com.praca_inzynierska.backend.auth.user.requestBody.PasswordResetRequest;
import com.praca_inzynierska.backend.auth.user.requestBody.SignUpRequest;
import com.praca_inzynierska.backend.auth.user.responseBody.JwtResponse;
import com.praca_inzynierska.backend.auth.user.responseBody.MessageResponse;
import com.praca_inzynierska.backend.auth.user.responseBody.UNoIds;
import com.praca_inzynierska.backend.auth.user.responseBody.URNoIds;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.util.HashSet;
import java.util.List;
import java.util.Objects;
import java.util.Set;
import java.util.stream.Collectors;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/api/auth")
public class AuthController {
  final
  AuthenticationManager authenticationManager;
  final
  UserRepository userRepository;
  final
  RoleRepository roleRepository;
  final
  PasswordEncoder encoder;
  final
  JwtUtils jwtUtils;

  public AuthController(AuthenticationManager authenticationManager, UserRepository userRepository, RoleRepository roleRepository, PasswordEncoder encoder, JwtUtils jwtUtils) {
    this.authenticationManager = authenticationManager;
    this.userRepository = userRepository;
    this.roleRepository = roleRepository;
    this.encoder = encoder;
    this.jwtUtils = jwtUtils;
  }

  @PreAuthorize("hasRole('ADMIN')")
  @GetMapping("/user/{id}")
  public ResponseEntity<?> getUser(@PathVariable("id") Long id) {
    try {
      UNoIds user = userRepository.findUserById(id);
      Set<String> role = roleRepository.findRoleByUserId(id);

      return new ResponseEntity<>(new URNoIds(user.getUsername(), user.getEmail(), role), HttpStatus.OK);
    } catch (Exception e) {
      System.out.println(e);
      return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @PreAuthorize("hasRole('ADMIN')")
  @GetMapping("/users")
  public ResponseEntity<?> getAllUsers() {
    try {
      return new ResponseEntity<>(userRepository.getUsers(), HttpStatus.OK);
    } catch (Exception e) {
      return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
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
      .map(GrantedAuthority::getAuthority)
      .collect(Collectors.toList());

    return ResponseEntity.ok(new JwtResponse(jwt,
      userDetails.getId(),
      userDetails.getUsername(),
      userDetails.getEmail(),
      roles));
  }

  @PostMapping("/signup")
  public ResponseEntity<?> registerUser(@Valid @RequestBody SignUpRequest signUpRequest) {
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
      signUpRequest.getEmail(),
      encoder.encode(signUpRequest.getPassword()));

    Set<String> strRoles = signUpRequest.getRoles();

    Set<Role> roles = new HashSet<>();

    if (strRoles == null) {
      Role userRole = roleRepository.findByName(ERole.ROLE_USER)
        .orElseThrow(() -> new RuntimeException("Error: Role is not found."));
      roles.add(userRole);
    } else {
      strRoles.forEach(role -> {
        switch (role) {
          case "ROLE_ADMIN" -> {
            Role adminRole = roleRepository.findByName(ERole.ROLE_ADMIN)
              .orElseThrow(() -> new RuntimeException("Error: Role is not found."));
            roles.add(adminRole);
          }
          default -> {
            Role userRole = roleRepository.findByName(ERole.ROLE_USER)
              .orElseThrow(() -> new RuntimeException("Error: Role is not found."));
            roles.add(userRole);
          }
        }
      });
    }

    user.setRoles(roles);
    userRepository.save(user);

    return ResponseEntity.ok(new MessageResponse("User registered successfully!"));
  }

  @PreAuthorize("hasRole('ADMIN')")
  @PutMapping("/user/reset-password/{id}")
  public ResponseEntity<?> resetPassword(@PathVariable("id") long userId, @RequestBody PasswordResetRequest password) {
    try {
      User userFromDB;
      if (userRepository.findById(userId).isPresent()) userFromDB = userRepository.findById(userId).get();
      else return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);

      userFromDB.setPassword(encoder.encode(password.getPassword()));
      userRepository.save(userFromDB);
      return new ResponseEntity<>(null, HttpStatus.OK);
    } catch (Exception e) {
      return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @PreAuthorize("hasRole('ADMIN')")
  @PutMapping("/user/{id}")
  public ResponseEntity<?> updateUser(@PathVariable("id") long userId, @RequestBody URNoIds userData) {
    try {
      User userFromDB;
      if (userRepository.findById(userId).isPresent()) userFromDB = userRepository.findById(userId).get();
      else return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);

      if (!Objects.equals(userFromDB.getUsername(), userData.getUsername())) {
        if (userRepository.existsByUsername(userData.getUsername())) {
          return ResponseEntity
            .badRequest()
            .body(new MessageResponse("Username taken"));
        } else {
          userFromDB.setUsername(userData.getUsername());
        }
      }

      if (!Objects.equals(userFromDB.getEmail(), userData.getEmail())) {
        if (userRepository.existsByEmail(userData.getEmail())) {
          return ResponseEntity
            .badRequest()
            .body(new MessageResponse("Email taken"));
        } else {
          userFromDB.setEmail(userData.getEmail());
        }
      }

      Set<String> strRoles = (Set<String>) userData.getRoles();
      Set<Role> roles = new HashSet<>();

      if (strRoles == null) {
        Role userRole = roleRepository.findByName(ERole.ROLE_USER)
          .orElseThrow(() -> new RuntimeException("Error: Role is not found."));
        roles.add(userRole);
      } else {
        strRoles.forEach(role -> {
          switch (role) {
            case "ROLE_ADMIN" -> {
              Role adminRole = roleRepository.findByName(ERole.ROLE_ADMIN)
                .orElseThrow(() -> new RuntimeException("Error: Role is not found."));
              roles.add(adminRole);
            }
            default -> {
              Role userRole = roleRepository.findByName(ERole.ROLE_USER)
                .orElseThrow(() -> new RuntimeException("Error: Role is not found."));
              roles.add(userRole);
            }
          }
        });
      }

      userFromDB.setRoles(roles);
      userRepository.save(userFromDB);
      return new ResponseEntity<>(null, HttpStatus.OK);
    } catch (Exception e) {
      return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @PreAuthorize("hasRole('ADMIN')")
  @DeleteMapping("/users/{id}")
  public ResponseEntity<HttpStatus> deleteUser(@PathVariable("id") long id) {
    try {
      userRepository.deleteById(id);
      return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    } catch (Exception e) {
      return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @PreAuthorize("hasRole('ADMIN')")
  @GetMapping("admin-panel")
  public ResponseEntity<HttpStatus> adminPanel() {
    try {
      return new ResponseEntity<>(null, HttpStatus.OK);
    } catch (Exception e) {
      return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
    }

  }
}

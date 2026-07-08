package com.college.placement.portal.auth.service;
import com.college.placement.portal.auth.dto.LoginRequest;
import com.college.placement.portal.auth.dto.LoginResponse;
import com.college.placement.portal.auth.entity.RegisterEntity;
import com.college.placement.portal.auth.entity.Role;
import com.college.placement.portal.auth.jwt.RegisterJWT;
import com.college.placement.portal.auth.repository.RegisterRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import java.util.Optional;

@Service
public class LoginService {

    private final RegisterRepository registerRepository;
    private final PasswordEncoder passwordEncoder;
    private final RegisterJWT registerJWT;

    public LoginService(RegisterRepository registerRepository,
                        PasswordEncoder passwordEncoder,
                        RegisterJWT registerJWT) {
        this.registerRepository = registerRepository;
        this.passwordEncoder = passwordEncoder;
        this.registerJWT = registerJWT;
    }

    public LoginResponse login(LoginRequest request) {

        // password & confirm password mismatch
        if (!request.getPassword().equals(request.getConfirmPassword())) {
            return new LoginResponse("Password and Confirm Password do not match", null, null);
        }

        Optional<RegisterEntity> optionalUser =
                registerRepository.findByEmail(request.getEmail());

        if (optionalUser.isEmpty()) {
            return new LoginResponse("Email does not exist", null, null);
        }

        RegisterEntity user = optionalUser.get();

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            return new LoginResponse("Wrong password", null, null);
        }

        String token = registerJWT.generateToken(
                user.getEmail(),user.getRole(),
                request.isRememberMe()
        );

        return new LoginResponse(
                "Login successful",
                token,
                user.getRole().name()
        );
    }

    public String logout() {
        return "Logout successful. Session terminated.";
    }
}

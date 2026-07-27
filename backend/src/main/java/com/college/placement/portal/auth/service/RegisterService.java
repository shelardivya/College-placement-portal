package com.college.placement.portal.auth.service;

import com.college.placement.portal.auth.dto.RegisterDto;
import com.college.placement.portal.auth.entity.RegisterEntity;
import com.college.placement.portal.auth.entity.Role;
import com.college.placement.portal.auth.exception.DuplicateResourceException;
import com.college.placement.portal.auth.jwt.RegisterJWT;
import com.college.placement.portal.auth.repository.RegisterRepository;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;

@Service
public class RegisterService {

    private final RegisterRepository registerRepository;
    private final RegisterJWT registerJWT;
    private final BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();

    public RegisterService(RegisterRepository registerRepository, RegisterJWT registerJWT) {
        this.registerRepository = registerRepository;
        this.registerJWT = registerJWT;
    }

    public String registerStudent(RegisterDto req) {

        if (registerRepository.existsByEmail(req.getEmail())) {
            throw new DuplicateResourceException(
                    "Student already registered with this email"
            );
        }

        if (registerRepository.existsByMobile(req.getMobile())) {
            throw new DuplicateResourceException(
                    "Student already registered with this mobile number"
            );
        }

        if (!req.getPassword().equals(req.getConfirmPassword())) {
            throw new IllegalArgumentException(
                    "Password and Confirm Password do not match"
            );
        }

        RegisterEntity student = new RegisterEntity();
        student.setFullName(req.getFullName());
        student.setEmail(req.getEmail());
        student.setMobile(req.getMobile());
        student.setDepartment(req.getDepartment());
        student.setCourse(req.getCourse());
        student.setCurrentYear(req.getCurrentYear());
        student.setCgpa(req.getCgpa());

        student.setDob(
                LocalDate.parse(
                        req.getDob(),
                        DateTimeFormatter.ofPattern("dd-MM-yyyy")
                )
        );

        student.setPassword(encoder.encode(req.getPassword()));
        student.setRole(Role.STUDENT);
        registerRepository.save(student);

        return registerJWT.generateToken(
                student.getEmail(),
                student.getRole(),
                req.isRememberMe()
        );
    }
}

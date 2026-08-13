package com.college.placement.portal.admin.service;

import com.college.placement.portal.admin.dto.AddTopPlacedStudentRequestDto;
import com.college.placement.portal.admin.dto.TopPlacedStudentResponseDto;
import com.college.placement.portal.admin.entity.TopPlacedStudentEntity;
import com.college.placement.portal.admin.repository.TopPlacedStudentRepository;
import com.college.placement.portal.auth.entity.RegisterEntity;
import com.college.placement.portal.auth.entity.Role;
import com.college.placement.portal.auth.repository.RegisterRepository;
import com.college.placement.portal.notification.util.NotificationHelper;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class TopPlacedStudentService {

    private final TopPlacedStudentRepository topPlacedStudentRepository;
    private final RegisterRepository registerRepository;
    private final NotificationHelper notificationHelper;

    public TopPlacedStudentService(
            TopPlacedStudentRepository topPlacedStudentRepository,
            RegisterRepository registerRepository,
            NotificationHelper notificationHelper
    ) {
        this.topPlacedStudentRepository = topPlacedStudentRepository;
        this.registerRepository = registerRepository;
        this.notificationHelper = notificationHelper;
    }
    // ==========================================
    // Add Top Placed Student
    // ==========================================

    public String addTopPlacedStudent(
            AddTopPlacedStudentRequestDto request
    ) {
        RegisterEntity registeredStudent =
                findStudentByName(request.getStudentName());

        TopPlacedStudentEntity student =
                new TopPlacedStudentEntity();

        student.setStudentName(
                registeredStudent.getFullName()
        );

        student.setCompanyName(
                request.getCompanyName()
        );

        student.setPackageLpa(
                request.getPackageLpa()
        );

        student.setCgpa(
                request.getCgpa()
        );

        student.setSkills(
                request.getSkills()
        );
        student.setBranch(request.getBranch());
        student.setPassingYear(request.getPassingYear());

        topPlacedStudentRepository.save(student);
        // ==========================================
// Notify All Students
// ==========================================

        for (RegisterEntity studentUser :
                registerRepository.findAllByRole(Role.STUDENT)) {

            notificationHelper.createNotification(
                    studentUser,
                    "STUDENT",
                    "New Top Placed Student",
                    "Congratulations!\n"
                            + student.getStudentName()
                            + " got placed at "
                            + student.getCompanyName()
                            + ".\nPackage : "
                            + student.getPackageLpa()
                            + " LPA"
            );

        }

        return "Top Placed Student Added Successfully.";

    }

    // ==========================================
    // View All Top Placed Students
    // ==========================================

    public List<TopPlacedStudentResponseDto> getAllTopPlacedStudents() {

        List<TopPlacedStudentEntity> students =
                topPlacedStudentRepository
                        .findAllByOrderByPackageLpaDesc();

        List<TopPlacedStudentResponseDto> response =
                new ArrayList<>();

        for (TopPlacedStudentEntity student : students) {

            TopPlacedStudentResponseDto dto =
                    new TopPlacedStudentResponseDto();

            dto.setId(student.getId());
            dto.setStudentName(student.getStudentName());
            dto.setCompanyName(student.getCompanyName());
            dto.setPackageLpa(student.getPackageLpa());
            dto.setCgpa(student.getCgpa());
            dto.setSkills(student.getSkills());
            dto.setBranch(student.getBranch());
            dto.setPassingYear(student.getPassingYear());

            response.add(dto);

        }

        return response;

    }

    // ==========================================
    // Get Top Placed Student By Id
    // ==========================================

    public TopPlacedStudentResponseDto getTopPlacedStudentById(
            Long id
    ) {

        TopPlacedStudentEntity student =
                topPlacedStudentRepository.findById(id)
                        .orElseThrow(() ->
                                new IllegalArgumentException("Top Placed Student Not Found."));

        TopPlacedStudentResponseDto dto =
                new TopPlacedStudentResponseDto();

        dto.setId(student.getId());
        dto.setStudentName(student.getStudentName());
        dto.setCompanyName(student.getCompanyName());
        dto.setPackageLpa(student.getPackageLpa());
        dto.setCgpa(student.getCgpa());
        dto.setSkills(student.getSkills());
        dto.setBranch(student.getBranch());
        dto.setPassingYear(student.getPassingYear());

        return dto;

    }

    // ==========================================
    // Update Top Placed Student
    // ==========================================

    public String updateTopPlacedStudent(
            Long id,
            AddTopPlacedStudentRequestDto request
    ) {

        TopPlacedStudentEntity student =
                topPlacedStudentRepository.findById(id)
                        .orElseThrow(() ->
                                new IllegalArgumentException("Top Placed Student Not Found."));

        student.setStudentName(request.getStudentName());
        student.setCompanyName(request.getCompanyName());
        student.setPackageLpa(request.getPackageLpa());
        student.setCgpa(request.getCgpa());
        student.setSkills(request.getSkills());
        student.setBranch(request.getBranch());
        student.setPassingYear(request.getPassingYear());

        topPlacedStudentRepository.save(student);

        return "Top Placed Student Updated Successfully.";

    }

    // ==========================================
    // Delete Top Placed Student
    // ==========================================

    public String deleteTopPlacedStudent(
            Long id
    ) {

        TopPlacedStudentEntity student =
                topPlacedStudentRepository.findById(id)
                        .orElseThrow(() ->
                                new IllegalArgumentException("Top Placed Student Not Found."));

        topPlacedStudentRepository.delete(student);

        return "Top Placed Student Deleted Successfully.";

    }

    // ==========================================
// Find Registered Student By Name
// ==========================================

    private RegisterEntity findStudentByName(String inputName) {

        if (inputName == null || inputName.trim().isEmpty()) {

            throw new IllegalArgumentException(
                    "Student name is required."
            );
        }

        // Extra spaces remove + multiple spaces ko single space
        String normalizedName =
                inputName.trim().replaceAll("\\s+", " ");

        // Sirf registered STUDENT ko search karo
        List<RegisterEntity> students =
                registerRepository.findByFullNameIgnoreCaseAndRole(
                        normalizedName,
                        Role.STUDENT
                );

        // ==========================================
        // Exact registered name mil gaya
        // ==========================================

        if (!students.isEmpty()) {

            // Same name ke 2 students bhi ho sakte hain.
            // Dono cases mein exact match valid hai.
            return students.get(0);
        }

        // ==========================================
        // Exact match nahi mila
        // Ab spelling suggestion check karo
        // ==========================================

        RegisterEntity suggestedStudent =
                findClosestStudent(normalizedName);

        if (suggestedStudent != null) {

            throw new IllegalArgumentException(
                    "Student name seems incorrect. Did you mean \""
                            + suggestedStudent.getFullName()
                            + "\"?"
            );
        }

        // ==========================================
        // Koi matching student nahi mila
        // ==========================================

        throw new IllegalArgumentException(
                "Student not found. Please enter the registered student's full name."
        );
    }
    // ==========================================
// Find Closest Registered Student
// ==========================================

    private RegisterEntity findClosestStudent(String inputName) {

        List<RegisterEntity> students =
                registerRepository.findAllByRole(Role.STUDENT);

        RegisterEntity closestStudent = null;

        int minimumDistance = Integer.MAX_VALUE;

        for (RegisterEntity student : students) {

            String registeredName =
                    student.getFullName()
                            .trim()
                            .replaceAll("\\s+", " ");

            int distance =
                    calculateLevenshteinDistance(
                            inputName.toLowerCase(),
                            registeredName.toLowerCase()
                    );

            if (distance < minimumDistance) {

                minimumDistance = distance;
                closestStudent = student;
            }
        }

        // Sirf genuinely close spelling ko suggestion do
        if (minimumDistance <= 3) {

            return closestStudent;
        }

        return null;
    }
    // ==========================================
// Calculate Levenshtein Distance
// ==========================================

    private int calculateLevenshteinDistance(
            String first,
            String second
    ) {

        int[][] dp =
                new int[first.length() + 1]
                        [second.length() + 1];

        for (int i = 0; i <= first.length(); i++) {

            dp[i][0] = i;
        }

        for (int j = 0; j <= second.length(); j++) {

            dp[0][j] = j;
        }

        for (int i = 1; i <= first.length(); i++) {

            for (int j = 1; j <= second.length(); j++) {

                int cost;

                if (first.charAt(i - 1)
                        == second.charAt(j - 1)) {

                    cost = 0;

                } else {

                    cost = 1;
                }

                dp[i][j] =
                        Math.min(
                                Math.min(
                                        dp[i - 1][j] + 1,
                                        dp[i][j - 1] + 1
                                ),
                                dp[i - 1][j - 1] + cost
                        );
            }
        }

        return dp[first.length()][second.length()];
    }

}
package com.college.placement.portal.student.util;

import org.springframework.stereotype.Component;

import java.util.HashSet;
import java.util.Set;

@Component
public class ResumeMatcher {

    public int calculateMatchPercentage(String resumeText,
                                        String jobRequirements) {

        if (resumeText == null || resumeText.isBlank()) {
            return 0;
        }

        if (jobRequirements == null || jobRequirements.isBlank()) {
            return 0;
        }

        Set<String> resumeWords = new HashSet<>();

        for (String word : resumeText
                .toLowerCase()
                .split("[^a-zA-Z0-9+#.]")) {

            if (!word.isBlank()) {
                resumeWords.add(word);
            }
        }

        Set<String> jobWords = new HashSet<>();

        for (String word : jobRequirements
                .toLowerCase()
                .split("[^a-zA-Z0-9+#.]")) {

            if (!word.isBlank()) {
                jobWords.add(word);
            }
        }

        if (jobWords.isEmpty()) {
            return 0;
        }

        int matched = 0;

        for (String skill : jobWords) {

            if (resumeWords.contains(skill)) {
                matched++;
            }

        }

        return (matched * 100) / jobWords.size();
    }

}
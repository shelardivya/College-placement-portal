package com.college.placement.portal.student.util;

import org.apache.pdfbox.Loader;
import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.text.PDFTextStripper;
import org.springframework.stereotype.Component;

import java.io.File;

@Component
public class ResumeParser {

    public String extractText(String resumePath) {

        try {

            File file = new File(resumePath);

            if (!file.exists()) {
                throw new IllegalArgumentException("Resume file not found.");
            }

            PDDocument document = Loader.loadPDF(file);

            PDFTextStripper stripper = new PDFTextStripper();

            String text = stripper.getText(document);

            document.close();

            if (text == null) {
                return "";
            }

            return text
                    .replaceAll("[\\r\\n]+", " ")
                    .replaceAll("\\s+", " ")
                    .trim()
                    .toLowerCase();

        } catch (Exception e) {

            throw new RuntimeException("Unable to read resume PDF.", e);

        }

    }

}
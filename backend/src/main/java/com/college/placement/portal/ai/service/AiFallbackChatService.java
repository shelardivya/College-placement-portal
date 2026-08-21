package com.college.placement.portal.ai.service;

import com.college.placement.portal.ai.config.AiProviderConfig;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;

import java.util.List;
import java.util.Map;

@Service
public class AiFallbackChatService {

    private final List<AiProviderConfig> providers;
    private final RestClient restClient;

    public AiFallbackChatService(List<AiProviderConfig> providers) {
        this.providers = providers;
        this.restClient = RestClient.create();
    }

    public String chat(String systemPrompt, String userQuestion) {

        Exception lastError = null;

        for (AiProviderConfig provider : providers) {

            try {

                String content = switch (provider.type()) {
                    case GEMINI_NATIVE ->
                            callGeminiNative(provider, systemPrompt, userQuestion);
                    case OPENAI_COMPATIBLE ->
                            callOpenAiCompatible(provider, systemPrompt, userQuestion);
                };

                if (content != null && !content.isBlank()) {
                    System.out.println("AI Answer served by: " + provider.name());
                    return content;
                }

            } catch (Exception e) {

                lastError = e;

                System.out.println(
                        "AI Provider failed [" + provider.name() + "] : " + e.getMessage()
                                + " -> switching to next provider"
                );
            }
        }

        throw new RuntimeException(
                "All configured AI providers failed.",
                lastError
        );
    }

    // =====================================================
    // GEMINI — native REST API (works with new AQ. keys)
    // =====================================================

    @SuppressWarnings("unchecked")
    private String callGeminiNative(
            AiProviderConfig provider,
            String systemPrompt,
            String userQuestion
    ) {

        String url = provider.baseUrl() + "/" + provider.model() + ":generateContent";

        Map<String, Object> requestBody = Map.of(
                "system_instruction", Map.of(
                        "parts", List.of(Map.of("text", systemPrompt))
                ),
                "contents", List.of(
                        Map.of(
                                "role", "user",
                                "parts", List.of(Map.of("text", userQuestion))
                        )
                ),
                "generationConfig", Map.of("temperature", 0.3)
        );

        Map<String, Object> response = restClient
                .post()
                .uri(url)
                .header("x-goog-api-key", provider.apiKey())
                .header("Content-Type", "application/json")
                .body(requestBody)
                .retrieve()
                .body(Map.class);

        if (response == null) {
            return null;
        }

        List<Map<String, Object>> candidates =
                (List<Map<String, Object>>) response.get("candidates");

        if (candidates == null || candidates.isEmpty()) {
            return null;
        }

        Map<String, Object> content =
                (Map<String, Object>) candidates.get(0).get("content");

        if (content == null) {
            return null;
        }

        List<Map<String, Object>> parts =
                (List<Map<String, Object>>) content.get("parts");

        if (parts == null || parts.isEmpty()) {
            return null;
        }

        Object text = parts.get(0).get("text");

        return text != null ? text.toString() : null;
    }

    // =====================================================
    // GROQ — OpenAI-compatible chat completions
    // =====================================================

    @SuppressWarnings("unchecked")
    private String callOpenAiCompatible(
            AiProviderConfig provider,
            String systemPrompt,
            String userQuestion
    ) {

        Map<String, Object> requestBody = Map.of(
                "model", provider.model(),
                "temperature", 0.3,
                "messages", List.of(
                        Map.of("role", "system", "content", systemPrompt),
                        Map.of("role", "user", "content", userQuestion)
                )
        );

        Map<String, Object> response = restClient
                .post()
                .uri(provider.baseUrl())
                .header("Authorization", "Bearer " + provider.apiKey())
                .header("Content-Type", "application/json")
                .body(requestBody)
                .retrieve()
                .body(Map.class);

        if (response == null) {
            return null;
        }

        List<Map<String, Object>> choices =
                (List<Map<String, Object>>) response.get("choices");

        if (choices == null || choices.isEmpty()) {
            return null;
        }

        Map<String, Object> message =
                (Map<String, Object>) choices.get(0).get("message");

        if (message == null) {
            return null;
        }

        Object content = message.get("content");

        return content != null ? content.toString() : null;
    }
}
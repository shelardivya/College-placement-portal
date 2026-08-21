package com.college.placement.portal.ai.config;

public record AiProviderConfig(
        String name,
        String baseUrl,
        String apiKey,
        String model,
        ProviderType type
) {
    public enum ProviderType {
        GEMINI_NATIVE,
        OPENAI_COMPATIBLE
    }
}
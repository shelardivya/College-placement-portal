package com.college.placement.portal.ai.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.ArrayList;
import java.util.List;

@Configuration
public class AiModelRouterConfig {

    @Value("${gemini.api.key}")
    private String geminiApiKey;

    @Value("${gemini.api.base-url}")
    private String geminiBaseUrl;   // https://generativelanguage.googleapis.com/v1beta/models

    @Value("${ai.fallback.model-1}")
    private String geminiModel1;

    @Value("${ai.fallback.model-2}")
    private String geminiModel2;

    @Value("${ai.fallback.model-3}")
    private String geminiModel3;

    @Value("${ai.fallback.model-4}")
    private String geminiModel4;

    @Value("${groq.api.key}")
    private String groqApiKey;

    @Value("${groq.api.base-url}")
    private String groqBaseUrl;

    @Value("${groq.model}")
    private String groqModel;

    @Bean
    public List<AiProviderConfig> aiProviders() {

        List<AiProviderConfig> providers = new ArrayList<>();

        providers.add(new AiProviderConfig(
                "Gemini 3.7 Flash", geminiBaseUrl, geminiApiKey, geminiModel1,
                AiProviderConfig.ProviderType.GEMINI_NATIVE
        ));

        providers.add(new AiProviderConfig(
                "Gemini 3.5 Flash", geminiBaseUrl, geminiApiKey, geminiModel2,
                AiProviderConfig.ProviderType.GEMINI_NATIVE
        ));

        providers.add(new AiProviderConfig(
                "Gemini 3.5 Flash-Lite", geminiBaseUrl, geminiApiKey, geminiModel3,
                AiProviderConfig.ProviderType.GEMINI_NATIVE
        ));

        providers.add(new AiProviderConfig(
                "Gemini 3.1 Flash-Lite", geminiBaseUrl, geminiApiKey, geminiModel4,
                AiProviderConfig.ProviderType.GEMINI_NATIVE
        ));

        providers.add(new AiProviderConfig(
                "Groq (Final Fallback)", groqBaseUrl, groqApiKey, groqModel,
                AiProviderConfig.ProviderType.OPENAI_COMPATIBLE
        ));

        return providers;
    }
}
import json
import re
import time
import logging
import asyncio
from typing import Optional, Dict, Any
from providers.ai_provider import AIProvider
from providers.demo_provider import DemoProvider

logger = logging.getLogger(__name__)

MODELS_TO_TRY = ['gemini-3.5-flash', 'gemini-3.5-flash-lite', 'gemini-3.7-flash']

# Semaphore to prevent burst-exhausting API rate limits on free-tier keys
API_SEMAPHORE = asyncio.Semaphore(2)

class GeminiProvider(AIProvider):
    provider_name = 'gemini'
    
    def __init__(self, api_key: str):
        self.api_key = api_key
        self.available = False
        self.active_model_name = 'gemini-3.5-flash'
        try:
            import google.generativeai as genai
            if self.api_key:
                genai.configure(api_key=self.api_key)
                self.available = True
                logger.info(f"GeminiProvider initialized with API key. Primary model: {self.active_model_name}")
            else:
                logger.warning("Gemini API key not provided. Falling back to DemoProvider.")
        except ImportError:
            logger.warning("google.generativeai not installed. Falling back to DemoProvider.")
        
        self.fallback = DemoProvider()

    def _clean_json_text(self, text: str) -> str:
        if not text:
            return ""
        cleaned = text.strip()
        # Remove markdown code block if present
        if cleaned.startswith('```json'):
            cleaned = cleaned[7:]
        elif cleaned.startswith('```'):
            cleaned = cleaned[3:]
        if cleaned.endswith('```'):
            cleaned = cleaned[:-3]
        cleaned = cleaned.strip()
        
        # If wrapped in braces somewhere within the text, extract the main JSON block
        if '{' in cleaned and '}' in cleaned:
            first_brace = cleaned.find('{')
            last_brace = cleaned.rfind('}')
            if first_brace != -1 and last_brace != -1 and last_brace > first_brace:
                cleaned = cleaned[first_brace:last_brace+1]
                
        return cleaned

    def _sync_generate(self, prompt: str) -> str:
        import google.generativeai as genai
        last_error = None
        
        for attempt in range(2):
            for model_name in MODELS_TO_TRY:
                try:
                    model = genai.GenerativeModel(model_name)
                    response = model.generate_content(prompt)
                    if response and hasattr(response, 'text') and response.text:
                        self.active_model_name = model_name
                        return response.text
                except Exception as e:
                    last_error = e
                    err_str = str(e)
                    if "429" in err_str or "ResourceExhausted" in err_str or "quota" in err_str.lower():
                        logger.warning(f"Rate limit hit for {model_name}. Backing off 1.5s...")
                        time.sleep(1.5)
                    else:
                        logger.warning(f"Gemini model {model_name} failed: {e}. Trying next candidate...")
                    continue
                
        if last_error:
            raise last_error
        raise RuntimeError("No Gemini model succeeded.")

    async def generate(self, system_prompt: str, user_content: str, response_schema: Optional[Dict[str, Any]] = None) -> str:
        if not self.available:
            return await self.fallback.generate(system_prompt, user_content, response_schema)
        
        try:
            prompt = f"{system_prompt}\n\nUser Input:\n{user_content}"
            if response_schema:
                prompt += f"\n\nIMPORTANT: You MUST respond ONLY with valid JSON matching the following schema. Do NOT include any explanations, markdown code blocks, or extra text outside the JSON object.\n{json.dumps(response_schema)}"
            
            async with API_SEMAPHORE:
                raw_text = await asyncio.to_thread(self._sync_generate, prompt)
                
            cleaned = self._clean_json_text(raw_text)
            return cleaned
        except Exception as e:
            logger.error(f"Gemini API error across all models: {e}. Falling back to DemoProvider.")
            return await self.fallback.generate(system_prompt, user_content, response_schema)

    async def health_check(self) -> bool:
        return self.available



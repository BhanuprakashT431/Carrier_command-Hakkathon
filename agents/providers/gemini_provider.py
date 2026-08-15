import json
import logging
from typing import Optional, Dict, Any
from providers.ai_provider import AIProvider
from providers.demo_provider import DemoProvider

logger = logging.getLogger(__name__)

class GeminiProvider(AIProvider):
    provider_name = 'gemini'
    
    def __init__(self, api_key: str):
        self.api_key = api_key
        self.available = False
        try:
            import google.generativeai as genai
            if self.api_key:
                genai.configure(api_key=self.api_key)
                self.model = genai.GenerativeModel('gemini-1.5-flash')
                self.available = True
            else:
                logger.warning("Gemini API key not provided. Falling back to DemoProvider.")
        except ImportError:
            logger.warning("google.generativeai not installed. Falling back to DemoProvider.")
        
        self.fallback = DemoProvider()

    async def generate(self, system_prompt: str, user_content: str, response_schema: Optional[Dict[str, Any]] = None) -> str:
        if not self.available:
            return await self.fallback.generate(system_prompt, user_content, response_schema)
        
        try:
            import google.generativeai as genai
            prompt = f"{system_prompt}\n\nUser Input:\n{user_content}"
            if response_schema:
                prompt += f"\n\nPlease provide output in the following JSON schema:\n{json.dumps(response_schema)}"
            
            model = genai.GenerativeModel('gemini-1.5-flash')
            response = model.generate_content(prompt)
            
            text = response.text
            if text.startswith('```json'):
                text = text[7:]
            if text.startswith('```'):
                text = text[3:]
            if text.endswith('```'):
                text = text[:-3]
                
            return text.strip()
        except Exception as e:
            logger.error(f"Gemini API error: {e}")
            return await self.fallback.generate(system_prompt, user_content, response_schema)

    async def health_check(self) -> bool:
        return self.available

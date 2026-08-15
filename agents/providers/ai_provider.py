from abc import ABC, abstractmethod
from typing import Optional, Dict, Any

class AIProvider(ABC):
    provider_name: str
    
    @abstractmethod
    async def generate(self, system_prompt: str, user_content: str, response_schema: Optional[Dict[str, Any]] = None) -> str:
        """Generate a response. Returns JSON string."""
        pass
    
    @abstractmethod
    async def health_check(self) -> bool:
        pass
    
    def get_name(self) -> str:
        return self.provider_name

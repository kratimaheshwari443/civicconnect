"""
Bilingual Translation Service (English <-> Hindi) for CivicConnect.
Uses Groq AI (Qwen / GPT-OSS) with in-memory caching to translate
grievance descriptions, officer notes, and monitoring roadmaps dynamically.
"""

import os
import requests
from dotenv import load_dotenv

ENV_FILE = os.path.join(os.path.dirname(os.path.dirname(__file__)), ".env")
load_dotenv(ENV_FILE)
GROQ_API_KEY = os.getenv("GROQ_API_KEY", "").strip()

# Local translation cache for instant response on repeated queries
_TRANSLATION_CACHE = {}


def translate_text(text: str, target_lang: str = "hi") -> str:
    """
    Translates civic / municipal text between English and Hindi using Groq AI.
    Falls back gracefully to original text if offline.
    """
    if not text or not text.strip():
        return text

    text_clean = text.strip()
    cache_key = f"{target_lang}:{text_clean}"
    if cache_key in _TRANSLATION_CACHE:
        return _TRANSLATION_CACHE[cache_key]

    if not GROQ_API_KEY:
        return text_clean

    try:
        url = "https://api.groq.com/openai/v1/chat/completions"
        headers = {
            "Authorization": f"Bearer {GROQ_API_KEY}",
            "Content-Type": "application/json"
        }

        target_clean = target_lang.lower().strip()
        lang_map = {
            "hi": "Hindi (Devanagari script)",
            "ta": "Tamil (Tamil script)",
            "kn": "Kannada (Kannada script)",
            "en": "English"
        }
        lang_name = lang_map.get(target_clean, "Hindi")
        system_prompt = (
            f"You are a professional government translator specializing in Indian civic and municipal governance. "
            f"Translate the given text into clear, respectful, natural {lang_name}. "
            f"Preserve technical reference codes (like CC-2026-8942, Section 338, etc.) verbatim. "
            f"Respond strictly with the translated text only—no quotes, no preamble, and no explanation."
        )

        payload = {
            "model": "qwen/qwen3.8-27b",
            "messages": [
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": text_clean}
            ],
            "max_completion_tokens": 800,
            "temperature": 0.1
        }

        resp = requests.post(url, headers=headers, json=payload, timeout=8)
        if resp.status_code == 200:
            content = resp.json()["choices"][0]["message"].get("content", "").strip()
            if content:
                _TRANSLATION_CACHE[cache_key] = content
                return content
    except Exception as e:
        print(f"[TranslationService] Groq translation warning: {e}")

    return text_clean

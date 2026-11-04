"""
Location Validation Service for CivicConnect.
Validates whether a citizen-entered location is a real geographic address/landmark
within India, filtering out non-location words (e.g. 'theft', 'pothole', random noise)
and addresses outside India.

Integrates:
1. Google Maps Geocoding API (checks Google Maps coordinates & country)
2. Groq AI (Llama / Qwen model) for semantic verification and intelligent error explanations
"""

import os
import requests
import json
from dotenv import load_dotenv

# Load keys from .env
load_dotenv(".env")

GOOGLE_MAPS_API_KEY = os.getenv("GOOGLE_MAPS_API_KEY", "").strip()
GROQ_API_KEY = os.getenv("GROQ_API_KEY", "").strip()


def verify_location(address: str) -> dict:
    """
    Validates the provided location string.
    Returns:
    {
        "is_valid": bool,
        "formatted_location": str,
        "reason": str
    }
    """
    if not address or not address.strip():
        return {
            "is_valid": False,
            "formatted_location": "",
            "reason": "Location field cannot be empty. Please specify a street, landmark, or area."
        }

    address_clean = address.strip()

    # Quick heuristic check for obvious non-locations before making API calls
    obvious_non_locations = [
        "theft", "robbery", "murder", "accident", "pothole", "garbage", "trash",
        "issue", "problem", "broken", "complaint", "help", "hello", "hi", "test"
    ]
    if address_clean.lower() in obvious_non_locations:
        return {
            "is_valid": False,
            "formatted_location": "",
            "reason": f"'{address_clean}' is an issue description, not a geographic address. Please enter a valid street, ward, or landmark."
        }

    # 1. Try Groq AI for intelligent semantic and Indian geographic validation
    if GROQ_API_KEY:
        ai_result = _verify_with_groq(address_clean)
        if ai_result is not None:
            return ai_result

    # 2. Try Google Maps Geocoding API
    if GOOGLE_MAPS_API_KEY:
        maps_result = _verify_with_google_maps(address_clean)
        if maps_result is not None:
            return maps_result

    # 3. Fallback: Accept if it has at least 3 letters and is not obviously gibberish
    if len(address_clean) >= 4 and not address_clean.isdigit():
        return {
            "is_valid": True,
            "formatted_location": address_clean,
            "reason": "Location accepted."
        }

    return {
        "is_valid": False,
        "formatted_location": "",
        "reason": "Please enter a recognizable street, colony, or landmark."
    }


def _verify_with_groq(address: str):
    """Uses Groq AI to check if the address is a plausible Indian location."""
    try:
        url = "https://api.groq.com/openai/v1/chat/completions"
        headers = {
            "Authorization": f"Bearer {GROQ_API_KEY}",
            "Content-Type": "application/json"
        }
        
        system_prompt = (
            "You are a geographic validator for an Indian municipal civic grievance portal. "
            "Analyze the citizen-provided location. "
            "Reject if: "
            "1. It is a non-location word (e.g. 'theft', 'crime', 'pothole', 'fire', 'water', random gibberish). "
            "2. It is outside India (e.g. 'New York', 'London', 'Dubai', 'California'). "
            "Accept if: It is a plausible street, cross, sector, landmark, colony, ward, village, town, or city in India. "
            "Respond strictly in JSON with keys: "
            "is_valid (boolean), formatted_location (string), reason (string with clear explanation in 1 sentence)."
        )

        payload = {
            "model": "openai/gpt-oss-20b",
            "messages": [
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": f"Location to verify: {address}"}
            ],
            "response_format": {"type": "json_object"},
            "temperature": 0.1
        }

        resp = requests.post(url, headers=headers, json=payload, timeout=5)
        if resp.status_code == 200:
            data = resp.json()
            content = data["choices"][0]["message"]["content"]
            parsed = json.loads(content)
            return {
                "is_valid": bool(parsed.get("is_valid", False)),
                "formatted_location": parsed.get("formatted_location") or address,
                "reason": parsed.get("reason", "Location could not be verified.")
            }
    except Exception as e:
        print(f"[LocationValidator] Groq check error: {e}")

    return None


def _verify_with_google_maps(address: str):
    """Uses Google Maps Geocoding API with country:IN restriction."""
    try:
        url = "https://maps.googleapis.com/maps/api/geocode/json"
        params = {
            "address": address,
            "components": "country:IN",
            "key": GOOGLE_MAPS_API_KEY
        }
        resp = requests.get(url, params=params, timeout=5)
        data = resp.json()

        status = data.get("status")
        if status == "OK" and data.get("results"):
            top_result = data["results"][0]
            formatted = top_result.get("formatted_address", address)
            
            # Verify India component
            is_in_india = any(
                comp.get("short_name") == "IN"
                for comp in top_result.get("address_components", [])
            )
            
            if is_in_india:
                return {
                    "is_valid": True,
                    "formatted_location": formatted,
                    "reason": "Verified via Google Maps."
                }
            else:
                return {
                    "is_valid": False,
                    "formatted_location": formatted,
                    "reason": "This location is outside India. Please provide an Indian address."
                }
        elif status == "ZERO_RESULTS":
            return {
                "is_valid": False,
                "formatted_location": "",
                "reason": "Google Maps could not find this location in India. Please check the spelling or provide a nearby landmark."
            }
        elif status == "REQUEST_DENIED":
            # Billing not enabled on Google Cloud project
            return None

    except Exception as e:
        print(f"[LocationValidator] Google Maps check error: {e}")

    return None

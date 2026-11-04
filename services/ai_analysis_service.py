"""
AI Grievance Analysis & Monitoring Roadmap Service for CivicConnect.
Uses Groq AI (open-source models) to analyze citizen complaints,
determine legal framework, authority division, urgency, and generate
an actionable ground inspection and monitoring roadmap.
"""

import os
import json
import requests
from dotenv import load_dotenv

ENV_FILE = os.path.join(os.path.dirname(os.path.dirname(__file__)), ".env")
load_dotenv(ENV_FILE)
GROQ_API_KEY = os.getenv("GROQ_API_KEY", "").strip()


def analyze_grievance_with_groq(description: str, category: str = "", location: str = "") -> dict:
    """
    Analyzes a civic complaint using Groq AI.
    Returns:
    {
        "key_issue": str,
        "assigned_authority": str,
        "priority": "Low" | "Medium" | "High" | "Critical",
        "legal_framework": str,
        "monitoring_roadmap": [
            {"phase": "1. Site Inspection", "procedure": "..."},
            {"phase": "2. Permit Verification", "procedure": "..."},
            {"phase": "3. Enforcement / Action", "procedure": "..."},
            {"phase": "4. Remediation & Closure", "procedure": "..."}
        ]
    }
    """
    if GROQ_API_KEY:
        try:
            url = "https://api.groq.com/openai/v1/chat/completions"
            headers = {
                "Authorization": f"Bearer {GROQ_API_KEY}",
                "Content-Type": "application/json"
            }
            
            system_prompt = (
                "You are an expert Indian municipal governance officer and environmental/civic compliance auditor. "
                "Analyze the citizen's grievance. Identify the violation, the precise government authority, "
                "the priority level, the relevant Indian act/municipal bye-law, and a realistic 4-phase "
                "ground inspection & monitoring roadmap showing how field officers must investigate, monitor, and resolve this. "
                "Respond strictly in JSON format with these exact keys:\n"
                "{\n"
                '  "key_issue": "Concise summary of the civic violation or problem",\n'
                '  "assigned_authority": "Exact municipal or state division responsible (e.g. Tree Authority, Town Planning, Jal Board)",\n'
                '  "priority": "Low | Medium | High | Critical",\n'
                '  "legal_framework": "Applicable Indian Act or Municipal Regulation",\n'
                '  "monitoring_roadmap": [\n'
                '    {"phase": "1. Site Inspection", "procedure": "Detailed on-ground inspection procedure by officers"},\n'
                '    {"phase": "2. Permit Verification", "procedure": "Documents, NOCs, zoning plans or test reports checked"},\n'
                '    {"phase": "3. Enforcement / Action", "procedure": "Enforcement order, repair work, stop-work notice or seizure"},\n'
                '    {"phase": "4. Remediation & Closure", "procedure": "Restoration, replanting/repair verification and compliance closure"}\n'
                '  ]\n'
                "}"
            )

            user_content = f"Category: {category}\nLocation: {location}\nDescription: {description}"

            # Use high-throughput instruction model on Groq
            payload = {
                "model": "qwen/qwen3.8-27b",
                "messages": [
                    {"role": "system", "content": system_prompt},
                    {"role": "user", "content": user_content}
                ],
                "response_format": {"type": "json_object"},
                "max_completion_tokens": 1500,
                "temperature": 0.2
            }

            resp = requests.post(url, headers=headers, json=payload, timeout=14)
            if resp.status_code == 200:
                data = resp.json()
                content = data["choices"][0]["message"].get("content", "").strip()
                if content:
                    parsed = json.loads(content)
                    
                    # Normalize legal_framework if returned as a list
                    if isinstance(parsed.get("legal_framework"), list):
                        parsed["legal_framework"] = "; ".join(str(x) for x in parsed["legal_framework"])
                        
                    # Normalize monitoring_roadmap steps to guarantee {"phase": ..., "procedure": ...}
                    raw_roadmap = parsed.get("monitoring_roadmap", [])
                    if isinstance(raw_roadmap, list) and len(raw_roadmap) > 0:
                        normalized_roadmap = []
                        for idx, step in enumerate(raw_roadmap, start=1):
                            if isinstance(step, dict):
                                phase = step.get("phase") or f"Phase {idx}"
                                procedure = step.get("procedure") or step.get("description") or step.get("action") or str(step)
                                normalized_roadmap.append({"phase": phase, "procedure": procedure})
                            elif isinstance(step, str):
                                normalized_roadmap.append({"phase": f"Phase {idx}. Field Action", "procedure": step})
                        parsed["monitoring_roadmap"] = normalized_roadmap
                        return parsed
        except Exception as e:
            print(f"[AIAnalysis] Groq API error, falling back to deterministic template: {e}")

    # Fallback default template tailored to common civic issues (e.g. deforestation, drainage, lighting)
    return _generate_fallback_analysis(description, category, location)


def _generate_fallback_analysis(description: str, category: str, location: str) -> dict:
    """Provides high-quality fallback roadmap if API is offline."""
    desc_lower = description.lower()

    if "tree" in desc_lower or "forest" in desc_lower or "deforestation" in desc_lower or "cut" in desc_lower:
        return {
            "key_issue": "Unauthorized tree felling and green cover clearance for construction",
            "assigned_authority": "Municipal Tree Authority & State Forest Department",
            "priority": "Critical",
            "legal_framework": "Delhi/State Preservation of Trees Act; Forest (Conservation) Act, 1980",
            "monitoring_roadmap": [
                {
                    "phase": "1. Site Inspection",
                    "procedure": "Tree Officer conducts spot inspection, surveys perimeter, and logs geo-tagged evidence of felled trees."
                },
                {
                    "phase": "2. Permit Verification",
                    "procedure": "Audits builder's tree-felling NOC, Environmental Clearance, and municipal building sanction."
                },
                {
                    "phase": "3. Enforcement / Action",
                    "procedure": "If unpermitted, issues immediate Section 338 stop-work order and confiscates felling equipment."
                },
                {
                    "phase": "4. Remediation & Closure",
                    "procedure": "Mandates 1:10 compensatory afforestation planting, levies penalties, and files closure compliance."
                }
            ]
        }
    elif "drain" in desc_lower or "sewage" in desc_lower or "water" in desc_lower:
        return {
            "key_issue": "Drainage overflow and sanitation obstruction affecting public right-of-way",
            "assigned_authority": "Department of Urban Drainage & Public Health Engineering",
            "priority": "High",
            "legal_framework": "Municipal Solid Waste & Sewage Bye-Laws; Public Health Act",
            "monitoring_roadmap": [
                {
                    "phase": "1. Site Inspection",
                    "procedure": "Junior Engineer inspects sewage line and locates blockage between junction chambers."
                },
                {
                    "phase": "2. Equipment Dispatch",
                    "procedure": "Dispatches high-pressure jetting machine and suction tanker to clear obstruction."
                },
                {
                    "phase": "3. Flow Verification",
                    "procedure": "Verifies normalized stormwater flow and cleanses adjacent pedestrian walkways."
                },
                {
                    "phase": "4. Remediation & Closure",
                    "procedure": "Applies bleaching powder/disinfectant and issues completed resolution certificate."
                }
            ]
        }
    else:
        return {
            "key_issue": f"Civic Grievance: {category or 'General Infrastructure Issue'}",
            "assigned_authority": "Municipal Operations & Ward Works Division",
            "priority": "Medium",
            "legal_framework": "Municipal Corporation Act & Citizen Charter Guidelines",
            "monitoring_roadmap": [
                {
                    "phase": "1. Site Inspection",
                    "procedure": "Field inspector visits the reported landmark to assess severity and dimensions."
                },
                {
                    "phase": "2. Work Estimation",
                    "procedure": "Determines material and crew requirements under standard municipal maintenance schedule."
                },
                {
                    "phase": "3. Field Execution",
                    "procedure": "Dispatches maintenance crew to execute repairs and restore civic amenities."
                },
                {
                    "phase": "4. Verification & Closure",
                    "procedure": "Supervisor verifies completed repair and logs photographic proof for closure."
                }
            ]
        }

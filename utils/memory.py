from collections import defaultdict
from typing import List, Dict

# Stores last messages per session
# Format: { session_id: [ {"role": "...", "content": "..."}, ... ] }
memory_store: Dict[str, List[Dict[str, str]]] = defaultdict(list)
MAX_HISTORY = 10

def add_message(session_id: str, role: str, content: str):
    """Add a message and keep only the last MAX_HISTORY messages."""
    memory_store[session_id].append({"role": role, "content": content})
    if len(memory_store[session_id]) > MAX_HISTORY:
        memory_store[session_id] = memory_store[session_id][-MAX_HISTORY:]

def get_history(session_id: str) -> List[Dict[str, str]]:
    return memory_store.get(session_id, [])

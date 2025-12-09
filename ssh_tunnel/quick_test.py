#!/usr/bin/env python3
"""
Быстрый тест восстановления SSH подключения
"""
import json
import time
from pathlib import Path

def quick_test():
    """Быстрый тест восстановления"""
    config_file = Path.home() / ".config" / "ssh_tunnel_gui" / "config.json"
    
    print("🔧 Быстрый тест восстановления SSH подключения")
    print("=" * 50)
    
    # Проверяем текущее состояние
    if config_file.exists():
        with open(config_file, "r") as f:
            config = json.load(f)
        last_settings = config.get("last_settings", {})
        was_connected = last_settings.get("was_connected", False)
        restore_connection = last_settings.get("restore_connection", False)
        auto_reconnect = last_settings.get("auto_reconnect", False)
        
        print(f"📊 Текущее состояние:")
        print(f"   Was connected: {was_connected}")
        print(f"   Restore connection: {restore_connection}")
        print(f"   Auto-reconnect: {auto_reconnect}")
        
        ✅ ВСЕ ГОТОВО ДЛЯ ВОССТАНОВЛЕНИЯ!

if __name__ == "__main__":
    quick_test()

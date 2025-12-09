#!/usr/bin/env python3
"""
Тестовый скрипт для проверки восстановления SSH подключения
"""
import json
import os
from pathlib import Path

def check_config():
    """Проверяет содержимое конфигурационного файла"""
    config_file = Path.home() / ".config" / "ssh_tunnel_gui" / "config.json"
    
    print(f"Проверяем конфигурационный файл: {config_file}")
    
    if not config_file.exists():
        print("❌ Конфигурационный файл не существует")
        return False
    
    try:
        with open(config_file, "r") as f:
            config = json.load(f)
        
        last_settings = config.get("last_settings", {})
        
        print("📋 Содержимое конфигурации:")
        print(f"   Host: {last_settings.get('host', 'N/A')}")
        print(f"   Username: {last_settings.get('username', 'N/A')}")
        print(f"   Was connected: {last_settings.get('was_connected', False)}")
        print(f"   Auto-reconnect: {last_settings.get('auto_reconnect', False)}")
        print(f"   Restore connection: {last_settings.get('restore_connection', False)}")
        print(f"   Timestamp: {last_settings.get('timestamp', 'N/A')}")
        
        # Проверяем условия для восстановления
        was_connected = last_settings.get("was_connected", False)
        restore_connection = last_settings.get("restore_connection", False)
        auto_reconnect = last_settings.get("auto_reconnect", False)
        
        if was_connected and restore_connection and auto_reconnect:
            print("✅ Условия для восстановления выполнены!")
            return True
        else:
            print("❌ Условия для восстановления НЕ выполнены:")
            if not was_connected:
                print("   - Подключение не было активно")
            if not restore_connection:
                print("   - Восстановление отключено")
            if not auto_reconnect:
                print("   - Автопереподключение отключено")
            return False
            
    except Exception as e:
        print(f"❌ Ошибка при чтении конфигурации: {e}")
        return False

def simulate_connection_start():
    """Симулирует начало подключения"""
    config_file = Path.home() / ".config" / "ssh_tunnel_gui" / "config.json"
    
    # Создаем тестовые настройки
    test_settings = {
        "host": "test.example.com",
        "port": "22",
        "username": "testuser",
        "socks_port": "9050",
        "bind_addr": "127.0.0.1",
        "compression": True,
        "keepalive": True,
        "auth_method": "key",
        "key_type": "auto",
        "key_file": "",
        "active_profile": "",
        "auto_reconnect": True,
        "restore_connection": True,
        "was_connected": True,  # Симулируем активное подключение
        "timestamp": 1234567890
    }
    
    config = {"last_settings": test_settings}
    
    try:
        config_file.parent.mkdir(parents=True, exist_ok=True)
        with open(config_file, "w") as f:
            json.dump(config, f, indent=2)
        print("✅ Тестовая конфигурация создана")
        return True
    except Exception as e:
        print(f"❌ Ошибка при создании тестовой конфигурации: {e}")
        return False

def main():
    print("🧪 Тестирование восстановления SSH подключения")
    print("=" * 50)
    
    # Проверяем текущую конфигурацию
    print("\n1️⃣ Проверяем текущую конфигурацию:")
    check_config()
    
    # Создаем тестовую конфигурацию
    print("\n2️⃣ Создаем тестовую конфигурацию:")
    simulate_connection_start()
    
    # Проверяем тестовую конфигурацию
    print("\n3️⃣ Проверяем тестовую конфигурацию:")
    check_config()
    
    print("\n" + "=" * 50)
    print("🏁 Тест завершен")

if __name__ == "__main__":
    main()
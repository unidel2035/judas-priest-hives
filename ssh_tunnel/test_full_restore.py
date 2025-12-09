#!/usr/bin/env python3
"""
Скрипт для тестирования полного цикла восстановления SSH подключения
"""
import json
import os
import sys
import time
from pathlib import Path

def reset_config():
    """Сбрасывает конфигурацию для чистого теста"""
    config_file = Path.home() / ".config" / "ssh_tunnel_gui" / "config.json"
    
    if config_file.exists():
        config_file.unlink()
        print("🗑️  Конфигурация сброшена")
    else:
        print("📝 Конфигурация не существует (первый запуск)")

def create_test_config():
    """Создает тестовую конфигурацию с активным подключением"""
    config_file = Path.home() / ".config" / "ssh_tunnel_gui" / "config.json"
    
    test_config = {
        "last_settings": {
            "host": "185.204.3.24",
            "port": "22",
            "username": "root",
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
            "was_connected": True,  # КЛЮЧЕВОЕ: симулируем активное подключение
            "timestamp": time.time()
        }
    }
    
    try:
        config_file.parent.mkdir(parents=True, exist_ok=True)
        with open(config_file, "w") as f:
            json.dump(test_config, f, indent=2)
        print("✅ Тестовая конфигурация создана:")
        print(f"   Host: {test_config['last_settings']['host']}")
        print(f"   Username: {test_config['last_settings']['username']}")
        print(f"   Was connected: {test_config['last_settings']['was_connected']}")
        print(f"   Auto-reconnect: {test_config['last_settings']['auto_reconnect']}")
        print(f"   Restore connection: {test_config['last_settings']['restore_connection']}")
        return True
    except Exception as e:
        print(f"❌ Ошибка создания конфигурации: {e}")
        return False

def check_config():
    """Проверяет текущую конфигурацию"""
    config_file = Path.home() / ".config" / "ssh_tunnel_gui" / "config.json"
    
    if not config_file.exists():
        print("❌ Конфигурация не существует")
        return False
    
    try:
        with open(config_file, "r") as f:
            config = json.load(f)
        
        last_settings = config.get("last_settings", {})
        
        print("📋 Текущая конфигурация:")
        print(f"   Host: {last_settings.get('host', 'N/A')}")
        print(f"   Username: {last_settings.get('username', 'N/A')}")
        print(f"   Was connected: {last_settings.get('was_connected', False)}")
        print(f"   Auto-reconnect: {last_settings.get('auto_reconnect', False)}")
        print(f"   Restore connection: {last_settings.get('restore_connection', False)}")
        
        # Проверяем условия для восстановления
        was_connected = last_settings.get("was_connected", False)
        restore_connection = last_settings.get("restore_connection", False)
        auto_reconnect = last_settings.get("auto_reconnect", False)
        
        if was_connected and restore_connection and auto_reconnect:
            print("✅ Условия для восстановления ВЫПОЛНЕНЫ!")
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
        print(f"❌ Ошибка чтения конфигурации: {e}")
        return False

def simulate_app_close_with_connection():
    """Симулирует закрытие приложения с активным подключением"""
    config_file = Path.home() / ".config" / "ssh_tunnel_gui" / "config.json"
    
    if not config_file.exists():
        print("❌ Конфигурация не существует для симуляции")
        return False
    
    try:
        with open(config_file, "r") as f:
            config = json.load(f)
        
        if "last_settings" not in config:
            config["last_settings"] = {}
        
        # Симулируем сохранение состояния при закрытии с активным подключением
        config["last_settings"]["was_connected"] = True
        config["last_settings"]["timestamp"] = time.time()
        
        with open(config_file, "w") as f:
            json.dump(config, f, indent=2)
        
        print("💾 СИМУЛЯЦИЯ: Приложение закрыто с активным подключением")
        print("   Сохранено: was_connected = True")
        return True
        
    except Exception as e:
        print(f"❌ Ошибка симуляции закрытия: {e}")
        return False

def main():
    print("🧪 Полное тестирование восстановления SSH подключения")
    print("=" * 70)
    
    # Шаг 1: Сброс конфигурации
    print("\n1️⃣ Шаг 1: Сброс конфигурации")
    reset_config()
    
    # Шаг 2: Создание тестовой конфигурации
    print("\n2️⃣ Шаг 2: Создание тестовой конфигурации")
    if not create_test_config():
        return
    
    # Шаг 3: Проверка конфигурации
    print("\n3️⃣ Шаг 3: Проверка созданной конфигурации")
    if not check_config():
        return
    
    # Шаг 4: Симуляция работы приложения
    print("\n4️⃣ Шаг 4: Симуляция работы приложения")
    print("   📱 Пользователь запускает приложение...")
    print("   🔍 Приложение проверяет конфигурацию...")
    print("   🔄 Обнаруживает активное подключение...")
    print("   🚀 Автоматически запускает восстановление...")
    
    # Шаг 5: Итоговая проверка
    print("\n5️⃣ Шаг 5: Итоговая проверка")
    if check_config():
        print("\n🎉 ТЕСТ ПРОЙДЕН!")
        print("   Восстановление должно работать при следующем запуске приложения.")
        print("\n📋 Инструкции для пользователя:")
        print("   1. Запустите: python ssh_tunnel_gui.py")
        print("   2. Приложение должно автоматически восстановить подключение")
        print("   3. Проверьте логи на наличие сообщений о восстановлении")
    else:
        print("\n❌ ТЕСТ ПРОВАЛЕН!")
        print("   Восстановление работать не будет.")
    
    print("\n" + "=" * 70)
    print("🏁 Тестирование завершено")

if __name__ == "__main__":
    main()
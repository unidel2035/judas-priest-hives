#!/usr/bin/env python3
"""
Скрипт для включения восстановления SSH подключения
"""
import json
import os
from pathlib import Path

def enable_restore():
    """Включает восстановление подключения в конфигурации"""
    config_file = Path.home() / ".config" / "ssh_tunnel_gui" / "config.json"
    
    if not config_file.exists():
        print("❌ Конфигурационный файл не существует")
        return False
    
    try:
        with open(config_file, "r") as f:
            config = json.load(f)
        
        if "last_settings" not in config:
            config["last_settings"] = {}
        
        # Включаем необходимые настройки для восстановления
        config["last_settings"]["auto_reconnect"] = True
        config["last_settings"]["restore_connection"] = True
        config["last_settings"]["was_connected"] = True  # Симулируем активное подключение
        
        # Добавляем базовые настройки подключения если их нет
        if "host" not in config["last_settings"]:
            config["last_settings"]["host"] = "185.204.3.24"  # Ваш SSH сервер
        if "username" not in config["last_settings"]:
            config["last_settings"]["username"] = "root"
        if "port" not in config["last_settings"]:
            config["last_settings"]["port"] = "22"
        
        with open(config_file, "w") as f:
            json.dump(config, f, indent=2)
        
        print("✅ Восстановление подключения включено!")
        print(f"   Auto-reconnect: {config['last_settings']['auto_reconnect']}")
        print(f"   Restore connection: {config['last_settings']['restore_connection']}")
        print(f"   Was connected: {config['last_settings']['was_connected']}")
        print(f"   Host: {config['last_settings']['host']}")
        print(f"   Username: {config['last_settings']['username']}")
        
        return True
        
    except Exception as e:
        print(f"❌ Ошибка при обновлении конфигурации: {e}")
        return False

def main():
    print("🔧 Настройка восстановления SSH подключения")
    print("=" * 50)
    
    if enable_restore():
        print("\n✅ Настройки обновлены!")
        print("Теперь при следующем запуске приложение автоматически восстановит подключение.")
    else:
        print("\n❌ Не удалось обновить настройки")

if __name__ == "__main__":
    main()
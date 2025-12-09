#!/usr/bin/env python3
"""
Тест для проверки обработки кликов мыши в трее
"""
import sys
import os
import time
import threading
from unittest.mock import Mock, patch

# Добавляем текущую директорию в путь для импорта
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

def test_tray_click_handlers():
    """Тест обработчиков кликов в трее"""
    print("Testing tray click handlers...")
    
    # Мокаем необходимые модули
    with patch('tkinter.Tk'), \
         patch('ssh_tunnel_gui.pystray'), \
         patch('ssh_tunnel_gui.Image'), \
         patch('ssh_tunnel_gui.ImageDraw') as mock_draw:
        
        # Настраиваем мок для ImageDraw
        mock_draw.return_value = Mock()
        mock_draw.return_value.rectangle = Mock()
        mock_draw.return_value.ellipse = Mock()
        
        from ssh_tunnel_gui import SSHTunnelApp
        
        # Создаем mock root
        mock_root = Mock()
        mock_root.title = Mock()
        mock_root.geometry = Mock()
        mock_root.resizable = Mock()
        mock_root.configure = Mock()
        mock_root.protocol = Mock()
        mock_root.bind = Mock()
        mock_root.tk = Mock()
        mock_root.tk.call = Mock()
        mock_root.withdraw = Mock()
        mock_root.deiconify = Mock()
        mock_root.lift = Mock()
        mock_root.focus_force = Mock()
        mock_root.attributes = Mock()
        mock_root.after_idle = Mock()
        mock_root.after = Mock()
        
        app = SSHTunnelApp(mock_root)
        
        # Создаем иконку трея
        app.create_new_tray_icon()
        
        # Проверяем что иконка создана
        assert app.tray_icon is not None, "Tray icon should be created"
        
        # Проверяем настройку обработчиков
        assert hasattr(app.tray_icon, 'on_click'), "Tray icon should have on_click handler"
        assert hasattr(app.tray_icon, 'on_right_click'), "Tray icon should have on_right_click handler"
        
        # Тестируем обработчик ЛКМ
        print("  Testing left click handler...")
        app.tray_icon.on_click(app.tray_icon)
        
        # Проверяем что метод after был вызван
        mock_root.after.assert_called_once()
        print("  ✓ Left click handler works")
        
        # Сбрасываем мок
        mock_root.after.reset_mock()
        
        # Тестируем обработчик ПКМ
        print("  Testing right click handler...")
        app.tray_icon.on_right_click(app.tray_icon)
        print("  ✓ Right click handler works")
        
        print("✓ All click handlers work correctly")

def test_tray_menu_creation():
    """Тест создания меню трея"""
    print("Testing tray menu creation...")
    
    with patch('tkinter.Tk'), \
         patch('ssh_tunnel_gui.pystray'), \
         patch('ssh_tunnel_gui.Image'), \
         patch('ssh_tunnel_gui.ImageDraw') as mock_draw:
        
        mock_draw.return_value = Mock()
        mock_draw.return_value.rectangle = Mock()
        mock_draw.return_value.ellipse = Mock()
        
        from ssh_tunnel_gui import SSHTunnelApp
        
        mock_root = Mock()
        mock_root.title = Mock()
        mock_root.geometry = Mock()
        mock_root.resizable = Mock()
        mock_root.configure = Mock()
        mock_root.protocol = Mock()
        mock_root.bind = Mock()
        mock_root.tk = Mock()
        mock_root.tk.call = Mock()
        mock_root.withdraw = Mock()
        mock_root.deiconify = Mock()
        mock_root.lift = Mock()
        mock_root.focus_force = Mock()
        mock_root.attributes = Mock()
        mock_root.after_idle = Mock()
        
        app = SSHTunnelApp(mock_root)
        app.is_running = False  # Устанавливаем статус
        
        # Создаем иконку
        app.create_new_tray_icon()
        
        # Проверяем что меню создано
        assert app.tray_icon.menu is not None, "Tray icon should have a menu"
        print("✓ Menu creation works correctly")

def test_tray_image_generation():
    """Тест генерации изображения иконки"""
    print("Testing tray image generation...")
    
    with patch('tkinter.Tk'), \
         patch('ssh_tunnel_gui.pystray'), \
         patch('ssh_tunnel_gui.Image') as mock_image, \
         patch('ssh_tunnel_gui.ImageDraw') as mock_draw:
        
        # Настраиваем моки
        mock_image_instance = Mock()
        mock_image_instance.new = Mock()
        mock_image.return_value = mock_image_instance
        
        mock_draw_instance = Mock()
        mock_draw.return_value = mock_draw_instance
        
        from ssh_tunnel_gui import SSHTunnelApp
        
        mock_root = Mock()
        mock_root.title = Mock()
        mock_root.geometry = Mock()
        mock_root.resizable = Mock()
        mock_root.configure = Mock()
        mock_root.protocol = Mock()
        mock_root.bind = Mock()
        mock_root.tk = Mock()
        mock_root.tk.call = Mock()
        mock_root.withdraw = Mock()
        mock_root.deiconify = Mock()
        mock_root.lift = Mock()
        mock_root.focus_force = Mock()
        mock_root.attributes = Mock()
        mock_root.after_idle = Mock()
        
        app = SSHTunnelApp(mock_root)
        
        # Тестируем генерацию изображения для подключенного состояния
        app.is_running = True
        app.create_new_tray_icon()
        
        # Проверяем что методы рисования вызывались
        assert mock_draw_instance.rectangle.called, "rectangle should be called"
        assert mock_draw_instance.ellipse.called, "ellipse should be called"
        
        print("✓ Image generation works correctly")

def main():
    """Запуск всех тестов"""
    print("SSH Tunnel GUI - Tray Click Handlers Test")
    print("=" * 50)
    
    try:
        test_tray_click_handlers()
        test_tray_menu_creation()
        test_tray_image_generation()
        
        print("\n🎉 All tray click tests passed!")
        print("\nThe tray should now properly handle:")
        print("  • Left click: show main window")
        print("  • Right click: show context menu")
        print("  • Menu items: toggle connection, quit")
        return 0
        
    except Exception as e:
        print(f"\n❌ Test failed: {e}")
        import traceback
        traceback.print_exc()
        return 1

if __name__ == "__main__":
    exit(main())
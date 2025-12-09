#!/usr/bin/env python3
"""
Исправленная версия обработки кликов в трее - ПРОСТОЙ подход
"""
import pystray
from PIL import Image, ImageDraw

class TrayHandler:
    def __init__(self):
        self.tray_icon = None
        self.last_click_time = 0
        self.double_click_delay = 0.3
        
    def create_image(self, connected=False):
        """Создает иконку"""
        size = 64
        image = Image.new("RGBA", (size, size), (0, 0, 0, 0))
        dc = ImageDraw.Draw(image)

        color = "#00ff00" if connected else "#ff0000"
        
        # Рисуем иконку
        dc.rectangle([16, 16, 48, 48], fill=color, outline="#ffffff", width=2)
        dc.rectangle([20, 20, 44, 44], fill="#ffffff")
        dc.rectangle([24, 24, 40, 40], fill=color)
        
        if connected:
            dc.ellipse([48, 8, 56, 16], fill="#00ff00", outline="#ffffff", width=1)
        else:
            dc.ellipse([48, 8, 56, 16], fill="#ff0000", outline="#ffffff", width=1)

        return image

    def create_menu(self):
        """Создает контекстное меню"""
        def show_window(icon, item):
            print("MENU: Show Window")
            
        def toggle_connection(icon, item):
            print("MENU: Toggle Connection")
            
        def quit_app(icon, item):
            print("MENU: Quit")
            
        return pystray.Menu(
            pystray.MenuItem("🪟 Show Window", show_window),
            pystray.Menu.SEPARATOR,
            pystray.MenuItem("🔄 Toggle Connection", toggle_connection),
            pystray.Menu.SEPARATOR,
            pystray.MenuItem("❌ Quit", quit_app),
        )

    def create_tray_icon(self):
        """Создает иконку трея"""
        # Создаем иконку БЕЗ меню
        self.tray_icon = pystray.Icon(
            "test", 
            self.create_image(False), 
            "Test Tray"
        )
        
        # Настраиваем обработчики
        self.tray_icon.on_click = self.on_click
        self.tray_icon.on_right_click = self.on_right_click
        
        print("Tray icon created")
        print("- Left click: will show window (single) or toggle connection (double)")
        print("- Right click: will show context menu")

    def on_click(self, icon):
        """Обработчик ЛКМ"""
        import time
        current_time = time.time()
        
        if current_time - self.last_click_time <= self.double_click_delay:
            # Двойной клик
            print("DOUBLE CLICK: Toggle connection")
            self.last_click_time = 0
        else:
            # Одинарный клик
            self.last_click_time = current_time
            # Запускаем таймер для одиночного клика
            icon._configurator.after(int(self.double_click_delay * 1000), self._handle_single_click)

    def _handle_single_click(self):
        """Обработчик одиночного клика"""
        print("SINGLE CLICK: Show window")

    def on_right_click(self, icon):
        """Обработчик ПКМ"""
        print("RIGHT CLICK: Show context menu")
        # ПКМ должен показать контекстное меню
        icon.menu = self.create_menu()

    def run(self):
        """Запускает трей"""
        self.create_tray_icon()
        print("Starting tray...")
        self.tray_icon.run()

if __name__ == "__main__":
    handler = TrayHandler()
    handler.run()
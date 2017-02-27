//
//  AppDelegate.swift
//  Blockstack
//
//  Created by Larry Salibra on 2/26/17.
//  Copyright © 2017 Blockstack. All rights reserved.
//

import Cocoa

@NSApplicationMain
class AppDelegate: NSObject, NSApplicationDelegate {
    
    
    let productionModePortalPort = 8888
    let developmentModePortalPort = 3000
    let corsProxyPort = 1337
    let coreProxyPort = 6270
    
    
    var statusItem : NSStatusItem = NSStatusItem()
    
    var isDevModeEnabled : Bool = false


    func applicationDidFinishLaunching(_ aNotification: Notification) {
        NSLog("applicationDidFinishLaunching")
        statusItem = NSStatusBar.system().statusItem(withLength: NSSquareStatusItemLength)
        
        if let button = statusItem.button {
            button.image = NSImage(named: "MenuBar")
            button.alternateImage = NSImage(named: "MenuBarDark")
            button.action = #selector(statusItemClick)
        }
        
    }

    func applicationWillTerminate(_ aNotification: Notification) {
        // Insert code here to tear down your application
    }

    func portalBaseUrl() -> String {
        return "http://localhost:\(portalPort())"
    }
    
    func portalPort() -> Int {
        return isDevModeEnabled ? developmentModePortalPort : productionModePortalPort
    }
    
    func openPortalClick(sender: AnyObject?) {
        NSLog("openPortalClick")
        openPortal(path: "/")
    }
    
    func openPortal(path: String?) {
        let portalURL = URL(string: "\(portalBaseUrl())\(path ?? "/")")
        NSLog("Opening portal with URL: \(portalURL)")
        NSWorkspace.shared().open(portalURL!)
    }
    
    func statusItemClick(sender: AnyObject?) {
        NSLog("statusItemClick")
        
        let menu = NSMenu()
        
        var showExpandedMenu = false
        
        if(NSApp.currentEvent?.modifierFlags.contains(NSEventModifierFlags.option) ?? false) {
            NSLog("Option click")
            showExpandedMenu = true
        }
        
        var goToPortalTitle = "Go to Portal"
        
        if isDevModeEnabled {
            goToPortalTitle = "Go to Development Portal"
            showExpandedMenu = true
        }
        
        menu.addItem(withTitle: goToPortalTitle, action: #selector(openPortalClick), keyEquivalent: "g")
        menu.addItem(NSMenuItem.separator())
        
        if showExpandedMenu {
            
            let portalPortMenuItem = NSMenuItem()
            portalPortMenuItem.title = "Portal proxy running on port \(portalPort())"
            portalPortMenuItem.isEnabled = false
            menu.addItem(portalPortMenuItem)
            
            let corsProxyPortMenuItem = NSMenuItem()
            corsProxyPortMenuItem.title = "CORS proxy running on port \(corsProxyPort)"
            corsProxyPortMenuItem.isEnabled = false
            menu.addItem(corsProxyPortMenuItem)
            
            let corePortMenuItem = NSMenuItem()
            corePortMenuItem.title = "Core node running on port \(corsProxyPort)"
            corePortMenuItem.isEnabled = false
            menu.addItem(corePortMenuItem)
            
            menu.addItem(NSMenuItem.separator())
            
            let devModeStatusMenuItem = NSMenuItem()
            devModeStatusMenuItem.title = "Portal Development Mode: \(isDevModeEnabled ? "Enabled" : "Disabled")"
            devModeStatusMenuItem.isEnabled = false
            menu.addItem(devModeStatusMenuItem)
            
            menu.addItem(withTitle: "\(isDevModeEnabled ? "Disable" : "Enable") Portal Development Mode", action: #selector(devModeClick), keyEquivalent: "d")
            
            menu.addItem(NSMenuItem.separator())

        }
        
        menu.addItem(withTitle: "Turn off Blockstack", action: #selector(exitClick), keyEquivalent: "q")
        
        statusItem.popUpMenu(menu)
    }
    
    func devModeClick(sender: AnyObject?) {
        NSLog("devModeClick")
        isDevModeEnabled = !isDevModeEnabled
    }
    
    func exitClick(sender: AnyObject?) {
        NSLog("exitClick")
        
        let alert = NSAlert()
        
        alert.addButton(withTitle: "Turn off")
        alert.addButton(withTitle: "Cancel")
        alert.messageText = "Turn off Blockstack?"
        alert.informativeText = "You will not be able to access the decentralized internet if you turn off Blockstack."
        alert.alertStyle = NSAlertStyle.warning
        
        if alert.runModal() == NSAlertFirstButtonReturn {
            NSLog("User decided to exit...")
            
            NSStatusBar.system().removeStatusItem(statusItem)
            
            //            [self.blockstackProxyTask terminate];
            //            NSLog(@"Blockstack Portal proxy terminated");
            //
            //            [self.corsProxyTask terminate];
            //            NSLog(@"CORS proxy terminated");
            //
            //            [self stopBlockstackCoreApiAndExit];
            
            
        }
    }
}


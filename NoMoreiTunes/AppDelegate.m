//
//  AppDelegate.m
//  NoMoreiTunes
//
//  Created by Jared (jdf2) on 8/17/18.
//  MIT License 2018 NoMoreiTunes Developers
//

#import "AppDelegate.h"
#import "PFMoveApplication.h"

@interface AppDelegate ()

@property (weak) IBOutlet NSWindow *window;
@end

@implementation AppDelegate

- (void)applicationWillFinishLaunching:(NSNotification *)aNotification {
    PFMoveToApplicationsFolderIfNecessary();
}

- (void)applicationDidFinishLaunching:(NSNotification *)aNotification {
    // Insert code here to initialize your application
}

- (void)applicationWillTerminate:(NSNotification *)aNotification {
    // Insert code here to tear down your application
}

- (BOOL)applicationShouldTerminateAfterLastWindowClosed:(NSApplication *)theApplication {
    return YES;
}

@end

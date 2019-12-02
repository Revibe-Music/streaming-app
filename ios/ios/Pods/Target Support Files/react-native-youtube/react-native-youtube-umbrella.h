#ifdef __OBJC__
#import <UIKit/UIKit.h>
#else
#ifndef FOUNDATION_EXPORT
#if defined(__cplusplus)
#define FOUNDATION_EXPORT extern "C"
#else
#define FOUNDATION_EXPORT extern
#endif
#endif
#endif

#import "RCTYouTube.h"
#import "RCTYouTubeManager.h"
#import "RCTYouTubeStandalone.h"
#import "YTPlayerView.h"

FOUNDATION_EXPORT double react_native_youtubeVersionNumber;
FOUNDATION_EXPORT const unsigned char react_native_youtubeVersionString[];


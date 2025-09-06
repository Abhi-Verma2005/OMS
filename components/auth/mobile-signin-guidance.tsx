"use client"

import { useState, useEffect } from "react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Smartphone, ExternalLink, AlertTriangle } from "lucide-react"

export function MobileSignInGuidance() {
  const [isMobile, setIsMobile] = useState(false)
  const [userAgent, setUserAgent] = useState("")

  useEffect(() => {
    const checkMobile = () => {
      const ua = navigator.userAgent
      setUserAgent(ua)
      
      // Check if it's a mobile device
      const mobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(ua)
      setIsMobile(mobile)
    }

    checkMobile()
  }, [])

  if (!isMobile) return null

  const isInAppBrowser = /Instagram|FBAN|FBAV|FB_IAB|FBAN|FBAV|Instagram|Line|Twitter|LinkedInApp|WhatsApp|Snapchat|Pinterest|TikTok|WeChat|QQ/i.test(userAgent)

  return (
    <Card className="border-amber-200 bg-amber-50 dark:border-amber-800 dark:bg-amber-950/20">
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <Smartphone className="h-5 w-5 text-amber-600 dark:text-amber-400 mt-0.5 flex-shrink-0" />
          <div className="space-y-3 flex-1">
            <div>
              <h3 className="font-semibold text-amber-800 dark:text-amber-200">
                Mobile Sign-In Tips
              </h3>
              <p className="text-sm text-amber-700 dark:text-amber-300 mt-1">
                For the best experience on mobile, follow these steps:
              </p>
            </div>
            
            {isInAppBrowser ? (
              <Alert variant="destructive" className="border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-950/20">
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription className="text-sm">
                  <strong>In-App Browser Detected:</strong> You're using an in-app browser (like Instagram or Facebook). 
                  This often causes Google sign-in issues. Please:
                </AlertDescription>
                <div className="mt-2 space-y-1 text-sm">
                  <p>1. Tap the "Open in Browser" option (usually in the top-right menu)</p>
                  <p>2. Or copy the link and open in Chrome/Safari</p>
                  <p>3. Use email sign-in as an alternative</p>
                </div>
              </Alert>
            ) : (
              <div className="space-y-2 text-sm text-amber-700 dark:text-amber-300">
                <div className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-amber-200 dark:bg-amber-800 flex items-center justify-center text-xs font-bold">1</span>
                  <span>Use Chrome, Safari, or Firefox for best results</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-amber-200 dark:bg-amber-800 flex items-center justify-center text-xs font-bold">2</span>
                  <span>If Google sign-in fails, try incognito mode</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-amber-200 dark:bg-amber-800 flex items-center justify-center text-xs font-bold">3</span>
                  <span>Clear browser cache if you see errors</span>
                </div>
              </div>
            )}
            
            <div className="pt-2 border-t border-amber-200 dark:border-amber-800">
              <Button 
                variant="outline" 
                size="sm" 
                className="w-full text-amber-700 border-amber-300 hover:bg-amber-100 dark:text-amber-300 dark:border-amber-700 dark:hover:bg-amber-900/20"
                onClick={() => {
                  // Copy current URL to clipboard
                  navigator.clipboard.writeText(window.location.href)
                  alert("Link copied! Open it in your default browser.")
                }}
              >
                <ExternalLink className="w-4 h-4 mr-2" />
                Copy Link for Browser
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

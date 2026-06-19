"use client";

import { useState, useEffect } from "react";
import { Save, Store, CreditCard, Truck, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { toast } from "@/hooks/use-toast";
import { getWhatsAppNumber } from "@/lib/utils";

export function SettingsView() {
  const [isSaving, setIsSaving] = useState(false);
  const [settings, setSettings] = useState({
    storeName: "Izzy Signature",
    whatsappNumber: "",
    currency: "LKR",
    metaPixelId: "",
    facebookPage: "",
    instagramPage: "",
  });

  useEffect(() => {
    // Initialize with environment variables
    setSettings(prev => ({
      ...prev,
      whatsappNumber: getWhatsAppNumber(),
      metaPixelId: process.env.NEXT_PUBLIC_META_PIXEL_ID || "1710517860088102",
    }));
  }, []);

  const handleSave = async () => {
    setIsSaving(true);
    // In a real app, save to Supabase settings table
    await new Promise((resolve) => setTimeout(resolve, 500));
    toast({
      title: "Settings Saved",
      description: "Your settings have been updated.",
      variant: "success",
    });
    setIsSaving(false);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Settings</h1>
        <p className="text-muted-foreground">
          Manage your store settings
        </p>
      </div>

      <div className="space-y-6 max-w-2xl">
        {/* Store Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Store className="w-5 h-5 text-gold" />
              Store Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="storeName">Store Name</Label>
              <Input
                id="storeName"
                value={settings.storeName}
                onChange={(e) =>
                  setSettings({ ...settings, storeName: e.target.value })
                }
              />
            </div>
            <div>
              <Label htmlFor="currency">Currency</Label>
              <Input
                id="currency"
                value={settings.currency}
                onChange={(e) =>
                  setSettings({ ...settings, currency: e.target.value })
                }
              />
            </div>
          </CardContent>
        </Card>

        {/* WhatsApp Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <MessageCircle className="w-5 h-5 text-green-500" />
              WhatsApp Settings
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div>
              <Label htmlFor="whatsappNumber">WhatsApp Number</Label>
              <Input
                id="whatsappNumber"
                value={settings.whatsappNumber}
                onChange={(e) =>
                  setSettings({ ...settings, whatsappNumber: e.target.value })
                }
                placeholder="947XXXXXXXX"
              />
              <p className="text-xs text-muted-foreground mt-1">
                Format: 947XXXXXXXX (with country code, no + sign)
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Meta Pixel */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-blue-500" />
              Meta Pixel
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div>
              <Label htmlFor="metaPixelId">Pixel ID</Label>
              <Input
                id="metaPixelId"
                value={settings.metaPixelId}
                onChange={(e) =>
                  setSettings({ ...settings, metaPixelId: e.target.value })
                }
                placeholder="Enter your Meta Pixel ID"
              />
              <p className="text-xs text-muted-foreground mt-1">
                Used for Facebook Ads tracking
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Social Media */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Truck className="w-5 h-5 text-purple-500" />
              Social Media
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="facebookPage">Facebook Page URL</Label>
              <Input
                id="facebookPage"
                value={settings.facebookPage}
                onChange={(e) =>
                  setSettings({ ...settings, facebookPage: e.target.value })
                }
                placeholder="https://facebook.com/..."
              />
            </div>
            <div>
              <Label htmlFor="instagramPage">Instagram Page URL</Label>
              <Input
                id="instagramPage"
                value={settings.instagramPage}
                onChange={(e) =>
                  setSettings({ ...settings, instagramPage: e.target.value })
                }
                placeholder="https://instagram.com/..."
              />
            </div>
          </CardContent>
        </Card>

        <Separator />

        <Button
          onClick={handleSave}
          disabled={isSaving}
          className="min-w-[140px]"
        >
          {isSaving ? (
            <>
              <Save className="w-4 h-4 mr-2 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save className="w-4 h-4 mr-2" />
              Save Settings
            </>
          )}
        </Button>
      </div>
    </div>
  );
}

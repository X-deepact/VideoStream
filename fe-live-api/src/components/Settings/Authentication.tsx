import { useEffect, useState } from "react";
import { QRCodeSVG } from "qrcode.react";
import { Switch } from "@/components/ui/switch";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { get2FAInfo, change2FAStatus, verify2FA } from "@/services/auth";
import AppAlert from "@/components/AppAlert";

const Authentication = () => {
  const [code, setCode] = useState("");
  const [is2FAEnabled, setIs2FAEnabled] = useState(false);
  const [showDisableDialog, setShowDisableDialog] = useState(false);
  const [qrCode, setQrCode] = useState("");
  const [secret, setSecret] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isEnabling2FA, setIsEnabling2FA] = useState(false);

  // Fetch initial 2FA status
  useEffect(() => {
    const fetch2FAStatus = async () => {
      const { data, error } = await get2FAInfo();
      if (error) {
        setError("Failed to fetch 2FA status");
        return;
      }
      if (data) {
        setIs2FAEnabled(data.is2fa_enabled);
        if (data.qr_code) {
          setQrCode(data.qr_code);
          setSecret(data.secret);
        }
      }
    };
    fetch2FAStatus();
  }, []);

  const handle2FAToggle = async (checked: boolean) => {
    if (!checked) {
      setShowDisableDialog(true);
      return;
    }

    setIsEnabling2FA(true);
    const { data, error } = await change2FAStatus(true);
    if (error) {
      setError("Failed to enable 2FA");
      setIsEnabling2FA(false);
      return;
    }
    if (data) {
      setQrCode(data.qr_code);
      setSecret(data.secret);
    }
  };

  const handleConfirmDisable = async () => {
    const { error } = await change2FAStatus(false);
    if (error) {
      setError("Failed to disable 2FA");
      return;
    }
    setIs2FAEnabled(false);
    setQrCode("");
    setSecret("");
    setShowDisableDialog(false);
    setIsEnabling2FA(false);
    setSuccess("2FA has been disabled");
  };

  const handleVerify = async () => {
    if (code.length !== 6) {
      setError("Please enter a valid 6-digit code");
      return;
    }

    const { data, error } = await verify2FA(code);
    if (error) {
      setError("Invalid verification code");
      return;
    }
    if (data?.is_verified) {
      setIs2FAEnabled(true);
      setIsEnabling2FA(false);
      setSuccess("2FA has been enabled successfully");
    }
  };

  return (
    <div className="text-foreground">
      {error && (
        <AppAlert
          variant="destructive"
          title="Error"
          description={error}
          className="mb-4"
        />
      )}
      {success && (
        <AppAlert
          variant="default"
          title="Success"
          description={success}
          className="mb-4"
        />
      )}

      <div className="flex items-center justify-between mb-8 border-b border-gray-700 pb-4">
        <h2 className="text-3xl font-bold text-foreground">
          Two-factor authentication (2FA)
        </h2>
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">
            {is2FAEnabled ? "Enabled" : "Disabled"}
          </span>
          <Switch checked={is2FAEnabled || isEnabling2FA} onCheckedChange={handle2FAToggle} />
        </div>
      </div>

      {isEnabling2FA && !is2FAEnabled && (
        <div className="mb-8 rounded-2xl shadow-xl border border-gray-700/50 p-8">
          <h2 className="text-lg font-medium mb-2">Setup authenticator app</h2>
          <p className="text-muted-foreground mb-4">
            Scan the QR code below with your authenticator app to get started.
          </p>

          <div className="mb-6">
            <div className="bg-white p-4 w-48 h-48 mb-4 inline-block">
              <QRCodeSVG value={qrCode} size={160} level="H" />
            </div>

            <p className="text-sm text-muted-foreground mb-4">
              Or enter this setup key manually: <code>{secret}</code>
            </p>
          </div>

          <div className="mb-6">
            <h3 className="text-sm font-medium mb-2">
              Enter verification code from your app
            </h3>
            <div className="flex gap-4">
              <Input
                type="text"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="Enter 6-digit code"
                className="max-w-[200px]"
                maxLength={6}
              />
              <Button 
                onClick={handleVerify}
                disabled={code.length !== 6}
              >
                Verify
              </Button>
            </div>
          </div>
        </div>
      )}

      <AlertDialog open={showDisableDialog} onOpenChange={setShowDisableDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Disable 2FA?</AlertDialogTitle>
            <AlertDialogDescription>
              This will make your account less secure. Are you sure you want to
              disable two-factor authentication?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmDisable}
              className="bg-red-600 hover:bg-red-700"
            >
              Disable 2FA
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Authentication;
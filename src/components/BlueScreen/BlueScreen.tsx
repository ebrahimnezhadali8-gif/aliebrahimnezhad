import { useEffect } from "react";
import { useContent } from "../../hooks/useContent";
import "./BlueScreen.css";

/**
 * Easter egg: triple-click the Start button for a harmless Blue Screen of Death.
 * Any key press or click dismisses it, just like pretending to reboot.
 */
function BlueScreen({ onDismiss }: { onDismiss: () => void }) {
  const { t } = useContent();

  useEffect(() => {
    const dismiss = () => onDismiss();
    window.addEventListener("keydown", dismiss);
    return () => window.removeEventListener("keydown", dismiss);
  }, [onDismiss]);

  return (
    <div className="bsod" data-testid="bsod" onClick={onDismiss} role="alertdialog" aria-label="Blue screen">
      <p className="bsod__face">:(</p>
      <p>{t("bsodTitle")}</p>
      <p className="bsod__code">STOP: 0x000000HR (HIRE_ME_NOW, 0x00000001, 0xA11CE, 0xB0B)</p>
      <p className="bsod__hint">{t("bsodAction")}</p>
    </div>
  );
}

export default BlueScreen;

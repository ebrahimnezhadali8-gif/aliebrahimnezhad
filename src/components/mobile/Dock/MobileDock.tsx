import AppIcon from "../HomeScreen/AppIcon";
import { dockApps, type MobileIconItem } from "../mobileTypes";
import "./MobileDock.css";

interface MobileDockProps {
  onActivate: (item: MobileIconItem) => void;
}

function MobileDock({ onActivate }: MobileDockProps) {
  return (
    <div className="mdock" data-testid="mobile-dock">
      {dockApps.map((item) => (
        <AppIcon key={item.id} item={item} onActivate={onActivate} showLabel={false} />
      ))}
    </div>
  );
}

export default MobileDock;

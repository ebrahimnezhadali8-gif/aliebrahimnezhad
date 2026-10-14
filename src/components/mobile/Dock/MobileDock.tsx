import AppIcon from "../HomeScreen/AppIcon";
import { dockApps, type MobileIconItem } from "../mobileTypes";
import "./MobileDock.css";

interface MobileDockProps {
  onActivate: (item: MobileIconItem) => void;
  /** Same translation hook the home screen uses, so both stay in step. */
  label?: (item: MobileIconItem) => string;
}

function MobileDock({ onActivate, label }: MobileDockProps) {
  return (
    <div className="mdock" data-testid="mobile-dock">
      {dockApps.map((item) => (
        <AppIcon
          key={item.id}
          item={item}
          label={label?.(item)}
          onActivate={onActivate}
          showLabel={false}
        />
      ))}
    </div>
  );
}

export default MobileDock;
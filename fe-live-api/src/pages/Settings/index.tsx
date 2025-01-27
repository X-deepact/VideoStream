import { SettingsTabs } from '@/data/types/ui/settingTabs';
import LayoutHeading from '@/layouts/LayoutHeading';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import AccountInformation from './AccountInformation';
import Security from './Security';
import { useEffect, useState } from 'react';
import { ShieldCheck, UserRound } from 'lucide-react';

const title = 'Settings';

enum SETTINGS_TABS {
  ACCOUNT_INFO = 'account-info',
  SECURITY = 'security',
}

const tabs: SettingsTabs[] = [
  {
    label: 'Account Information',
    Icon: UserRound,
    value: SETTINGS_TABS.ACCOUNT_INFO,
    Page: <AccountInformation />,
  },
  {
    label: 'Security',
    Icon: ShieldCheck,
    value: SETTINGS_TABS.SECURITY,
    Page: <Security />,
  },
];

const Settings = () => {
  const [activeTab, setActiveTab] = useState<string>(
    SETTINGS_TABS.ACCOUNT_INFO
  );

  useEffect(() => {
    const hash = window.location.hash.replace('#', '');
    if (tabs.some((tab) => tab.value === hash)) {
      setActiveTab(hash);
    }
  }, []);

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    window.location.hash = value;
  };

  return (
    <div>
      <LayoutHeading title={title} />

      <Tabs value={activeTab} onValueChange={handleTabChange}>
        <TabsList>
          {tabs.map((tab) => (
            <TabsTrigger
              key={tab.value}
              value={tab.value}
              className="flex gap-1 items-center"
            >
              {tab?.Icon && <tab.Icon className="h-4 w-4" />} {tab.label}
            </TabsTrigger>
          ))}
        </TabsList>
        {tabs.map(
          (tab) =>
            activeTab === tab.value && (
              <TabsContent key={tab.value} className="mt-4" value={tab.value}>
                {tab.Page}
              </TabsContent>
            )
        )}
      </Tabs>
    </div>
  );
};

export default Settings;

import LeaderBoard from "../components/referral/LeaderBoard";
import Referral from "../components/referral/Referral";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { motion } from "framer-motion";
import { useState } from "react";

const Referrals = () => {
  const [activeTab, setActiveTab] = useState("leaderboard");

  const tabs = [
    { value: "leaderboard", label: "Leaderboard" },
    { value: "referral", label: "Referral" },
  ];

  return (
    <section className="h-screen overflow-auto scrollbar-hidden">
      <div className="mt-8">
        <Tabs defaultValue="leaderboard" className="w-full" onValueChange={setActiveTab}>
          <TabsList className="relative flex w-full border-b border-gray-800">
            {tabs.map((tab) => (
              <TabsTrigger
                key={tab.value}
                value={tab.value}
                className={`relative py-2 text-lg font-medium transition-colors duration-300 ease-in-out ${activeTab === tab.value ? 'text-blue mb-1 font-medium' : ''}`}
              >
                {tab.label}
                {activeTab === tab.value && (
                  <motion.div
                    layoutId="activeTabIndicator"
                    initial={{ opacity: 0, width: 0 }}
                    animate={{ opacity: 1, width: "100%" }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                    className="absolute bottom-0 left-0 h-1 bg-blue w-full"
                  />
                )}
              </TabsTrigger>
            ))}
          </TabsList>
          <div className="overflow-y-auto max-h-[calc(100vh-150px)]">
            <TabsContent value="leaderboard" className="mb-[120px]">
              <LeaderBoard />
            </TabsContent>
            <TabsContent value="referral" className="mb-[120px]">
              <Referral />
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </section>
  );
};

export default Referrals;
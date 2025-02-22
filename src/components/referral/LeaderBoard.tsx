import { useSelector } from "react-redux";
import { useState, useEffect } from "react";
import { Loader2 } from "lucide-react";
import leaderImg from "@/assets/icons/leader.svg";
import { RootState } from "../../store/store";

const LeaderBoard = () => {
  const topUsers = useSelector((state: RootState) => state.topUsers.value) ?? [];
  const [visibleUsers, setVisibleUsers] = useState(15);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);

  useEffect(() => {
    if (topUsers.length > 0) {
      setLoading(false);
    }
  }, [topUsers]);

  const loadMoreUsers = () => {
    if (loadingMore) return;
    setLoadingMore(true);

    setTimeout(() => {
      setVisibleUsers((prev) => prev + 7);
      setLoadingMore(false);
    }, 500);
  };

  return (
    <section className="mt-6 rounded-lg p-2 m-2">
      <h1 className="flex justify-center">
        <img src={leaderImg} alt="Leaderboard Icon" className="w-12 h-12 mb-3" />
      </h1>
      <small className="text-gray-400 flex justify-center text-center">
        Recognizing the top performers of the platform
      </small>

      {loading ? (
        <div className="flex justify-center py-6">
          <Loader2 className="animate-spin text-white w-6 h-6" />
        </div>
      ) : (
        <div className="mt-3 pb-12">
          {topUsers.length === 0 ? (
            <p className="text-white text-center">No users available</p>
          ) : (
            topUsers.slice(0, visibleUsers).map(({ id, balance, firstName, lastName }, idx) => (
              <div key={id} className="px-4 py-2">
                <div className="flex items-center justify-between">
                  <p className="text-gray-300 font-normal flex-[0.50] truncate">
                    {idx + 1}. {firstName} {lastName}
                  </p>
                  <p className="text-gray-300 font-light flex items-center">
                    {idx < 3 && "🔥"} {balance} <small className="text-sm">pts</small>
                  </p>
                </div>
                {idx < visibleUsers - 1 && <hr className="border-gray-700 my-2 opacity-50" />}
              </div>
            ))
          )}
        </div>
      )}

      {topUsers.length > visibleUsers && (
        <div className="flex justify-center mt-4 pb-4">
          <button
            onClick={loadMoreUsers}
            className="bg-blue text-white px-4 py-2 rounded-lg flex items-center transition-all duration-200 hover:bg-opacity-80 disabled:opacity-50"
            disabled={loadingMore}
          >
            {loadingMore ? (
              <>
                <Loader2 className="animate-spin w-4 h-4 mr-2" /> Loading...
              </>
            ) : (
              "Load more"
            )}
          </button>
        </div>
      )}
    </section>
  );
};

export default LeaderBoard;

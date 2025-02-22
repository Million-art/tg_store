import ReferredUsers from './ReferredUsers';
import referralImage from '../../assets/friends.png';
import gift from '../../assets/gift.png';

const Referral = () => {
  return (
    <section className="mb-24">
      <div className="flex flex-col justify-center items-center mt-8">
        <img src={referralImage} alt='Referred user' className="w-24 h-24 sm:w-16 sm:h-16" />
      </div>
      <div className="mt-1 flex flex-col text-white items-center">
        <h1 className="text-center text-2xl font-bold">Refer and Earn Rewards</h1>
        <small className="text-sm sm:text-base">Earn rewards when your friends join us!</small>
      </div>
      {/* Reward Cards */}
      <div className="flex flex-col gap-3 mx-6 my-4 sm:mx-12 sm:my-5">
        <div className="rounded-xl p-2 flex gap-2 w-full items-center text-white bg-gray-800">
          <span className="w-fit">
            <img src={gift} alt="Gift" className="w-10 h-10 sm:w-10 sm:h-10" />
          </span>
          <span>
            <h1 className="text-sm font-normal">Invite a friend with Telegram Premium</h1>
            <small className="text-xs text-gray-400">+500 PT 🔥</small>
          </span>
        </div>
        <div className="rounded-xl p-2 flex gap-2 w-full items-center text-white bg-gray-800">
          <span className="w-fit">
            <img src={gift} alt="Gift" className="w-8 h-8 sm:w-10 sm:h-10" />
          </span>
          <span>
            <h1 className="text-sm font-normal">Invite a friend</h1>
            <small className="text-xs text-gray-400">+100 PT</small>
          </span>
        </div>
      </div>
      {/* Referred User List */}
      <ReferredUsers />
    </section>
  );
};

export default Referral;

import flash from '@/assets/flash.png';
import yes from '@/assets/yes.png';
import { useState, useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { doc, getDoc, serverTimestamp, Timestamp, updateDoc } from 'firebase/firestore';
import { selectUser } from '../store/slice/userReducer';
import { setShowMessage } from '../store/slice/messageReducer';
import { db } from '../firebase/firebase';
import { telegramId } from '../libs/telegram';
import { setCoinShow } from '../store/slice/coinShowSlice';

const DailyCheckIn = () => {
  const dispatch = useDispatch();
  const user = useSelector(selectUser);
  const [claimAmount, setClaimAmount] = useState<number>(10);
  const [claimDay, setClaimDay] = useState<number>(1);
  const [isClaimed, setIsClaimed] = useState<boolean>(false);
  const [claimDisabled, setClaimDisabled] = useState<boolean>(false);
  const [nextClaimTime, setNextClaimTime] = useState<string>('12h');

  const formatCountdown = (hoursLeft: number): string => {
    const hours = Math.floor(hoursLeft);
    const minutes = Math.floor((hoursLeft - hours) * 60);
    return `${hours}h ${minutes}m`;
  };

  const calculateClaimAmount = useCallback(async () => {
    if (!user?.daily?.claimedTime) {
      setIsClaimed(false);
      setClaimDay(1);
      setClaimAmount(10);
      return;
    }

    const lastClaimTime =
      user.daily.claimedTime instanceof Timestamp
        ? user.daily.claimedTime.toDate()
        : new Date(user.daily.claimedTime);

    const now = Timestamp.now().toDate();
    const hoursDiff = (now.getTime() - lastClaimTime.getTime()) / (1000 * 3600);

    if (hoursDiff < 24) {
      setIsClaimed(true);
      setClaimDay(user.daily.claimedDay);
      setNextClaimTime(formatCountdown(24 - hoursDiff));
      return;
    }

    if (hoursDiff >= 48) {
      dispatch(
        setShowMessage({
          message: 'You skipped a day!',
          color: 'red',
        })
      );
      setIsClaimed(false);
      setClaimDay(1);
      setClaimAmount(10);
      return;
    }

    setIsClaimed(false);
    const newDay = user.daily.claimedDay + 1;
    setClaimDay(newDay);
    setClaimAmount(newDay <= 10 ? 10 * Math.pow(2, newDay - 1) : 10); // Reset to day 1 if the strike cap is 10 days
  }, [user, dispatch]);

  const handleClaim = async () => {
    try {
      setClaimDisabled(true);

      dispatch(
        setShowMessage({
          message: 'Claiming daily rewards...',
          color: 'green',
        })
      );

      const id = String(telegramId);
      const userRef = doc(db, 'users', id);

      // Fetch the current user's data to get the current balance
      const userDocSnapshot = await getDoc(userRef);
      const userData = userDocSnapshot.data();

      if (userData && userData.balance !== undefined) {
        const newBalance = userData.balance + claimAmount;

        // Update the user document with the new balance, claimed time, and claimed day
        await updateDoc(userRef, {
          daily: {
            claimedTime: serverTimestamp(),
            claimedDay: claimDay,
          },
          balance: newBalance,
        });

        dispatch(setCoinShow(true));
        setIsClaimed(true);

        dispatch(
          setShowMessage({
            message: `Successfully claimed ${claimAmount}PT!`,
            color: 'green',
          })
        );
      } else {
        throw new Error('User data is invalid or balance not found.');
      }
    } catch (error) {
      console.error('Error claiming daily reward:', error);
      dispatch(
        setShowMessage({
          message: 'Error. Please try again.',
          color: 'red',
        })
      );
    } finally {
      setClaimDisabled(false);
    }
  };

  useEffect(() => {
    calculateClaimAmount();

    if (!isClaimed) return;

    const interval = setInterval(() => {
      calculateClaimAmount();
    }, 60000); // Update every minute

    return () => clearInterval(interval);
  }, [calculateClaimAmount, isClaimed]);

  return (
    <div className="mx-10 sm:mx-[70px] text-white mt-5">
      <h1 className="text-xl sm:text-2xl font-bold">Daily Check-in</h1>
      <div className="flex my-5 justify-between items-center p-4 sm:p-5 rounded-xl bg-gray-dark">
        <div className="flex items-center gap-3">
          <img src={flash} alt="daily" className="w-8 h-8 sm:w-10 sm:h-10 rounded-full" />
          <div>
            <p className="text-sm sm:text-base"></p>
            <small className="text-xs sm:text-sm">
              {isClaimed ? `Next claim available in ${nextClaimTime}` : 'Ready to claim your daily reward!'}
            </small>
          </div>
        </div>
        <div className="flex items-center">
          {isClaimed ? (
            <img src={yes} alt="claimed" className="w-8 h-8 sm:w-10 sm:h-10 rounded-full" />
          ) : (
            <button
              className="bg-gradient-to-r from-blue-light to-blue-medium px-4 py-2 sm:px-5 sm:py-2 rounded-xl"
              onClick={handleClaim}
              disabled={claimDisabled}
            >
              Claim
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default DailyCheckIn;

// import { FaLink, FaTelegramPlane, FaShareAlt } from 'react-icons/fa';
// import { useState, useEffect } from "react";
// import { collection, query, where, getDocs } from "firebase/firestore";  
// import { firstName, telegramId } from '../../libs/telegram';
// import { db } from '../../firebase/firebase';
// import { ReferedUser } from '../../interface/ReferedUser';
 
// const ReferredUsers = () => {
//   const [referrals, setReferrals] = useState<ReferedUser[]>([]);  
//   const [isCopied, setIsCopied] = useState(false);
//   const id = String(telegramId);
//   const invitationLink = `https://t.me/huludelivery_bot?start=ref_${id}`;

//   // Fetch referred users from Firestore
//   useEffect(() => {
//     const fetchReferrals = async () => {
//       try {
//         const q = query(collection(db, "users"), where("referredBy", "==", id));
//         const querySnapshot = await getDocs(q);
  
//         const referredUsers: ReferedUser[] = [];
//         querySnapshot.forEach((doc) => {
//           referredUsers.push({ ...doc.data(), id: doc.id } as ReferedUser);
//         });
  
//         setReferrals(referredUsers);
//       } catch (error) {
//         console.error("Error fetching referrals: ", error);
//       }
//     };
  
//     fetchReferrals();
//   }, []);

//   const copyToClipboard = () => {
//     navigator.clipboard.writeText(invitationLink).then(() => {
//       setIsCopied(true);
//       setTimeout(() => setIsCopied(false), 2000);
//     });
//   };

//   return (
//     <div className="text-white w-full max-w-3xl mx-auto p-4">
//       <h1 className="text-2xl font-semibold text-center mb-6">Referral Link</h1>

//       <div className="flex justify-center mb-6">
//         <p className="bg-gray-medium text-white rounded-lg p-4 break-words w-full max-w-md text-center">
//           {invitationLink}
//         </p>
//       </div>

//       {/* Action buttons */}
//       <div className="flex justify-evenly items-center mb-8">
//         <div className="text-center flex flex-col">
//           <button className="bg-gray-medium hover:bg-gray-dark rounded p-3 flex items-center justify-center transition duration-300"
//             onClick={copyToClipboard}
//           >
//             <FaLink className="text-white text-xl" />
//           </button>
//           <h2 className="mt-2 text-sm text-white">{isCopied ? 'Copied!' : 'Copy'}</h2>
//         </div>

//         <div className="text-center flex flex-col">
//           <button
//             className="bg-gray-medium text-white py-2 px-4 rounded-lg flex items-center justify-center"
//             onClick={() => {
//               window.open(
//                 `https://t.me/share/url?url=${encodeURIComponent(invitationLink)}&text=${encodeURIComponent(
//                   `🎁🎁🎁Hello! ${firstName} invited You to earn rewards.🎁🎁🎁 Click the link and Earn :`
//                 )}`,
//                 "_blank"
//               );
//             }}
//           >
//             <FaTelegramPlane className="text-white text-xl" />
//           </button>
//           <h2 className="mt-2 text-sm text-white">Send</h2>
//         </div>

//         <div className="text-center flex flex-col">
//         <button
//           className="bg-gray-medium hover:bg-gray-dark rounded p-3 flex items-center justify-center transition duration-300"
//           onClick={() => {
//             const shareData = {
//               title: "Earn Rewards!",
//               text: `🎁🎁🎁 Hello! ${firstName} invited You to earn rewards. 🎁🎁🎁 Click the link and Earn:`,
//               url: invitationLink,
//             };

//             if (navigator.share) {
//               navigator
//                 .share(shareData)
//                 .catch((error) => console.error("Error sharing content:", error));
//             } else {
//               // Fallback for unsupported browsers
//               const encodedMessage = encodeURIComponent(
//                 `${shareData.text} ${shareData.url}`
//               );
//               const fallbackURL = `https://wa.me/?text=${encodedMessage}`;
//               window.open(fallbackURL, "_blank");
//             }
//           }}
//         >
//             <FaShareAlt className="text-white text-xl" />
//         </button>

//           <h2 className="mt-2 text-sm text-white">Share</h2>
//         </div>
//       </div>

//       {/* Referrals Section */}
//       <div className="bg-gray-dark rounded-lg p-6 shadow-xl max-h-96 overflow-y-auto">
//   {referrals.length === 0 ? (
//     <div className="text-center text-white">
//       {/* Loading Indicator */}
//       <div className="flex justify-center items-center py-4">
//         <div className="w-12 h-12 border-4 border-t-4 border-gray-600 border-t-transparent rounded-full animate-spin"></div>
//       </div>
//       <p>Loading your referrals...</p>
//     </div>
//   ) : (
//     referrals.map(({ balance, firstName, lastName, userImage }, idx) => (
//       <div key={idx} className="flex items-center justify-between py-4 border-b border-gray-700">
//         <div className="flex items-center">
//           <div className="mr-4 text-white rounded-full w-12 h-12 flex items-center justify-center">
//             <p>{idx + 1}</p>
//           </div>
//           <div className="flex items-center">
//             {userImage ? (
//               <img className="w-12 h-12 rounded-full" src={userImage} alt={firstName} />
//             ) : (
//               <div className="bg-gray-700 text-white w-12 h-12 rounded-full flex items-center justify-center">
//                 <p>{firstName[0]}</p>
//               </div>
//             )}
//             <div className="ml-4">
//               <p className="font-semibold text-white">{firstName} {lastName}</p>
//               <p className="text-sm text-gray-400">${balance}</p>
//             </div>
//           </div>
//         </div>
//       </div>
//     ))
//   )}
//     </div>

//     </div>
//   );
// };

// export default ReferredUsers;


import React from 'react'

const ReferredUsers = () => {
  return (
    <div>ReferredUsers</div>
  )
}

export default ReferredUsers
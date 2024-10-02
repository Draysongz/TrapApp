'use client'

import React, { useEffect } from 'react'
import { UserPlus, Share2 } from "lucide-react"
import TypingText from './TypingText'
import Pusher from 'pusher-js'
import { useState } from 'react'

const pusher = new Pusher("d70648a990c9399479e1", {
  cluster: "eu"
})

interface User {
  id: string;
  telegram_id: string;
  username: string;
  first_name?: string | null;
  last_name?: string | null;
  photo_url?: string | null;
  referral_code: string;
  referral_count: number;
  referral_link: string;
  createdAt?: Date | null;
  updatedAt?: Date | null;
}


export function Referrals({userId} : {userId: string}) {
 const [user, setUser] = useState<User | null>();

 const fetchUserAndNotify = async (telegramId) => {
    try {
      const response = await fetch('/api/user/fetchUser', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ telegramId }),
      });

      const data = await response.json();

      if (data.success) {
        console.log('User data:', data.user);
        // alert(data.user.referral_code)
        setUser(data.user); // Store user data in state
      } else {
        console.error('Error:', data.message);
        alert(`Error: ${data.message}`);
      }
    } catch (error) {
      console.error('Request error:', error);
      alert('An error occurred while fetching user data.');
    }
  };



const channel = pusher.subscribe("my-channel");
channel.bind('user-fetched', (data) => {
  console.log('User fetched:', data.user);
});

useEffect(()=>{
  if(userId){
    fetchUserAndNotify(userId)
  }else{
    console.log("userId not found")
  }
},[userId])

const copyLink = async(text)=>{
  navigator.clipboard.writeText(text)
  alert("link copied")
}

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-bold">Referrals</h2>
      <div className="border border-green-400 p-2">
        <h3 className="text-sm font-semibold mb-2">Your Referral Link</h3>
        <div className="flex items-center justify-between bg-green-900 bg-opacity-20 p-1">
          {user && <code className="text-sm">
            <TypingText text={user.referral_link} />
           
          </code>}
          <button className="text-green-400" onClick={()=>{copyLink(user?.referral_link)}}>
            <Share2 size={16} />
          </button>
        </div>
      </div>
      <div className="border border-green-400 p-2">
        <h3 className="text-sm font-semibold mb-2">Referral Stats</h3>
        <div className="flex items-center text-green-400">
          <UserPlus size={16} className="mr-2" />
          <p className="text-sm">${user && user.referral_count?`${user.referral_count} dealers recruited` : " 0 dealers recruited" } </p>
        </div>
        <p className="text-xs mt-1">Earn 10% of your recruits&apos; profits!</p>
      </div>
    </div>
  )
}
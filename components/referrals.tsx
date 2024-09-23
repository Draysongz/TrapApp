'use client'

import React from 'react'
import { UserPlus, Share2 } from "lucide-react"
import TypingText from './TypingText'

export function Referrals() {
  return (
    <div className="space-y-4">
      <h2 className="text-lg font-bold">Referrals</h2>
      <div className="border border-green-400 p-2">
        <h3 className="text-sm font-semibold mb-2">Your Referral Code</h3>
        <div className="flex items-center justify-between bg-green-900 bg-opacity-20 p-1">
          <code className="text-sm">
            <TypingText text="UNDERGROUND123" />
          </code>
          <button className="text-green-400">
            <Share2 size={16} />
          </button>
        </div>
      </div>
      <div className="border border-green-400 p-2">
        <h3 className="text-sm font-semibold mb-2">Referral Stats</h3>
        <div className="flex items-center text-green-400">
          <UserPlus size={16} className="mr-2" />
          <p className="text-sm">5 dealers recruited</p>
        </div>
        <p className="text-xs mt-1">Earn 10% of your recruits&apos; profits!</p>
      </div>
    </div>
  )
}
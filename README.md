Thought for 3 seconds### TG Store - Telegram-Based E-commerce Platform

## Overview

TG Store is a modern e-commerce platform built specifically for Telegram Mini Apps. It allows businesses to sell products directly within the Telegram messenger, providing a seamless shopping experience for customers without leaving the app.





## Features

- **Product Catalog**: Browse products with images, descriptions, and pricing
- **Category Filtering**: Filter products by categories
- **Shopping Cart**: Add, remove, and update quantities of products
- **User Authentication**: Automatic authentication via Telegram
- **Order Management**: Place and track orders
- **Payment Integration**: Support for Cash on Delivery and Chapa payment gateway
- **Dark/Light Mode**: Toggle between dark and light themes
- **Referral System**: Invite friends and earn rewards
- **Points System**: Earn and spend points for purchases
- **Daily Check-in**: Earn rewards for daily app usage


## Technology Stack

- **Frontend**: React, TypeScript, Tailwind CSS
- **State Management**: Redux Toolkit
- **Backend**: Firebase (Firestore, Cloud Functions)
- **Authentication**: Telegram Mini Apps SDK
- **Payment Processing**: Chapa Integration
- **Routing**: React Router
- **UI Components**: Custom components with Lucide React icons


## Prerequisites

- Node.js (v16 or higher)
- Firebase account
- Telegram Bot (for hosting the Mini App)
- Chapa account (for payment processing)


## Installation

1. Clone the repository:

```shellscript
git clone https://github.com/yourusername/tg-store.git
cd tg-store
```


2. Install dependencies:

```shellscript
npm install
```


3. Create a `.env` file in the root directory with the following variables:

```plaintext
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain
VITE_FIREBASE_PROJECT_ID=your_firebase_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_firebase_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_firebase_messaging_sender_id
VITE_FIREBASE_APP_ID=your_firebase_app_id
VITE_CHAPA_PUBLIC_KEY=your_chapa_public_key
```


4. Start the development server:

```shellscript
npm run dev
```

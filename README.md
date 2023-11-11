# Online-Booking

"Online-Booking is a web application designed to streamline the online booking process for wellness events, such as health talks and onsite screenings. The platform also provides a mechanism for vendors to review and either approve or reject these event requests."


# Prerequisites

Before you begin, ensure you have met the following requirements:
* Node JS v20.9.0

# Using Online-Booking
Add .env file with these variables
```env
VITE_BASE_URL=http://localhost:3000/api/v1 //exactly same
VITE_GOOGLE_MAP_API_KEY=<YOUR GOOGLE MAP API KEY>
```

Installing dependencies :
```
npm install
```
Run application :
```
npm run dev
```

# Pages and Components
Online-Booking has 2 pages : 
- Login Page
- Dashboard Page (There are distinct dashboard interfaces for Company HR and Vendors.)

and also have 2 modal types :
- View Modal (There are distinct modal interfaces for Company HR and Vendors.)
- Confirm Modal (only for Vendor)

# App Flow

- Base Flow
Everytime you go to the website if you not logged in you will redirected to Login Page
![Login Page Image](https://github.com/sutanarief/online-booking-fe/blob/main/src/assets/loginPage.png)


## Company HR Flow
As an 


export const LoginPageConstantLines = {
  phoneNumber: {
    heading: "Enter Phone Number",
    subTitle: "We’ll send you an OTP for verification",
    warning: "Incorrect Number.",
  },
  otp: {
    heading: "Verify OTP",
    subTitle: "OTP sent to +91 ",
    warning: "OTP is not correct.",
    resendOtp: "Didn’t recieve the OTP?",
    issue: "Still facing difficulties? ",
  },
};

export const Colors = {
  primary: "#5F46E3",
  accent: "#7c66ec",
  background: "#FFFFFF",
  danger: "#CC2C2C",
  black: "#0D1015",
  white: "#FFFFFF",
  gray: "#333A47",

  lightPrimary: "#DCD8F8",
  green: "#008444",
  lightGray: "#F3F3F4",
  BGColorList: [
    "#FFF3DC",
    "#E0F6FF",
    "#ECE9FF",
    "#FFEAF4",

    "#E1F9E3",
    "#FFE8DC",
    "#FFE8DC",
  ],
  borderColorList: [
    "#FFB023",
    "#3090E8",
    "#5F46E3",
    "#C91E5C",
    "#008444",
    "#D65E25",
  ],
  text: {
    title: "#111B21",
    description: "#667781",
  },
};

export const GENDERS = [
  { value: "MALE", label: "Male" },
  { value: "FEMALE", label: "Female" },
  { value: "OTHER", label: "Other" },
] as const;

export const WEEK_DAYS = [
  "MONDAY",
  "TUESDAY",
  "WEDNESDAY",
  "THURSDAY",
  "FRIDAY",
  "SATURDAY",
  "SUNDAY",
] as const;

export const statusToShortCode: { [key: string]: string } = {
  PRESENT: "P",
  ABSENT: "A",
  "ABSENT/2": "A/2",
  HALF_DAY: "HD",
  WEEK_OFF: "WO",
  HOLIDAY: "H",
  SICK_LEAVE: "SL",
  CASUAL_LEAVE: "CL",
  FESTIVAL: "FL",
  UNPAID_LEAVE: "UL",
  COMPENSATORY: "CO",
  EARNED_LEAVE: "EL",
  "SICK_LEAVE/2": "SL/2",
  "CASUAL_LEAVE/2": "CL/2",
  "FESTIVAL/2": "FL/2",
  "UNPAID_LEAVE/2": "UL/2",
  "COMPENSATORY/2": "CO/2",
  "EARNED_LEAVE/2": "EL/2",
} as const;

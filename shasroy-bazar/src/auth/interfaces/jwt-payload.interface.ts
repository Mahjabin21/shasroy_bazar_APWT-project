export type JwtPayload =
  | {
      sub: number;
      email: string;
      role: 'admin';
      accountType: 'administrator';
    }
  | {
      sub: number;
      merchantId: number;
      role: 'merchant';
      accountType: 'merchant';
    }
  | {
      sub: number;
      mobileNumber: string;
      role: 'user';
      accountType: 'user';
    };